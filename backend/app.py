import mercadopago
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Habilita que el HTML hable con el Python sin bloqueos

# --- CONFIGURACIÓN DE MERCADO PAGO ---
# ⚠️ IMPORTANTE: Borra el texto de abajo y pega tu ACCESS TOKEN real entre las comillas
sdk = mercadopago.SDK("APP_USR-4820545223153906-011222-791a9448d88ef4af8a12026586bafbb0-3131448124")

@app.route('/')
def home():
    return "Servidor de Pagos Iconbototos: ACTIVO Y LISTO PARA VENDER 🤖💰"

@app.route('/crear_preferencia', methods=['POST'])
def crear_preferencia():
    # 1. Recibimos los datos del producto desde el HTML
    datos = request.json
    print("Recibiendo solicitud de compra:", datos)

    # 2. Armamos el "carrito" virtual para Mercado Pago
    preference_data = {
        "items": [
            {
                "title": datos['titulo'],            # Ej: "Fanzine Iconbototos"
                "quantity": 1,
                "unit_price": float(datos['precio']) # Ej: 15000
            }
        ],
        # Configuración de retorno (a dónde vuelve el usuario al terminar)
        "back_urls": {
            "success": "http://localhost:5500/index.html", # Puedes crear una pagina exito.html luego
            "failure": "http://localhost:5500/index.html",
            "pending": "http://localhost:5500/index.html"
        },
        "auto_return": "approved"
    }

    # 3. Contactamos a Mercado Pago para generar la orden
    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        
        # 4. Enviamos el ID de la compra al HTML para que abra la ventana
        return jsonify({"id": preference["id"]})
    
    except Exception as e:
        print("ERROR AL CREAR PREFERENCIA:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)