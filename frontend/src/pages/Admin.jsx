import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';
import './Admin.css'; // Asegúrate de que esta línea exista para cargar los estilos

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
  
  // Estados para la segunda imagen (Hover)
  const [imagenHover, setImagenHover] = useState('');
  const [subiendoHover, setSubiendoHover] = useState(false);

  // Campos para la vista de detalle
  const [categoria, setCategoria] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [idEdicion, setIdEdicion] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  // Cargar productos solo si hay token
  useEffect(() => {
    if (token) {
      cargarProductos();
    }
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
        alert("🚨 Credenciales incorrectas. Revisa tu usuario y contraseña.");
      }
    } catch (error) {
      alert("Error conectando al servidor. Revisa que Render esté activo.");
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

  // ==========================================
  // LÓGICA DEL CATÁLOGO
  // ==========================================
  const cargarProductos = async () => {
    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setProductos(datos);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const manejarSubidaImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendo(true);
    const formData = new FormData();
    formData.append('image', archivo);

    try {
      const respuesta = await fetch('https://api.imgbb.com/1/upload?key=369301acc9fbf5e2b93cbabc2cba70fd', {
        method: 'POST',
        body: formData
      });
      const datos = await respuesta.json();
      if (datos.success) setImagen(datos.data.url);
    } catch (error) {
      alert("Hubo un error al subir la fotografía.");
    } finally {
      setSubiendo(false);
    }
  };

  const manejarSubidaImagenHover = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoHover(true);
    const formData = new FormData();
    formData.append('image', archivo);

    try {
      const respuesta = await fetch('https://api.imgbb.com/1/upload?key=369301acc9fbf5e2b93cbabc2cba70fd', {
        method: 'POST',
        body: formData
      });
      const datos = await respuesta.json();
      if (datos.success) setImagenHover(datos.data.url);
    } catch (error) {
      alert("Hubo un error al subir la fotografía secundaria.");
    } finally {
      setSubiendoHover(false);
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!imagen) {
        alert("Por favor, espera a que la imagen principal se suba.");
        return;
    }

    const url = idEdicion 
        ? `${BACKEND_URL}/api/productos/${idEdicion}` 
        : `${BACKEND_URL}/api/productos`;
    const metodo = idEdicion ? 'PUT' : 'POST';

    const nuevoProducto = {
      titulo: titulo,
      precio: parseFloat(precio),
      stock: parseInt(stock) || 0,
      imagen: imagen,
      imagen_hover: imagenHover,
      categoria: categoria,
      autor: autor,
      descripcion: descripcion 
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

      if (respuesta.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        cerrarSesion();
        return;
      }

      if (respuesta.ok) {
        setTitulo('');
        setPrecio('');
        setStock('');
        setImagen('');
        setImagenHover('');
        setCategoria('');
        setAutor('');
        setDescripcion(''); 
        setIdEdicion(null);
        cargarProductos();
        alert(idEdicion ? "Lámina actualizada" : "Lámina creada");
      } else {
        alert("Error del servidor al guardar.");
      }
    } catch (error) {
      alert("Hubo un error de conexión");
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
    setIdEdicion(producto.id);
    setVistaActiva('catalogo');
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta lámina?")) return;

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (respuesta.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        cerrarSesion();
        return;
      }

      if (respuesta.ok) cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };


  // ==========================================
  // RENDER: PANTALLA DE LOGIN
  // ==========================================
  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
        <div style={{ backgroundColor: '#fff', border: '4px solid #111', padding: '40px', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '8px 8px 0px #111' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, marginBottom: '20px', fontSize: '24px' }}>ACCESO PANEL RISO</h2>
          <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '12px', border: '2px solid #111', fontSize: '16px', fontFamily: 'Montserrat, sans-serif' }} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', border: '2px solid #111', fontSize: '16px', fontFamily: 'Montserrat, sans-serif' }} required />
            <button type="submit" disabled={cargandoLogin} style={{ padding: '15px', backgroundColor: '#ff48b0', color: '#fff', border: '3px solid #111', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
              {cargandoLogin ? 'Verificando...' : 'ENTRAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PANEL DE ADMINISTRACIÓN
  // ==========================================
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Panel Riso</h2>
        <button className={`btn-menu ${vistaActiva === 'dashboard' ? 'activo' : ''}`} onClick={() => setVistaActiva('dashboard')}>📊 Dashboard</button>
        <button className={`btn-menu ${vistaActiva === 'catalogo' ? 'activo' : ''}`} onClick={() => setVistaActiva('catalogo')}>📦 Catálogo</button>
        <button className={`btn-menu ${vistaActiva === 'ventas' ? 'activo' : ''}`} onClick={() => setVistaActiva('ventas')}>📈 Ventas</button>
        <button className={`btn-menu ${vistaActiva === 'diseno' ? 'activo' : ''}`} onClick={() => setVistaActiva('diseno')}>🎨 Diseño Web</button>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '3px solid #111' }}>
          <button className="btn-menu" onClick={() => window.open('/', '_blank')} style={{ width: '100%', backgroundColor: '#fff000', color: '#111', marginTop: '10px', fontWeight: 'bold', border: '2px solid #111', padding: '10px' }}>👁️ Ver Tienda</button>
          <button className="btn-menu" onClick={cerrarSesion} style={{ width: '100%', backgroundColor: '#111', color: '#fff', marginTop: '10px', fontWeight: 'bold', border: '2px solid #111', padding: '10px' }}>🚪 Cerrar Sesión</button>
        </div>
      </aside>

      <main className="admin-content">
        
        {vistaActiva === 'dashboard' && (
          <div>
            <h1>Bienvenida, Monserrat</h1>
            <div style={{ marginTop: '20px', padding: '20px', border: '3px solid #111', display: 'inline-block', backgroundColor: '#fff' }}>
                <h3>Resumen Rápido</h3>
                <p><strong>Láminas:</strong> {productos.length}</p>
                <p><strong>Stock total:</strong> {productos.reduce((total, prod) => total + (prod.stock || 0), 0)}</p>
            </div>
          </div>
        )}

        {vistaActiva === 'catalogo' && (
          <div>
            <h1>Gestión de Catálogo</h1>
            
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>{idEdicion ? '✏️ Editar Lámina' : '➕ Nueva Lámina'}</h3>
                
                {/* NUEVO FORMULARIO A DOS COLUMNAS */}
                <form className="admin-formulario" onSubmit={guardarProducto}>
                  
                  <div className="admin-form-grid">
                    
                    {/* COLUMNA IZQUIERDA: TEXTOS */}
                    <div className="admin-col-texto">
                      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      
                      <div className="admin-row-inputs">
                        <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      </div>

                      <div className="admin-row-inputs">
                        <input type="text" placeholder="Categoría (Ej: Fanzine, Print...)" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                        <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box' }} />
                      </div>

                      <textarea placeholder="Descripción larga (sinopsis del producto)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="7" style={{ padding: '10px', border: '2px solid #111', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                    </div>

                    {/* COLUMNA DERECHA: IMÁGENES */}
                    <div className="admin-col-imagenes">
                      <div style={{ padding: '15px', border: '2px solid #ccc', backgroundColor: '#f9f9f9', marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>🖼️ Imagen Principal (Portada):</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagen} style={{ width: '100%' }} />
                        {subiendo && <p style={{ margin: '10px 0 0', color: '#ff48b0', fontSize: '12px', fontWeight: 'bold' }}>⏳ Subiendo...</p>}
                        {imagen && !subiendo && <img src={imagen} alt="Principal" style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #111', marginTop: '10px' }} />}
                      </div>

                      <div style={{ padding: '15px', border: '2px dashed #ccc', backgroundColor: '#f9f9f9' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '10px' }}>✨ Imagen al pasar el cursor (Opcional):</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagenHover} style={{ width: '100%' }} />
                        {subiendoHover && <p style={{ margin: '10px 0 0', color: '#ff48b0', fontSize: '12px', fontWeight: 'bold' }}>⏳ Subiendo secundaria...</p>}
                        {imagenHover && !subiendoHover && <img src={imagenHover} alt="Hover" style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #111', marginTop: '10px' }} />}
                      </div>
                    </div>

                  </div>

                  {/* BOTONES DE ACCIÓN ABAJO */}
                  <div className="admin-form-acciones">
                    <button type="submit" style={{ flex: 1, backgroundColor: '#fff000', border: '3px solid #111', padding: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                      {idEdicion ? 'Actualizar Producto' : 'Guardar Nuevo Producto'}
                    </button>
                    {idEdicion && (
                      <button type="button" onClick={() => {setIdEdicion(null); setTitulo(''); setPrecio(''); setStock(''); setImagen(''); setImagenHover(''); setCategoria(''); setAutor(''); setDescripcion('');}} style={{ padding: '12px 20px', backgroundColor: '#ccc', border: '3px solid #111', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                          Cancelar Edición
                      </button>
                    )}
                  </div>

                </form>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px', overflowX: 'auto' }}>
                <h3>Láminas Actuales</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px', marginTop: '15px' }}>
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
                        <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                          <img src={producto.imagen} alt="P" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #111' }} title="Principal" />
                          {producto.imagen_hover && <img src={producto.imagen_hover} alt="H" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px dashed #ff48b0' }} title="Hover" />[cite: 11]}
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{producto.titulo}</td>
                        <td style={{ padding: '10px' }}>${producto.precio}</td>
                        <td style={{ padding: '10px' }}>
                            <span style={{ color: producto.stock > 0 ? '#111' : 'red', fontWeight: 'bold' }}>{producto.stock || 0} uds.</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                        <button onClick={() => editarProducto(producto)} style={{ marginRight: '10px', padding: '5px 10px', border: '2px solid #111', backgroundColor: '#00e5ff', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => eliminarProducto(producto.id)} style={{ padding: '5px 10px', border: '2px solid #111', backgroundColor: '#ff48b0', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Borrar</button>
                        </td>
                    </tr>
                    ))}
                    {productos.length === 0 && (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No hay láminas creadas todavía.</td></tr>
                    )}
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