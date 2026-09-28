import os
import hmac
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

# ---- JWT_SECRET_KEY (firma de los tokens VIP del panel) ----
# Se lee ESTRICTAMENTE desde las variables de entorno (backend/.env).
# En producción el servidor se NEGARÁ a arrancar sin esta variable.
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

# ---- Credenciales del panel de administración (/admin) ----
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    print("⚠️ AVISO: ADMIN_USERNAME o ADMIN_PASSWORD no definidas en backend/.env. "
          "El login del panel denegará el acceso hasta configurarlas.")

# Configuración de Mercado Pago
access_token = os.getenv("MP_ACCESS_TOKEN")
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN en las variables de entorno.")
sdk = mercadopago.SDK(access_token)


# ==========================================
# CONFIGURACIÓN DE LA BASE DE DATOS (NEON / SQLITE)
# ==========================================
# 1. Intentamos leer la URL de la base de datos del servidor (Render/Neon)
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # SQLAlchemy requiere que la URL empiece con 'postgresql://' en lugar de 'postgres://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # 2. Si no hay URL en el entorno, usamos SQLite local para que no se rompa nada en tu PC
    DATABASE_URL = 'sqlite:///tienda.db'

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False)
    imagen_hover = db.Column(db.String(200), nullable=True) # 📸 Segunda foto
    stock = db.Column(db.Integer, default=10)
    # 🔎 Detalles del producto (opcionales para no romper datos existentes)
    categoria = db.Column(db.String(100), nullable=True)
    autor = db.Column(db.String(100), nullable=True)
    descripcion = db.Column(db.Text, nullable=True)

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
            "descripcion": self.descripcion
        }

# ==========================================
# MIGRACIÓN LIGERA: agrega columnas nuevas sin perder datos
# ==========================================
def _seleccionar_columnas(tabla):
    """Devuelve las columnas existentes (SQLite vía PRAGMA, Postgres vía information_schema)."""
    try:
        if str(DATABASE_URL).startswith("postgresql://"):
            filas = db.session.execute(db.text(
                "SELECT column_name FROM information_schema.columns WHERE table_name = :t"
            ), {"t": tabla}).fetchall()
            return [f[0] for f in filas]
        filas = db.session.execute(db.text("PRAGMA table_info(" + tabla + ")")).fetchall()
        return [f[1] for f in filas]
    except Exception as e:
        print("⚠️ No se pudo inspeccionar la tabla '%s': %s" % (tabla, e), flush=True)
        return []

def _migrar_columnas_producto():
    """ALTER TABLE idempotente: agrega categoria/autor/descripcion si faltan."""
    columnas = _seleccionar_columnas("producto")
    for columna, tipo in [
        ("categoria", "VARCHAR(100)"),
        ("autor", "VARCHAR(100)"),
        ("descripcion", "TEXT"),
    ]:
        if columna in columnas:
            continue
        try:
            db.session.execute(db.text("ALTER TABLE producto ADD COLUMN %s %s" % (columna, tipo)))
            db.session.commit()
            print("📦 Migración: columna '%s' agregada a 'producto'." % columna, flush=True)
        except Exception as e:
            print("⚠️ Migración '%s' omitida: %s" % (columna, e), flush=True)

# Inicializar Base de Datos al arrancar
with app.app_context():
    db.create_all()
    _migrar_columnas_producto()


# ==========================================
# RUTA DE LOGIN (Genera el Pase VIP)
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json or {}
    
    # Parche: Buscamos 'usuario' o 'username' por si el frontend lo manda en inglés
    usuario = str(datos.get('usuario') or datos.get('username') or '')
    password = str(datos.get('password') or '')

    # Volvemos a leer las variables directamente de Render por si acaso
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

    # --- INICIO DEL CHISMOSO (Veremos esto en los Logs de Render) ---
    print("===== DEBUG LOGIN =====", flush=True)
    print(f"1. React envió el usuario: '{usuario}'", flush=True)
    print(f"2. React envió una clave de {len(password)} caracteres", flush=True)
    print(f"3. Render dice que ADMIN_USERNAME es: '{ADMIN_USERNAME}'", flush=True)
    print("=======================", flush=True)
    # --- FIN DEL CHISMOSO ---

    # Comparación segura contra las credenciales del entorno
    if (
        ADMIN_USERNAME and ADMIN_PASSWORD
        and hmac.compare_digest(usuario, ADMIN_USERNAME)
        and hmac.compare_digest(password, ADMIN_PASSWORD)
    ):
        token_vip = create_access_token(identity=usuario)
        return jsonify({"token": token_vip}), 200

    return jsonify({"error": "Credenciales incorrectas"}), 401


# ==========================================
# RUTAS CRUD DE PRODUCTOS
# ==========================================

# LEER CATÁLOGO (Público)
@app.route('/api/productos', methods=['GET'])
def obtener_productos():
    productos_db = Producto.query.all()
    return jsonify([p.to_dict() for p in productos_db])

