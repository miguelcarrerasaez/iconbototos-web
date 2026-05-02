import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required # <-- NUEVO: Herramientas VIP

load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# SEGURIDAD, TOKENS Y BASE DE DATOS
# ==========================================

# Configuración del Token (Esta llave secreta firma los pases VIP)
app.config["JWT_SECRET_KEY"] = "clave-super-secreta-de-iconbototos-2026" 
jwt = JWTManager(app)

access_token = os.getenv("MP_ACCESS_TOKEN")
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN.")
sdk = mercadopago.SDK(access_token)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tienda.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False)
    stock = db.Column(db.Integer, default=10)

    def to_dict(self):
        return { "id": self.id, "titulo": self.titulo, "precio": self.precio, "imagen": self.imagen, "stock": self.stock }

with app.app_context():
    db.create_all()

# ==========================================
# RUTA DE LOGIN (NUEVO)
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    # Aquí validamos en el servidor (más adelante podríamos tener una tabla de Usuarios)
    if usuario == 'monse' and password == 'admin123':
        # Si la clave es correcta, creamos el pase VIP
        token_vip = create_access_token(identity=usuario)
        return jsonify({"token": token_vip}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


# ==========================================
# RUTAS DE PRODUCTOS
# ==========================================

# EL PÚBLICO SÍ PUEDE LEER EL CATÁLOGO (No requiere Token)
@app.route('/api/productos', methods=['GET'])
def obtener_productos():
    productos_db = Producto.query.all()
    return jsonify([p.to_dict() for p in productos_db])

# CREAR (Requiere Pase VIP)
@app.route('/api/productos', methods=['POST'])
@jwt_required() # <-- EL CANDADO
def agregar_producto():
    try:
        datos = request.json
        nuevo_producto = Producto(
            titulo=datos['titulo'], precio=datos['precio'], imagen=datos['imagen'], stock=datos.get('stock', 0)
        )
        db.session.add(nuevo_producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto agregado", "producto": nuevo_producto.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ACTUALIZAR (Requiere Pase VIP)
@app.route('/api/productos/<int:id>', methods=['PUT'])
@jwt_required() # <-- EL CANDADO
def actualizar_producto(id):
    producto = Producto.query.get(id)
    if not producto: return jsonify({"error": "No encontrado"}), 404
    datos = request.json
    producto.titulo = datos.get('titulo', producto.titulo)
    producto.precio = datos.get('precio', producto.precio)
    producto.imagen = datos.get('imagen', producto.imagen)
    producto.stock = datos.get('stock', producto.stock)
    db.session.commit()
    return jsonify({"mensaje": "Actualizado", "producto": producto.to_dict()})

# ELIMINAR (Requiere Pase VIP)
@app.route('/api/productos/<int:id>', methods=['DELETE'])
@jwt_required() # <-- EL CANDADO
def eliminar_producto(id):
    producto = Producto.query.get(id)
    if not producto: return jsonify({"error": "No encontrado"}), 404
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"mensaje": "Eliminado"})


# ==========================================
# RUTAS DE MERCADO PAGO (Se mantienen igual)
# ==========================================
@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    # ... (Tu código de crear_preferencia queda exactamente igual) ...
    try:
        datos = request.json
        carrito = datos.get("carrito", [])
        items_mp = []
        for producto in carrito:
            items_mp.append({
                "title": producto.get("titulo", "Producto"),
                "quantity": int(producto.get("cantidad", 1)),
                "unit_price": float(producto.get("precio", 0)),
                "currency_id": "CLP"
            })
        URL_SERVIDOR_RENDER = "https://iconbototos-web.onrender.com"
        preference_data = {
            "items": items_mp,
            "back_urls": { "success": "https://iconbototos-web.vercel.app/", "failure": "https://iconbototos-web.vercel.app/", "pending": "https://iconbototos-web.vercel.app/" },
            "auto_return": "approved",
            "notification_url": f"{URL_SERVIDOR_RENDER}/webhook" 
        }
        preference_response = sdk.preference().create(preference_data)
        return jsonify({"id": preference_response["response"]["id"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    # ... (Tu código del webhook queda exactamente igual) ...
    data = request.json
    if data and (data.get("type") == "payment" or data.get("action") == "payment.created"):
        try:
            payment_id = data.get("data", {}).get("id")
            payment_info = sdk.payment().get(payment_id)
            if payment_info["status"] == 200 and payment_info["response"].get("status") == "approved":
                items_comprados = payment_info["response"].get("additional_info", {}).get("items", [])
                descontar_stock(items_comprados)
        except Exception as e:
            print(f"Error webhook: {e}")
    return jsonify({"status": "ok"}), 200

def descontar_stock(items_comprados):
    for item in items_comprados:
        producto = Producto.query.filter_by(titulo=item.get("title")).first()
        if producto:
            producto.stock = max(0, producto.stock - int(item.get("quantity", 1)))
            db.session.commit()

if __name__ == "__main__":
    app.run(debug=True, port=5000)