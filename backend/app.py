import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago
from dotenv import load_dotenv # <--- Importar esto

# 1. Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. Obtener el token de forma segura
access_token = os.getenv("MP_ACCESS_TOKEN")

# Verificación de seguridad (Opcional, para que no arranque si falta la clave)
if not access_token:
    raise ValueError("¡ERROR CRÍTICO! No se encontró el MP_ACCESS_TOKEN en las variables de entorno.")
else:
    # AGREGA ESTO PARA VER EL MENSAJE:
    print(f"✅ Token cargado correctamente: {access_token[:10]}...") 
    # (El print muestra los primeros 10 caracteres para que veas que cargó el correcto, sin mostrarlo todo)

# 3. Inicializar el SDK con la variable
sdk = mercadopago.SDK(access_token)

@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        # 1. Recibimos los datos del JSON que envía el main.js
        datos = request.json
        titulo = datos.get("titulo")
        precio = datos.get("precio")

        # 2. Creamos la estructura de preferencia
        preference_data = {
            "items": [
                {
                    "title": titulo,
                    "quantity": 1,
                    "unit_price": float(precio),
                    "currency_id": "CLP"
                }
            ],
            # A dónde va el usuario después de pagar
            "back_urls": {
                "success": "https://iconbototos-web.vercel.app/",
                "failure": "https://iconbototos-web.vercel.app/",
                "pending": "https://iconbototos-web.vercel.app/"
            },
            "auto_return": "approved"
        }

        # 3. Pedimos a Mercado Pago que cree la preferencia
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        # 4. Devolvemos el ID al frontend
        return jsonify({"id": preference["id"]})

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # debug=True para que veas los errores en la terminal
    app.run(debug=True, port=5000)