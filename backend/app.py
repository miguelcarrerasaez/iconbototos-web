from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago

app = Flask(__name__)
# CORS permite que tu HTML (en Vercel o local) hable con este Python
CORS(app) 

# ---------------------------------------------------------
# CONFIGURACIÓN MERCADO PAGO
# Reemplaza con tu ACCESS TOKEN (El que empieza con APP_USR-...)
# ---------------------------------------------------------
sdk = mercadopago.SDK("APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c") 

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