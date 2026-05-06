import os
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

# Configuración del Token JWT
app.config["JWT_SECRET_KEY"] = "clave-super-secreta-de-iconbototos-2026" 
jwt = JWTManager(app)

# Configuración de Mercado Pago
access_token = os.getenv("MP_ACCESS_TOKEN")
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN en las variables de entorno.")
sdk = mercadopago.SDK(access_token)


# ==========================================
# CONFIGURACIÓN DE LA BASE DE DATOS SQLITE
# ==========================================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tienda.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False)
    imagen_hover = db.Column(db.String(200), nullable=True) # 📸 NUEVO: La segunda foto
    stock = db.Column(db.Integer, default=10)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "precio": self.precio,
            "imagen": self.imagen,
            "imagen_hover": self.imagen_hover, # 📸 NUEVO
            "stock": self.stock
        }

# Inicializar Base de Datos al arrancar
with app.app_context():
    db.create_all()


# ==========================================
# RUTA DE LOGIN (Genera el Pase VIP)
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    # Validación (Puedes cambiar esta clave luego)
    if usuario == 'monse' and password == 'admin123':
        token_vip = create_access_token(identity=usuario)
        return jsonify({"token": token_vip}), 200
    else:
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
        nuevo_producto = Producto(
            titulo=datos['titulo'],
            precio=datos['precio'],
            imagen=datos['imagen'],
            imagen_hover=datos.get('imagen_hover', ''),
            stock=datos.get('stock', 0)
        )
        db.session.add(nuevo_producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto agregado", "producto": nuevo_producto.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ACTUALIZAR PRODUCTO (Privado - Requiere Token)
@app.route('/api/productos/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_producto(id):
    producto = db.session.get(Producto, id) # Actualizado para evitar warnings de SQLAlchemy 2.0
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    
    datos = request.json
    producto.titulo = datos.get('titulo', producto.titulo)
    producto.precio = datos.get('precio', producto.precio)
    producto.imagen = datos.get('imagen', producto.imagen)
    producto.stock = datos.get('stock', producto.stock)
    
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
        datos = request.json
        carrito = datos.get("carrito", [])
        
        items_mp = []
        for producto in carrito:
            items_mp.append({
                "title": producto.get("titulo", "Producto sin nombre"),
                "quantity": int(producto.get("cantidad", 1)),
                "unit_price": float(producto.get("precio", 0)),
                "currency_id": "CLP"
            })

        URL_SERVIDOR_RENDER = "https://iconbototos-web.onrender.com"

        preference_data = {
            "items": items_mp,
            "back_urls": {
                "success": "https://iconbototos-web.vercel.app/",
                "failure": "https://iconbototos-web.vercel.app/",
                "pending": "https://iconbototos-web.vercel.app/"
            },
            "auto_return": "approved",
            "notification_url": f"{URL_SERVIDOR_RENDER}/webhook" 
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