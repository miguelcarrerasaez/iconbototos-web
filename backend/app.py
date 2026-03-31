import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mercadopago
from dotenv import load_dotenv
import gspread
from oauth2client.service_account import ServiceAccountCredentials

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

# B. Google Sheets
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
]

# Lee el archivo credenciales.json (Localmente lo lee de tu PC, en Render lo leerá del "Secret File")
try:
    creds = ServiceAccountCredentials.from_json_keyfile_name("credenciales.json", scope)
    cliente_google = gspread.authorize(creds)
    hoja_catalogo = cliente_google.open("Catálogo Iconbototos").sheet1
    print("✅ ¡ÉXITO! Conexión perfecta con Google Sheets.")
except Exception as e:
    print(f"❌ ERROR AL CONECTAR CON GOOGLE SHEETS: {e}")


# ==========================================
# RUTA 1: CREAR PREFERENCIA (El cliente va a pagar)
# ==========================================
@app.route("/crear_preferencia", methods=["POST"])
def crear_preferencia():
    try:
        datos = request.json
        carrito = datos.get("carrito", [])
        
        # Armamos la lista de todos los items del carrito para Mercado Pago
        items_mp = []
        for producto in carrito:
            items_mp.append({
                "title": producto["titulo"],
                "quantity": 1,
                "unit_price": float(producto["precio"]),
                "currency_id": "CLP"
            })

        # --- IMPORTANTE ---
        # URL de tu servidor en Render (reemplaza si tu URL es distinta)
        URL_SERVIDOR_RENDER = "https://iconbototos-web.onrender.com"

        preference_data = {
            "items": items_mp,
            "back_urls": {
                "success": "https://iconbototos-web.vercel.app/",
                "failure": "https://iconbototos-web.vercel.app/",
                "pending": "https://iconbototos-web.vercel.app/"
            },
            "auto_return": "approved",
            # Aquí le decimos a Mercado Pago a dónde avisar cuando el pago se apruebe
            "notification_url": f"{URL_SERVIDOR_RENDER}/webhook" 
        }

        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        
        return jsonify({"id": preference["id"]})

    except Exception as e:
        print(f"Error creando preferencia: {e}")
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

    # Siempre devolver 200 OK para que Mercado Pago no reintente enviar el aviso
    return jsonify({"status": "ok"}), 200


# ==========================================
# FUNCIÓN INTERNA: DESCONTAR EN EXCEL
# ==========================================
def descontar_stock(items_comprados):
    registros = hoja_catalogo.get_all_records()
    titulos_columnas = hoja_catalogo.row_values(1)
    
    if "stock" not in titulos_columnas:
        print("❌ Error: No existe la columna 'stock' en el Excel.")
        return
        
    indice_columna_stock = titulos_columnas.index("stock") + 1

    for item in items_comprados:
        titulo_comprado = item.get("title")
        
        for indice_fila, fila in enumerate(registros):
            if str(fila.get("titulo")).strip() == str(titulo_comprado).strip():
                stock_actual = fila.get("stock")
                
                if isinstance(stock_actual, (int, float)):
                    nuevo_stock = int(stock_actual) - 1
                    # Actualizamos la celda en Google Sheets
                    hoja_catalogo.update_cell(indice_fila + 2, indice_columna_stock, max(0, nuevo_stock))
                    print(f"📉 Stock actualizado para '{titulo_comprado}': Quedan {nuevo_stock}")
                break

if __name__ == "__main__":
    app.run(debug=True, port=5000)