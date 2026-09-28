import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';
import imageCompression from 'browser-image-compression'; // <-- Importamos la librería
import './Admin.css';

function Admin() {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargandoLogin, setCargandoLogin] = useState(false);

  // --- ESTADOS DEL PANEL ---
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  const [productos, setProductos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  
  // Estados para imágenes extra
  const [imagenHover, setImagenHover] = useState('');
  const [galeria, setGaleria] = useState([]); // <-- Ahora guarda URLs en lugar de archivos

  // Estados de carga de imágenes
  const [subiendo, setSubiendo] = useState(false);
  const [subiendoHover, setSubiendoHover] = useState(false);
  const [subiendoGaleria, setSubiendoGaleria] = useState(false);

  // Campos de texto
  const [categoria, setCategoria] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destacado, setDestacado] = useState(false); // ⭐️ Producto destacado (carrusel del Home)
  
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    if (token) cargarProductos();
  }, [token]);

  // ==========================================
  // LÓGICA DE LOGIN
  // ==========================================
  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargandoLogin(true);
    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (respuesta.ok) {
        const datos = await respuesta.json();
        localStorage.setItem('token', datos.token);
        setToken(datos.token);
      } else {
        alert("🚨 Credenciales incorrectas.");
      }
    } catch (error) {
      alert("Error conectando al servidor.");
    } finally {
      setCargandoLogin(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername('');
    setPassword('');
  };

  const cargarProductos = async () => {
    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setProductos(datos);
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  // ==========================================
  // COMPRESIÓN Y SUBIDA A IMGBB
  // ==========================================
  const comprimirYSubirAImgBB = async (archivo) => {
    const opciones = {
      maxSizeMB: 0.5, // Máximo 500KB
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const archivoComprimido = await imageCompression(archivo, opciones);
      const formData = new FormData();
      formData.append('image', archivoComprimido);

      const respuesta = await fetch('https://api.imgbb.com/1/upload?key=369301acc9fbf5e2b93cbabc2cba70fd', {
        method: 'POST',
        body: formData
      });
      
      const datos = await respuesta.json();
      if (datos.success) return datos.data.url;
      throw new Error("ImgBB rechazó la imagen");
    } catch (error) {
      console.error("Error procesando imagen:", error);
      alert("Error al comprimir/subir imagen.");
      return null;
    }
  };

  const manejarSubidaImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendo(true);
    const url = await comprimirYSubirAImgBB(archivo);
    if (url) setImagen(url);
    setSubiendo(false);
  };

  const manejarSubidaImagenHover = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendoHover(true);
    const url = await comprimirYSubirAImgBB(archivo);
    if (url) setImagenHover(url);
    setSubiendoHover(false);
  };

  const manejarSubidaGaleria = async (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;
    
    setSubiendoGaleria(true);
    const urlsNuevas = [];

    // Sube múltiples archivos optimizados uno por uno
    for (const archivo of archivos) {
      const url = await comprimirYSubirAImgBB(archivo);
      if (url) urlsNuevas.push(url);
    }

    setGaleria(prev => [...prev, ...urlsNuevas]);
    setSubiendoGaleria(false);
  };

  // ==========================================
  // GUARDAR Y EDITAR
  // ==========================================
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!imagen) return alert("Falta imagen principal.");

    const url = idEdicion ? `${BACKEND_URL}/api/productos/${idEdicion}` : `${BACKEND_URL}/api/productos`;
    const metodo = idEdicion ? 'PUT' : 'POST';

    // Ahora enviamos un JSON puro con todas las URLs listas
    const nuevoProducto = {
      titulo,
      precio: parseFloat(precio),
      stock: parseInt(stock) || 0,
      imagen,
      imagen_hover: imagenHover,
      categoria,
      autor,
      descripcion,
      galeria, // Enviamos el arreglo de URLs directamente
      destacado // ⭐️ El admin decide si va al carrusel del Home
    };

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (respuesta.status === 401) return cerrarSesion();

      if (respuesta.ok) {
        setTitulo(''); setPrecio(''); setStock(''); setImagen(''); 
        setImagenHover(''); setGaleria([]); setCategoria(''); 
        setAutor(''); setDescripcion(''); setDestacado(false); setIdEdicion(null);
        cargarProductos();
        alert(idEdicion ? "Lámina actualizada" : "Lámina creada");
      } else {
        alert("Error del servidor al guardar.");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const editarProducto = (producto) => {
    setTitulo(producto.titulo);
    setPrecio(producto.precio);
    setStock(producto.stock || 0);
    setImagen(producto.imagen);
    setImagenHover(producto.imagen_hover || '');
    setCategoria(producto.categoria || '');
    setAutor(producto.autor || '');
    setDescripcion(producto.descripcion || ''); 
    setDestacado(producto.destacado || false); // ⭐️ Cargamos si estaba destacado
    // Aseguramos que la galería sea un arreglo visualizable
    setGaleria(Array.isArray(producto.galeria) ? producto.galeria : (typeof producto.galeria === 'string' ? JSON.parse(producto.galeria || '[]') : []));
    setIdEdicion(producto.id);
    setVistaActiva('catalogo');
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Borrar lámina?")) return;
    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (respuesta.ok) cargarProductos();
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
        <div style={{ backgroundColor: '#fff', border: '4px solid #111', padding: '40px', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '8px 8px 0px #111' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, marginBottom: '20px' }}>ACCESO PANEL RISO</h2>
          <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '12px', border: '2px solid #111' }} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', border: '2px solid #111' }} required />
            <button type="submit" disabled={cargandoLogin} style={{ padding: '15px', backgroundColor: '#ff48b0', color: '#fff', border: '3px solid #111', fontWeight: 'bold', cursor: 'pointer' }}>
              {cargandoLogin ? 'Verificando...' : 'ENTRAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Panel Riso</h2>
        <button className={`btn-menu ${vistaActiva === 'dashboard' ? 'activo' : ''}`} onClick={() => setVistaActiva('dashboard')}>📊 Dashboard</button>
        <button className={`btn-menu ${vistaActiva === 'catalogo' ? 'activo' : ''}`} onClick={() => setVistaActiva('catalogo')}>📦 Catálogo</button>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '3px solid #111' }}>
          <button className="btn-menu" onClick={() => window.open('/', '_blank')} style={{ width: '100%', backgroundColor: '#fff000', color: '#111', marginTop: '10px', fontWeight: 'bold', border: '2px solid #111' }}>👁️ Ver Tienda</button>
          <button className="btn-menu" onClick={cerrarSesion} style={{ width: '100%', backgroundColor: '#111', color: '#fff', marginTop: '10px', fontWeight: 'bold', border: '2px solid #111' }}>🚪 Cerrar Sesión</button>
        </div>
      </aside>

      <main className="admin-content">
        
        {vistaActiva === 'catalogo' && (
          <div>
            <h1>Gestión de Catálogo</h1>
            
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>{idEdicion ? '✏️ Editar Lámina' : '➕ Nueva Lámina'}</h3>
                
                <form className="admin-formulario" onSubmit={guardarProducto}>
                  <div className="admin-form-grid">
                    
                    {/* COLUMNA IZQUIERDA */}
                    <div className="admin-col-texto">
                      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      
                      <div className="admin-row-inputs">
                        <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      </div>

                      {/* ⭐️ Producto Destacado: el admin elige si aparece en el carrusel del Home */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '10px', padding: '10px 12px', border: '2px solid #ff48b0', backgroundColor: '#fff0f8', width: '100%', boxSizing: 'border-box' }}>
                        <input
                          type="checkbox"
                          checked={destacado}
                          onChange={(e) => setDestacado(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#ff48b0', cursor: 'pointer' }}
                        />
                        ⭐️ Mostrar este producto en el Carrusel de Inicio
                      </label>

                      <div className="admin-row-inputs">
                        <input type="text" placeholder="Categoría (Ej: Fanzine, Print...)" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                        <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      </div>

                      <textarea placeholder="Descripción larga (sinopsis)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="7" style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                    </div>

                    {/* COLUMNA DERECHA: IMÁGENES */}
                    <div className="admin-col-imagenes">
                      <div style={{ padding: '15px', border: '2px solid #ccc', backgroundColor: '#f9f9f9', marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>🖼️ Imagen Principal (Portada):</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagen} style={{ width: '100%' }} />
                        {subiendo && <p style={{ margin: '10px 0 0', color: '#ff48b0', fontSize: '12px', fontWeight: 'bold' }}>⏳ Optimizando y subiendo...</p>}
                        {imagen && !subiendo && <img src={imagen} alt="Principal" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #111', marginTop: '10px' }} />}
                      </div>

                      <div style={{ padding: '15px', border: '2px dashed #ccc', backgroundColor: '#f9f9f9', marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>✨ Imagen Hover (Opcional):</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagenHover} style={{ width: '100%' }} />
                        {subiendoHover && <p style={{ margin: '10px 0 0', color: '#ff48b0', fontSize: '12px', fontWeight: 'bold' }}>⏳ Optimizando y subiendo...</p>}
                        {imagenHover && !subiendoHover && <img src={imagenHover} alt="Hover" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #111', marginTop: '10px' }} />}
                      </div>

                      {/* NUEVA SECCIÓN DE GALERÍA MÚLTIPLE */}
                      <div style={{ padding: '15px', border: '2px solid #ff48b0', backgroundColor: '#f9f9f9' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>📸 Galería Extra (Opcional - Selecciona varias):</label>
                        <input type="file" accept="image/*" multiple onChange={manejarSubidaGaleria} style={{ width: '100%' }} />
                        {subiendoGaleria && <p style={{ margin: '10px 0 0', color: '#ff48b0', fontSize: '12px', fontWeight: 'bold' }}>⏳ Optimizando lote de imágenes...</p>}
                        
                        {/* Previsualización de la galería con opción a borrar */}
                        {galeria.length > 0 && (
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {galeria.map((url, i) => (
                              <div key={i} style={{ position: 'relative' }}>
                                <img src={url} alt={`Galeria ${i}`} style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #111' }} />
                                <button type="button" onClick={() => setGaleria(galeria.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', fontSize: '10px' }}>X</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="admin-form-acciones">
                    <button type="submit" style={{ flex: 1, backgroundColor: '#fff000', border: '3px solid #111', padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {idEdicion ? 'Actualizar Producto' : 'Guardar Nuevo Producto'}
                    </button>
                    {idEdicion && (
                      <button type="button" onClick={() => {setIdEdicion(null); setTitulo(''); setPrecio(''); setStock(''); setImagen(''); setImagenHover(''); setGaleria([]); setCategoria(''); setAutor(''); setDescripcion(''); setDestacado(false);}} style={{ padding: '12px 20px', backgroundColor: '#ccc', border: '3px solid #111', cursor: 'pointer', fontWeight: 'bold' }}>
                          Cancelar Edición
                      </button>
                    )}
                  </div>
                </form>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px', overflowX: 'auto' }}>
                <h3>Láminas Actuales</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px' }}>
                <thead>
                    <tr style={{ borderBottom: '3px solid #111' }}>
                    <th style={{ padding: '10px' }}>Foto</th>
                    <th style={{ padding: '10px' }}>Título</th>
                    <th style={{ padding: '10px' }}>Precio</th>
                    <th style={{ padding: '10px' }}>Stock</th>
                    <th style={{ padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                    <tr key={producto.id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '10px' }}>
                          <img src={producto.imagen} alt="P" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #111' }} />
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{producto.titulo}</td>
                        <td style={{ padding: '10px' }}>${producto.precio}</td>
                        <td style={{ padding: '10px' }}>
                            <span style={{ color: producto.stock > 0 ? '#111' : 'red', fontWeight: 'bold' }}>{producto.stock || 0}</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                        <button onClick={() => editarProducto(producto)} style={{ marginRight: '10px', padding: '5px 10px', border: '2px solid #111', backgroundColor: '#00e5ff', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => eliminarProducto(producto.id)} style={{ padding: '5px 10px', border: '2px solid #111', backgroundColor: '#ff48b0', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Borrar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;