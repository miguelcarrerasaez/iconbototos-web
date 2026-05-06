import React, { useState, useEffect } from 'react';

// Detectamos si estamos en local o en producción de forma automática
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

function Admin() {
  const [vistaActiva, setVistaActiva] = useState('catalogo');
  
  const [productos, setProductos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  
  // 📸 NUEVOS ESTADOS PARA LA SEGUNDA IMAGEN (HOVER)
  const [imagenHover, setImagenHover] = useState('');
  const [subiendoHover, setSubiendoHover] = useState(false);
  
  const [idEdicion, setIdEdicion] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

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

  // Función para subir la imagen PRINCIPAL
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

  // 📸 NUEVA FUNCIÓN: Subir la imagen SECUNDARIA (HOVER)
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
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert("🚨 Tu navegador no tiene ningún token guardado. Ve a /login e inicia sesión.");
        return; 
    }

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
      imagen_hover: imagenHover // 📸 Enviamos la segunda foto a Python
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

      if (respuesta.ok) {
        setTitulo('');
        setPrecio('');
        setStock('');
        setImagen('');
        setImagenHover(''); // Limpiamos la segunda foto
        setIdEdicion(null);
        cargarProductos();
        alert(idEdicion ? "Lámina actualizada" : "Lámina creada");
      } else {
        alert("Error del servidor");
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
    setImagenHover(producto.imagen_hover || ''); // Cargamos la segunda foto si existe
    setIdEdicion(producto.id);
    setVistaActiva('catalogo');
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta lámina?")) return;
    const token = localStorage.getItem('token');

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (respuesta.ok) cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="admin-container">
      
      <aside className="admin-sidebar">
        <h2>Panel Riso</h2>
        <button className={`btn-menu ${vistaActiva === 'dashboard' ? 'activo' : ''}`} onClick={() => setVistaActiva('dashboard')}>📊 Dashboard</button>
        <button className={`btn-menu ${vistaActiva === 'catalogo' ? 'activo' : ''}`} onClick={() => setVistaActiva('catalogo')}>📦 Catálogo</button>
        <button className={`btn-menu ${vistaActiva === 'ventas' ? 'activo' : ''}`} onClick={() => setVistaActiva('ventas')}>📈 Ventas</button>
        <button className={`btn-menu ${vistaActiva === 'diseno' ? 'activo' : ''}`} onClick={() => setVistaActiva('diseno')}>🎨 Diseño Web</button>
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '3px solid #111' }}>
          <button className="btn-menu" onClick={() => window.open('/', '_blank')} style={{ width: '100%', backgroundColor: '#fff000', color: '#111', marginTop: '10px' }}>👁️ Ver Tienda</button>
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
                <h3>{idEdicion ? '✏️ Editar Lámina' : '➕ Nueva Lámina'}</h3>
                
                <form onSubmit={guardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                    
                    <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ padding: '8px', border: '2px solid #111' }} />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ padding: '8px', border: '2px solid #111', flex: 1 }} />
                        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ padding: '8px', border: '2px solid #111', width: '100px' }} />
                    </div>

                    {/* --- ZONA DE IMAGEN PRINCIPAL --- */}
                    <div style={{ padding: '10px', border: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '5px' }}>🖼️ Imagen Principal:</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagen} style={{ width: '100%', marginBottom: '5px' }} />
                        {subiendo && <p style={{ margin: 0, color: '#ff48b0', fontSize: '12px' }}>⏳ Subiendo...</p>}
                        {imagen && !subiendo && <img src={imagen} alt="Principal" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #111', marginTop: '5px' }} />}
                    </div>

                    {/* --- ZONA DE IMAGEN HOVER --- */}
                    <div style={{ padding: '10px', border: '2px dashed #ccc', backgroundColor: '#f9f9f9' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '5px' }}>✨ Imagen al pasar el cursor (Opcional):</label>
                        <input type="file" accept="image/*" onChange={manejarSubidaImagenHover} style={{ width: '100%', marginBottom: '5px' }} />
                        {subiendoHover && <p style={{ margin: 0, color: '#ff48b0', fontSize: '12px' }}>⏳ Subiendo secundaria...</p>}
                        {imagenHover && !subiendoHover && <img src={imagenHover} alt="Hover" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #111', marginTop: '5px' }} />}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="btn-comprar" style={{ flex: 1, backgroundColor: '#fff000', border: '3px solid #111', padding: '10px' }}>
                          {idEdicion ? 'Actualizar' : 'Guardar'}
                        </button>
                        {idEdicion && (
                          <button type="button" onClick={() => {setIdEdicion(null); setTitulo(''); setPrecio(''); setStock(''); setImagen(''); setImagenHover('');}} style={{ padding: '10px', backgroundColor: '#ccc', border: '3px solid #111' }}>
                              Cancelar
                          </button>
                        )}
                    </div>
                </form>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px' }}>
                <h3>Láminas Actuales</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                          <img src={producto.imagen} alt="P" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #111', marginRight: '5px' }} title="Principal" />
                          {/* Mostramos una miniatura de la segunda foto si existe */}
                          {producto.imagen_hover && <img src={producto.imagen_hover} alt="H" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px dashed #ff48b0' }} title="Hover" />}
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{producto.titulo}</td>
                        <td style={{ padding: '10px' }}>${producto.precio}</td>
                        <td style={{ padding: '10px' }}>
                            <span style={{ color: producto.stock > 0 ? '#111' : 'red', fontWeight: 'bold' }}>{producto.stock || 0} uds.</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                        <button onClick={() => editarProducto(producto)} style={{ marginRight: '10px', padding: '5px 10px', border: '2px solid #111', backgroundColor: '#00e5ff', fontWeight: 'bold' }}>Editar</button>
                        <button onClick={() => eliminarProducto(producto.id)} style={{ padding: '5px 10px', border: '2px solid #111', backgroundColor: '#ff48b0', color: 'white', fontWeight: 'bold' }}>Borrar</button>
                        </td>
                    </tr>
                    ))}
                    {productos.length === 0 && (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No hay láminas.</td></tr>
                    )}
                </tbody>
                </table>
            </div>
          </div>
        )}

        {vistaActiva === 'ventas' && (
          <div>
            <h1>Historial de Ventas</h1>
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#ff48b0' }}>Próximamente 🚧</h2>
            </div>
          </div>
        )}

        {vistaActiva === 'diseno' && (
          <div>
            <h1>Apariencia de la Tienda</h1>
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '40px',