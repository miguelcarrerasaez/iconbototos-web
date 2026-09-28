import os
import hmac
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

# 1. Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# SEGURIDAD, TOKENS Y CREDENCIALES
# ==========================================

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    es_produccion = bool(os.environ.get("RENDER")) or os.environ.get("FLASK_ENV") == "production"
    if es_produccion:
        raise ValueError(
            "¡ERROR CRÍTICO! Falta JWT_SECRET_KEY en las variables de entorno. "
            "Agrega una clave segura en backend/.env antes de desplegar."
        )
    JWT_SECRET_KEY = "dev-only-clave-insegura-no-usar-en-produccion"
    print("⚠️ AVISO: JWT_SECRET_KEY no definida. Usando clave de desarrollo (SOLO local).")

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

access_token = os.getenv("MP_ACCESS_TOKEN")
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN en las variables de entorno.")
sdk = mercadopago.SDK(access_token)


# ==========================================
# CONFIGURACIÓN DE LA BASE DE DATOS
# ==========================================
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = 'sqlite:///tienda.db'

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def _parsear_galeria(valor):
    """Convierte la columna galeria (JSON de texto) en una lista real para el frontend."""
    if not valor:
        return []
    try:
        lista = json.loads(valor)
        return lista if isinstance(lista, list) else []
    except (TypeError, ValueError):
        return []

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False)
    imagen_hover = db.Column(db.String(200), nullable=True) 
    stock = db.Column(db.Integer, default=10)
    categoria = db.Column(db.String(100), nullable=True)
    autor = db.Column(db.String(100), nullable=True)
    descripcion = db.Column(db.Text, nullable=True)
    galeria = db.Column(db.Text, nullable=True) # JSON con URLs de ImgBB
    destacado = db.Column(db.Boolean, default=False) # ⭐️ Producto destacado (carrusel del Home)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "precio": self.precio,
            "imagen": self.imagen,
            "imagen_hover": self.imagen_hover, 
            "stock": self.stock,
            "categoria": self.categoria,
            "autor": self.autor,
            "descripcion": self.descripcion,
            "galeria": _parsear_galeria(self.galeria),
            "destacado": self.destacado
        }

# ==========================================
# MIGRACIÓN LIGERA
# ==========================================
def _seleccionar_columnas(tabla):
    try:
        if str(DATABASE_URL).startswith("postgresql://"):
            filas = db.session.execute(db.text(
                "SELECT column_name FROM information_schema.columns WHERE table_name = :t"
            ), {"t": tabla}).fetchall()
            return [f[0] for f in filas]
        filas = db.session.execute(db.text("PRAGMA table_info(" + tabla + ")")).fetchall()
        return [f[1] for f in filas]
    except Exception as e:
        return []

def _migrar_columnas_producto():
    columnas = _seleccionar_columnas("producto")
    for columna, tipo in [
        ("categoria", "VARCHAR(100)"),
        ("autor", "VARCHAR(100)"),
        ("descripcion", "TEXT"),
        ("galeria", "TEXT"),
        ("destacado", "BOOLEAN DEFAULT FALSE"),
    ]:
        if columna in columnas:
            continue
        try:
            db.session.execute(db.text("ALTER TABLE producto ADD COLUMN %s %s" % (columna, tipo)))
            db.session.commit()
            print("📦 Migración: columna '%s' agregada." % columna, flush=True)
        except Exception as e:
            pass

with app.app_context():
    db.create_all()
    _migrar_columnas_producto()


# ==========================================
# RUTAS DE API
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json or {}
    usuario = str(datos.get('usuario') or datos.get('username') or '')
    password = str(datos.get('password') or '')

    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

    if (
        ADMIN_USERNAME and ADMIN_PASSWORD
        and hmac.compare_digest(usuario, ADMIN_USERNAME)
        and hmac.compare_digest(password, ADMIN_PASSWORD)
    ):
        token_vip = create_access_token(identity=usuario)
        return jsonify({"token": token_vip}), 200

    return jsonify({"error": "Credenciales incorrectas"}), 401

@app.route('/api/productos', methods=['GET'])
def obtener_productos():
    productos_db = Producto.query.all()
    return jsonify([p.to_dict() for p in productos_db])

