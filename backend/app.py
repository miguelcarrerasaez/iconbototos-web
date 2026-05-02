import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy # <-- NUEVA Base de datos

# 1. Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# SEGURIDAD Y CREDENCIALES
# ==========================================

# A. Mercado Pago
access_token = os.getenv("MP_ACCESS_TOKEN")
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN en las variables de entorno.")
else:
    print(f"✅ Token MP cargado correctamente: {access_token[:10]}...") 

sdk = mercadopago.SDK(access_token)

# B. Base de Datos SQLite (Reemplaza a Google Sheets)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tienda.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ==========================================
# MODELO DE LA BASE DE DATOS
# ==========================================
class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False)
    stock = db.Column(db.Integer, default=10) # <-- Agregamos el stock

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "precio": self.precio,
            "imagen": self.imagen,
            "stock": self.stock
        }

# Inicializar Base de Datos al arrancar
with app.app_context():
    db.create_all()
    if not Producto.query.first():
        p1 = Producto(titulo="Lámina Azul", precio=5000, imagen="/img/lamina-azul.jpg", stock=15)
        p2 = Producto(titulo="Lámina Sombra", precio=5000, imagen="/img/lamina-sombra.jpg", stock=10)
        p3 = Producto(titulo="Lámina Tendedero", precio=6000, imagen="/img/lamina-tendedero.jpg", stock=20)
        db.session.add_all([p1, p2, p3])
        db.session.commit()
        print("✅ Base de datos SQLite inicializada con éxito.")

# ==========================================
# RUTAS DE LA API (FRONTEND)
# ==========================================
@app.route('/api/productos', methods=['GET'])
def obtener_productos():
    # Ahora lee directamente de SQLite
    productos_db = Producto.query.all()
    return jsonify([p.to_dict() for p in productos_db])


# ==========================================
# RUTA 1: CREAR PREFERENCIA (El cliente va a pagar)
# ==========================================
@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        datos = request.json
        print("🛒 DATOS RECIBIDOS DEL FRONTEND:", datos)

        carrito = datos.get("carrito", [])
        
        items_mp = []
        for producto in carrito:
            precio_producto = producto.get("precio", 0)
            titulo_producto = producto.get("titulo", "Producto sin nombre")
            cantidad_producto = producto.get("cantidad", 1) # <-- Ahora lee si el cliente lleva 2 o 3 láminas iguales

            items_mp.append({
                "title": titulo_producto,
                "quantity": int(cantidad_producto),
                "unit_price": float(precio_producto),
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


# ==========================================
# RUTA 2: WEBHOOK (Mercado Pago avisa del cobro exitoso)
# ==========================================
@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    print("🔔 WEBHOOK RECIBIDO:", data)

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


# ==========================================
# FUNCIÓN INTERNA: DESCONTAR EN SQLITE
# ==========================================
def descontar_stock(items_comprados):
    for item in items_comprados:
        titulo_comprado = item.get("title")
        cantidad_comprada = int(item.get("quantity", 1))
        
        # Buscamos la lámina en la Base de Datos
        producto = Producto.query.filter_by(titulo=titulo_comprado).first()
        
        if producto:
            # Le restamos la cantidad comprada, evitando que quede en negativo
            producto.stock = max(0, producto.stock - cantidad_comprada)
            db.session.commit()
            print(f"📉 Stock actualizado para '{titulo_comprado}': Quedan {producto.stock}")
        else:
            print(f"❌ Error: El producto '{titulo_comprado}' no se encontró en la Base de Datos.")

if __name__ == "__main__":
    app.run(debug=True, port=5000)