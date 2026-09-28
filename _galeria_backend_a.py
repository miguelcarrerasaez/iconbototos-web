# -*- coding: utf-8 -*-
"""Galería backend (parte 1): imports, columna, to_dict, helpers y migración."""
from pathlib import Path

BACK = Path(r"e:\iconbototos\backend")
p = BACK / "app.py"


def leer(p):
    with p.open("r", encoding="utf-8", newline="") as f:
        return f.read()


def escribir(p, texto):
    with p.open("w", encoding="utf-8", newline="") as f:
        f.write(texto)


def aplicado(t, viejo, nuevo, etiqueta):
    if viejo not in t:
        raise SystemExit("[ERROR] No se encontró en %s: %r" % (etiqueta, viejo[:90]))
    return t.replace(viejo, nuevo, 1)


t = leer(p).replace("\r\n", "\n")

# 1) Imports
t = aplicado(
    t,
    "import os\nimport hmac\nfrom flask import Flask, request, jsonify",
    "import os\nimport hmac\nimport json\nimport secrets\nfrom datetime import datetime\nfrom flask import Flask, request, jsonify, send_from_directory",
    "imports",
)

# 2) Columna galeria en el modelo
t = aplicado(
    t,
    "    descripcion = db.Column(db.Text, nullable=True)\n",
    "    descripcion = db.Column(db.Text, nullable=True)\n"
    "    galeria = db.Column(db.Text, nullable=True) # 📸 JSON con URLs extra para el carrusel\n",
    "modelo",
)

# 3) to_dict devuelve galeria como lista
t = aplicado(
    t,
    '            "descripcion": self.descripcion\n        }',
    '            "descripcion": self.descripcion,\n'
    '            "galeria": _parsear_galeria(self.galeria)\n'
    "        }",
    "to_dict",
)

# 4) Helpers de galería (antes de la sección de migración)
ANCLA = "# ==========================================\n# MIGRACIÓN LIGERA"
BLOQUE = '''# ==========================================
# GALERÍA DE IMÁGENES (archivos múltiples)
# ==========================================
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def _parsear_galeria(valor):
    """Convierte la columna galeria (JSON) en una lista de URLs; [] si es nula."""
    if not valor:
        return []
    try:
        lista = json.loads(valor)
        return lista if isinstance(lista, list) else []
    except (TypeError, ValueError):
        return []

def guardar_imagen_galeria(archivo):
    """Guarda un archivo subido y devuelve su URL pública absoluta (/media/...)."""
    if not archivo or not archivo.filename:
        return ""
    nombre = os.path.basename(archivo.filename)  # evita rutas maliciosas
    extension = os.path.splitext(nombre)[1].lower() or ".jpg"
    nombre_unico = "galeria_%s_%s%s" % (
        datetime.now().strftime("%Y%m%d_%H%M%S"),
        secrets.token_hex(4),
        extension,
    )
    archivo.save(os.path.join(UPLOAD_FOLDER, nombre_unico))
    return "%smedia/%s" % (request.host_url, nombre_unico)

@app.route("/media/<path:nombre>")
def _servir_media(nombre):
    return send_from_directory(UPLOAD_FOLDER, nombre)

def _leer_campos():
    """Lee el body: soporta JSON (clásico) o FormData/multipart con archivos."""
    if request.is_json:
        return (request.get_json(silent=True) or {}, [])
    return (dict(request.form), request.files.getlist('galeria'))

def _subir_galeria(archivos):
    """Sube varios archivos y devuelve el JSON con sus URLs (o None si no hay)."""
    urls = []
    for archivo in archivos:
        url = guardar_imagen_galeria(archivo)
        if url:
            urls.append(url)
    return json.dumps(urls) if urls else None

'''
t = aplicado(t, ANCLA, BLOQUE + ANCLA, "helpers galería")

# 5) Migración: agregar columna galeria
t = aplicado(
    t,
    '        ("descripcion", "TEXT"),\n    ]:',
    '        ("descripcion", "TEXT"),\n        ("galeria", "TEXT"),\n    ]:',
    "migración",
)

p_temp = BACK / "app.py"
escribir(p_temp, t)
print("OK backend parte 1 (imports, modelo, to_dict, helpers, migración)")