@app.route('/api/productos', methods=['POST'])
@jwt_required()
def agregar_producto():
    try:
        datos = request.get_json(silent=True) or {}
        
        try: precio_int = int(datos.get('precio', 0))
        except ValueError: precio_int = 0
            
        try: stock_int = int(datos.get('stock', 0))
        except ValueError: stock_int = 0

        # Convierte el arreglo de URLs de galería en un string JSON para guardarlo
        galeria_urls = datos.get('galeria', [])
        galeria_json = json.dumps(galeria_urls) if isinstance(galeria_urls, list) else '[]'

        nuevo_producto = Producto(
            titulo=datos.get('titulo', 'Sin título'),
            precio=precio_int,
            imagen=datos.get('imagen', ''),
            imagen_hover=datos.get('imagen_hover', ''),
            stock=stock_int,
            categoria=datos.get('categoria'),
            autor=datos.get('autor'),
            descripcion=datos.get('descripcion'),
            galeria=galeria_json,
            destacado=bool(datos.get('destacado', False)) # ⭐️ Carrusel del Home
        )
        db.session.add(nuevo_producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto agregado", "producto": nuevo_producto.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/productos/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_producto(id):
    producto = db.session.get(Producto, id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    
    datos = request.get_json(silent=True) or {}
    
    producto.titulo = datos.get('titulo', producto.titulo)
    try: producto.precio = int(datos.get('precio', producto.precio))
    except ValueError: pass
    
    try: producto.stock = int(datos.get('stock', producto.stock))
    except ValueError: pass
    
    producto.imagen = datos.get('imagen', producto.imagen)
    producto.imagen_hover = datos.get('imagen_hover', producto.imagen_hover)
    producto.categoria = datos.get('categoria', producto.categoria)
    producto.autor = datos.get('autor', producto.autor)
    producto.descripcion = datos.get('descripcion', producto.descripcion)
    
    # ⭐️ Producto destacado (carrusel del Home)
    if 'destacado' in datos:
        producto.destacado = bool(datos.get('destacado', False))

    # Si viene galería nueva, la guardamos
    if 'galeria' in datos:
        galeria_urls = datos.get('galeria')
        producto.galeria = json.dumps(galeria_urls) if isinstance(galeria_urls, list) else '[]'
    
    db.session.commit()
    return jsonify({"mensaje": "Producto actualizado", "producto": producto.to_dict()})

@app.route('/api/productos/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_producto(id):
    producto = db.session.get(Producto, id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"mensaje": "Producto eliminado exitosamente"})


# ==========================================
# RUTAS DE MERCADO PAGO
# ==========================================
@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        datos = request.json or {}
        carrito = datos.get("carrito", [])

        if not isinstance(carrito, list) or not carrito:
            return jsonify({"error": "El carrito está vacío."}), 400

        items_mp = []
        for producto in carrito:
            titulo = producto.get("titulo", "Producto sin nombre")
            try:
                cantidad = int(producto.get("cantidad"))
                precio = int(producto.get("precio"))
            except (TypeError, ValueError):
                return jsonify({"error": f"Cantidad o precio inválido en '{titulo}'."}), 400

            if cantidad < 1 or precio <= 0:
                return jsonify({"error": f"Valores inválidos en '{titulo}'."}), 400

            items_mp.append({
                "title": titulo,
                "quantity": cantidad,
                "unit_price": precio,
                "currency_id": "CLP"
            })

        WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://iconbototos-api.onrender.com")
        FRONTEND_URL = os.getenv("FRONTEND_URL", "https://iconbototos-web.vercel.app")

        preference_data = {
            "items": items_mp,
            "back_urls": {
                "success": f"{FRONTEND_URL}/",
                "failure": f"{FRONTEND_URL}/",
                "pending": f"{FRONTEND_URL}/"
            },
            "auto_return": "approved",
            "notification_url": f"{WEBHOOK_URL}/webhook"
        }

        preference_response = sdk.preference().create(preference_data)
        return jsonify({"id": preference_response["response"]["id"]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if data and (data.get("type") == "payment" or data.get("action") == "payment.created"):
        try:
            payment_id = data.get("data", {}).get("id")
            payment_info = sdk.payment().get(payment_id)
            
            if payment_info["status"] == 200 and payment_info["response"].get("status") == "approved":
                items_comprados = payment_info["response"].get("additional_info", {}).get("items", [])
                descontar_stock(items_comprados)
        except Exception as e:
            print(f"Error procesando el webhook: {e}")

    return jsonify({"status": "ok"}), 200

def descontar_stock(items_comprados):
    for item in items_comprados:
        titulo_comprado = item.get("title")
        cantidad_comprada = int(item.get("quantity", 1))
        producto = Producto.query.filter_by(titulo=titulo_comprado).first()
        
        if producto:
            producto.stock = max(0, producto.stock - cantidad_comprada)
            db.session.commit()

if __name__ == "__main__":
    app.run(debug=True, port=5000)