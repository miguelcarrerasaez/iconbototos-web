# -*- coding: utf-8 -*-
"""Prueba galería: migración legacy + upload múltiple + servir /media/ + to_dict."""
import io
import os
import shutil
import sqlite3
import sys
import tempfile
from pathlib import Path

BACK = Path(r"e:\iconbototos\backend")
sys.path.insert(0, str(BACK))

tmpdir = Path(tempfile.mkdtemp(prefix="iconbototos_galeria_"))
db_legacy = tmpdir / "tienda.db"

# Esquema VIEJO: sin columna galeria
conn = sqlite3.connect(db_legacy)
conn.execute(
    "CREATE TABLE producto ("
    "id INTEGER PRIMARY KEY, "
    "titulo VARCHAR(100) NOT NULL, "
    "precio INTEGER NOT NULL, "
    "imagen VARCHAR(200) NOT NULL, "
    "imagen_hover VARCHAR(200), "
    "stock INTEGER, "
    "categoria VARCHAR(100), autor VARCHAR(100), descripcion TEXT)"
)
conn.commit()
conn.close()

os.environ["DATABASE_URL"] = "sqlite:///" + db_legacy.as_posix()
os.environ["MP_ACCESS_TOKEN"] = "TEST-token-offline"
os.environ["JWT_SECRET_KEY"] = "clave-de-prueba-larga-para-jwt-1234567890"
os.environ["ADMIN_USERNAME"] = "monse"
os.environ["ADMIN_PASSWORD"] = "admin123"

import app as app_mod  # noqa: E402

cliente = app_mod.app.test_client()
fallos = []


def check(nombre, cond):
    if cond:
        print("PASS |", nombre)
    else:
        print("FAIL |", nombre)
        fallos.append(nombre)


# 1) La migración agregó galeria a la tabla existente
with app_mod.app.app_context():
    cols = [f[1] for f in app_mod.db.session.execute(
        app_mod.db.text("PRAGMA table_info(producto)")
    ).fetchall()]
check("migración añadió columna galeria", "galeria" in cols)

# 2) Login
r = cliente.post("/api/login", json={"usuario": "monse", "password": "admin123"})
check("login -> 200", r.status_code == 200)
headers = {"Authorization": "Bearer " + r.get_json()["token"]}

# 3) POST multipart con DOS archivos de galería
png1 = b"\x89PNG\r\n\x1a\n" + b"a" * 64
png2 = b"\x89PNG\r\n\x1a\n" + b"b" * 64
r = cliente.post("/api/productos",
                 data={
                     "titulo": "LAMINA CON GALERIA",
                     "precio": "15000",
                     "stock": "8",
                     "imagen": "https://i.imgur.com/principal.jpg",
                     "imagen_hover": "",
                     "categoria": "Print",
                     "autor": "Autor Prueba",
                     "descripcion": "Descripcion larga de prueba",
                     "galeria": [(io.BytesIO(png1), "foto1.png"), (io.BytesIO(png2), "foto2.jpg")],
                 },
                 headers=headers)
check("POST multipart -> 201", r.status_code == 201)
prod = r.get_json().get("producto", {})
gal = prod.get("galeria")
check("POST devuelve galeria como lista de 2", isinstance(gal, list) and len(gal) == 2)
check("POST devuelve URLs /media/", all(u.startswith("http") and "/media/" in u for u in (gal or [])))

# 4) Los archivos existen en UPLOAD_FOLDER
for url in (gal or []):
    nombre_archivo = url.rsplit("/", 1)[-1]
    ruta = Path(app_mod.UPLOAD_FOLDER) / nombre_archivo
    check("archivo guardado en disco: %s" % nombre_archivo, ruta.exists())

# 5) El endpoint /media/ sirve el archivo
ruta_media = "/" + gal[0].split("/", 3)[-1]
r = cliente.get(ruta_media)
check("GET /media/... -> 200 y contenido", r.status_code == 200 and r.data.startswith(b"\x89PNG"))

# 6) Producto JSON (sin galería) -> to_dict devuelve []
r = cliente.post("/api/productos", json={
    "titulo": "SIN GALERIA", "precio": 1000, "stock": 1, "imagen": "https://x/y.jpg",
}, headers=headers)
check("POST JSON sin galeria -> galeria []", r.get_json().get("producto", {}).get("galeria") == [])

# 7) GET lista incluye galeria como lista
r = cliente.get("/api/productos")
check("GET /api/productos -> 200", r.status_code == 200)
con_galeria = next((p for p in r.get_json() if p.get("id") == prod.get("id")), None)
check("GET devuelve galeria lista", con_galeria is not None and isinstance(con_galeria.get("galeria"), list))

# 8) PUT multipart con un archivo nuevo -> reemplaza galería
png3 = b"\x89PNG\r\n\x1a\n" + b"c" * 64
r = cliente.put("/api/productos/%s" % prod.get("id"),
                data={
                    "titulo": "LAMINA CON GALERIA",
                    "precio": "15000",
                    "stock": "8",
                    "imagen": "https://i.imgur.com/principal.jpg",
                    "categoria": "Print",
                    "autor": "Otro",
                    "descripcion": "nueva",
                    "galeria": [(io.BytesIO(png3), "nueva.png")],
                },
                headers=headers)
check("PUT multipart -> 200", r.status_code == 200)
gal2 = r.get_json().get("producto", {}).get("galeria")
check("PUT reemplazó galería (1 url)", isinstance(gal2, list) and len(gal2) == 1)

if fallos:
    print("FALLARON:", fallos)
    shutil.rmtree(app_mod.UPLOAD_FOLDER, ignore_errors=True)
    shutil.rmtree(tmpdir, ignore_errors=True)
    sys.exit(1)

print("TODAS las validaciones de galería pasaron.")
shutil.rmtree(app_mod.UPLOAD_FOLDER, ignore_errors=True)
shutil.rmtree(tmpdir, ignore_errors=True)