# CREAR PRODUCTO (Privado - Requiere Token)
@app.route('/api/productos', methods=['POST'])
@jwt_required()
def agregar_producto():
    try:
        datos = request.json
        print("📥 Datos recibidos para crear producto:", datos, flush=True)

        # Convertir a entero de forma segura, usando 0 si falla
        try:
            precio_int = int(datos.get('precio', 0))
        except ValueError:
            precio_int = 0
            
        try:
            stock_int = int(datos.get('stock', 0))
        except ValueError:
            stock_int = 0

        nuevo_producto = Producto(
            titulo=datos.get('titulo', 'Sin título'),
            precio=precio_int,
            imagen=datos.get('imagen', ''),
            imagen_hover=datos.get('imagen_hover', ''),
            stock=stock_int,
            # 🔎 Nuevos campos de detalle (opcionales)
            categoria=datos.get('categoria'),
            autor=datos.get('autor'),
            descripcion=datos.get('descripcion')
        )
        db.session.add(nuevo_producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto agregado", "producto": nuevo_producto.to_dict()}), 201
    except Exception as e:
        print(f"❌ Error al crear producto: {e}", flush=True)
        return jsonify({"error": str(e)}), 400

# ACTUALIZAR PRODUCTO (Privado - Requiere Token)
@app.route('/api/productos/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_producto(id):
    producto = db.session.get(Producto, id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    
    datos = request.json
    producto.titulo = datos.get('titulo', producto.titulo)
    producto.precio = datos.get('precio', producto.precio)
    producto.imagen = datos.get('imagen', producto.imagen)
    producto.imagen_hover = datos.get('imagen_hover', producto.imagen_hover) # 📸 Permite actualizar la 2da foto
    producto.stock = datos.get('stock', producto.stock)
    # 🔎 Nuevos campos de detalle (opcionales)
    producto.categoria = datos.get('categoria', producto.categoria)
    producto.autor = datos.get('autor', producto.autor)
    producto.descripcion = datos.get('descripcion', producto.descripcion)
    
    db.session.commit()
    return jsonify({"mensaje": "Producto actualizado", "producto": producto.to_dict()})

# ELIMINAR PRODUCTO (Privado - Requiere Token)
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

        if not isinstance(carrito, list):
            return jsonify({"error": "El campo 'carrito' debe ser una lista de productos."}), 400

        if not carrito:
            return jsonify({"error": "El carrito está vacío. Agrega productos antes de pagar."}), 400

        # 🔒 VALIDACIÓN DE SEGURIDAD
        # El frontend envía precio y cantidad como enteros (CLP). Aquí los exigimos:
        # cualquier ítem inválido corta el pago con HTTP 400 y un mensaje claro.
        items_mp = []
        for producto in carrito:
            titulo = producto.get("titulo", "Producto sin nombre")
            cantidad = producto.get("cantidad")
            precio = producto.get("precio")

            try:
                cantidad = int(cantidad)
                precio = int(precio)
            except (TypeError, ValueError):
                return jsonify({
                    "error": f"El producto '{titulo}' tiene cantidad o precio inválidos. "
                             "El carrito debe enviar números enteros (precio en CLP y cantidad)."
                }), 400

            if cantidad < 1:
                return jsonify({"error": f"La cantidad del producto '{titulo}' debe ser al menos 1."}), 400

            if precio <= 0:
                return jsonify({"error": f"El precio del producto '{titulo}' debe ser mayor que 0."}), 400

            items_mp.append({
                "title": titulo,
                "quantity": cantidad,
                "unit_price": precio,
                "currency_id": "CLP"
            })

        # ------------------------------------------------------------------
        # notification_url (WEBHOOK): a qué URL avisa Mercado Pago del pago
        # ------------------------------------------------------------------
        # - PRODUCCIÓN: define en backend/.env ->
        #       WEBHOOK_URL=https://iconbototos-api.onrender.com
        # - DESARROLLO LOCAL: tu PC no es accesible desde internet, así que
        #   http://localhost:5000 NO sirve. Levanta un túnel con ngrok:
        #
        #       ngrok http 5000
        #       -> Forwarding https://abcd-123-45.ngrok-free.app -> http://localhost:5000
        #
        #   y luego pon en backend/.env:
        #       WEBHOOK_URL=https://abcd-123-45.ngrok-free.app
        # ------------------------------------------------------------------
        WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://iconbototos-api.onrender.com")

        # URL del frontend a la que volverá la persona al terminar el pago.
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
        preference = preference_response["response"]

        return jsonify({"id": preference["id"]})

    except Exception as e:
        print(f"❌ Error creando preferencia: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if data and (data.get("type") == "payment" or data.get("action") == "payment.created"):
        try:
            payment_id = data.get("data", {}).get("id")
            payment_info = sdk.payment().get(payment_id)
            
            if payment_info["status"] == 200:
                estado_pago = payment_info["response"].get("status")
                
                if estado_pago == "approved":
                    items_comprados = payment_info["response"].get("additional_info", {}).get("items", [])
                    print(f"✅ Pago Aprobado. Descontando stock de: {items_comprados}")
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
            print(f"📉 Stock actualizado para '{titulo_comprado}': Quedan {producto.stock}")

if __name__ == "__main__":
    app.run(debug=True, port=5000)