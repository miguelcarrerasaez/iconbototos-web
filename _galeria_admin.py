# -*- coding: utf-8 -*-
"""Panel Admin: input múltiple de galería y envío por FormData."""
import re
from pathlib import Path

P = Path(r"e:\iconbototos\frontend\src\pages\Admin.jsx")


def leer(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n")


def escribir(p, texto):
    with p.open("w", encoding="utf-8", newline="") as f:
        f.write(texto)


def aplicado(t, viejo, nuevo, etiqueta):
    if viejo not in t:
        raise SystemExit("[ERROR] %s: %r" % (etiqueta, viejo[:90]))
    return t.replace(viejo, nuevo, 1)


t = leer(P)

# 1) import useRef
t = aplicado(t,
             "import { useState, useEffect } from 'react';",
             "import { useState, useEffect, useRef } from 'react';",
             "import useRef")

# 2) estado galeria + ref al input
t = aplicado(t,
             "  const [idEdicion, setIdEdicion] = useState(null);\n  const [subiendo, setSubiendo] = useState(false);",
             "  const [idEdicion, setIdEdicion] = useState(null);\n  const [subiendo, setSubiendo] = useState(false);\n  const [archivosGaleria, setArchivosGaleria] = useState([]);\n  const galeriaRef = useRef(null);",
             "estado galeria")

# 3) handler de selección múltiple
t = aplicado(t,
             "  const guardarProducto = async (e) => {",
             "  const manejarSeleccionGaleria = (e) => {\n"
             "    setArchivosGaleria(Array.from(e.target.files || []));\n"
             "  };\n\n"
             "  const guardarProducto = async (e) => {",
             "handler galeria")

# 4) guardarProducto: de JSON a FormData con archivos de galería
re_fetch = re.compile(
    r"const nuevoProducto = \{.*?body: JSON\.stringify\(nuevoProducto\)\s*\}\);",
    re.S,
)
reemplazo_fetch = """const formData = new FormData();
    formData.append('titulo', titulo || '');
    formData.append('precio', String(precio || 0));
    formData.append('stock', String(stock || 0));
    formData.append('imagen', imagen || '');
    formData.append('imagen_hover', imagenHover || '');
    formData.append('categoria', categoria || '');
    formData.append('autor', autor || '');
    formData.append('descripcion', descripcion || '');
    // 📸 Galería de imágenes extra (archivos múltiples)
    archivosGaleria.forEach((archivo) => formData.append('galeria', archivo));

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });"""
t, n = re_fetch.subn(reemplazo_fetch, t, count=1)
if n == 0:
    raise SystemExit("[ERROR] no se encontró el bloque fetch de guardarProducto")

# 5) reset tras guardar
t = aplicado(t,
             "        setDescripcion('');",
             "        setDescripcion('');\n        setArchivosGaleria([]);\n        if (galeriaRef.current) galeriaRef.current.value = '';",
             "reset guardar")

# 6) botón cancelar
t = aplicado(t,
             "setDescripcion('');}}",
             "setDescripcion(''); setArchivosGaleria([]); if (galeriaRef.current) galeriaRef.current.value = '';}}",
             "cancelar")

# 7) input múltiple en el formulario (antes de los botones)
t = aplicado(t,
             "                  {/* BOTONES DE ACCIÓN ABAJO */}",
             """                  <div style={{ padding: '15px', border: '2px dashed #ff48b0', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>📸 Galería de imágenes extra (Puedes seleccionar varias):</label>
                    <input type="file" multiple accept="image/*" ref={galeriaRef} onChange={manejarSeleccionGaleria} style={{ width: '100%' }} />
                    {archivosGaleria.length > 0 && <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>✅ {archivosGaleria.length} archivo(s) listo(s) para subir</p>}
                  </div>

                  {/* BOTONES DE ACCIÓN ABAJO */}""",
             "input galeria")

escribir(P, t)
print("OK Admin.jsx (galería múltiple + FormData)")