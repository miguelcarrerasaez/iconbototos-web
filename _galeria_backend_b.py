# -*- coding: utf-8 -*-
"""Galería backend (parte 2): POST y PUT leen multipart y guardan galeria."""
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

# 1) POST recibe multipart (campos + archivos galeria)
t = aplicado(
    t,
    '        datos = request.json\n        print("📥 Datos recibidos para crear producto:", datos, flush=True)',
    '        datos, archivos_galeria = _leer_campos()\n        print("📥 Datos recibidos para crear producto:", datos, "| archivos galeria:", len(archivos_galeria), flush=True)',
    "POST leer campos",
)

# 2) POST: constructor con galeria
t = aplicado(
    t,
    "            descripcion=datos.get('descripcion')\n        )",
    "            descripcion=datos.get('descripcion'),\n"
    "            # 📸 Galería extra: subimos los archivos y guardamos sus URLs (JSON)\n"
    "            galeria=_subir_galeria(archivos_galeria)\n"
    "        )",
    "POST constructor",
)

# 3) PUT recibe multipart
t = aplicado(
    t,
    "    datos = request.json\n    producto.titulo = datos.get('titulo', producto.titulo)",
    "    datos, archivos_galeria = _leer_campos()\n    producto.titulo = datos.get('titulo', producto.titulo)",
    "PUT leer campos",
)

# 4) PUT: precio como entero (FormData envía strings)
t = aplicado(
    t,
    "    producto.precio = datos.get('precio', producto.precio)\n    producto.imagen = datos.get('imagen', producto.imagen)",
    "    try:\n"
    "        precio_put = int(datos.get('precio'))\n"
    "    except (TypeError, ValueError):\n"
    "        precio_put = producto.precio\n"
    "    producto.precio = precio_put\n"
    "    producto.imagen = datos.get('imagen', producto.imagen)",
    "PUT precio",
)

# 5) PUT: stock como entero
t = aplicado(
    t,
    "    producto.stock = datos.get('stock', producto.stock)\n    # 🔎 Nuevos campos de detalle",
    "    try:\n"
    "        stock_put = int(datos.get('stock'))\n"
    "    except (TypeError, ValueError):\n"
    "        stock_put = producto.stock\n"
    "    producto.stock = stock_put\n"
    "    # 🔎 Nuevos campos de detalle",
    "PUT stock",
)

# 6) PUT: galería (si llegan archivos nuevos, reemplazan la existente)
t = aplicado(
    t,
    "    producto.descripcion = datos.get('descripcion', producto.descripcion)\n",
    "    producto.descripcion = datos.get('descripcion', producto.descripcion)\n"
    "    # 📸 Galería: si vienen archivos nuevos, reemplazamos la galería existente\n"
    "    if archivos_galeria:\n"
    "        producto.galeria = _subir_galeria(archivos_galeria)\n",
    "PUT galeria",
)

escribir(p, t.replace("\n", "\r\n"))
print("OK backend/app.py (POST/PUT con galería)")