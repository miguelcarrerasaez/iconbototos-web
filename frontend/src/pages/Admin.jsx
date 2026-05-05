import React, { useState, useEffect } from 'react';

// Detectamos si estamos en local o en producción de forma automática
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

function Admin() {
  // --- ESTADOS DEL PANEL ---
  const [vistaActiva, setVistaActiva] = useState('catalogo'); // Iniciamos en catálogo por defecto
  
  // --- ESTADOS DEL CATÁLOGO ---
  const [productos, setProductos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [idEdicion, setIdEdicion] = useState(null);
  const [subiendo, setSubiendo] = useState(false); // Estado para el loader de ImgBB

  // Cargar productos al iniciar
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

  // --- FUNCIÓN PARA SUBIR IMAGEN A IMGBB ---
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
      
      if (datos.success) {
        setImagen(datos.data.url); // Guardamos la URL pública automáticamente en el input
      } else {
        alert("Error de ImgBB: " + datos.error.message);
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error de conexión al subir la fotografía.");
    } finally {
      setSubiendo(false);
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    
    // Validación para evitar guardar sin imagen
    if (!imagen) {
        alert("Por favor, espera a que la imagen se suba o pega un link válido en el campo de URL.");
        return;
    }

    const url = idEdicion 
        ? `${BACKEND_URL}/api/productos/${idEdicion}` 
        : `${BACKEND_URL}/api/productos`;
    const metodo = idEdicion ? 'PUT' : 'POST';

    const nuevoProducto = {
      titulo: titulo,
      precio: parseFloat(precio),
      imagen: imagen
    };

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      if (respuesta.ok) {
        setTitulo('');
        setPrecio('');
        setImagen('');
        setIdEdicion(null);
        cargarProductos();
        alert(idEdicion ? "Lámina actualizada" : "Lámina creada exitosamente");
      } else {
        alert("Error del servidor al guardar la lámina.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error de conexión al guardar la lámina");
    }
  };

  const editarProducto = (producto) => {
    setTitulo(producto.titulo);
    setPrecio(producto.precio);
    setImagen(producto.imagen);
    setIdEdicion(producto.id);
    setVistaActiva('catalogo');
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta lámina de forma permanente?")) return;

    try {
      const respuesta = await fetch(`${BACKEND_URL}/api/productos/${id}`, {
        method: 'DELETE'
      });
      if (respuesta.ok) {
        cargarProductos();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="admin-container">
      
      {/* --- MENÚ LATERAL IZQUIERDO --- */}
      <aside className="admin-sidebar">
        <h2>Panel Riso</h2>
        
        <button 
          className={`btn-menu ${vistaActiva === 'dashboard' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('dashboard')}
        >
          📊 Dashboard
        </button>

        <button 
          className={`btn-menu ${vistaActiva === 'catalogo' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('catalogo')}
        >
          📦 Catálogo
        </button>

        <button 
          className={`btn-menu ${vistaActiva === 'ventas' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('ventas')}
        >
          📈 Ventas
        </button>

        <button 
          className={`btn-menu ${vistaActiva === 'diseno' ? 'activo' : ''}`}
          onClick={() => setVistaActiva('diseno')}
        >
          🎨 Diseño Web
        </button>

        {/* --- NUEVO BOTÓN PARA VER LA TIENDA --- */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '3px solid #111' }}>
          <button 
            className="btn-menu"
            onClick={() => window.open('/', '_blank')}
            style={{ width: '100%', backgroundColor: '#fff000', color: '#111', marginTop: '10px' }}
          >
            👁️ Ver Tienda Pública
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO DERECHO DINÁMICO --- */}
      <main className="admin-content">
        
        {/* VISTA: DASHBOARD */}
        {vistaActiva === 'dashboard' && (
          <div>
            <h1>Bienvenida, Monserrat</h1>
            <p>Selecciona una opción en el menú de la izquierda para administrar la tienda.</p>
            <div style={{ marginTop: '20px', padding: '20px', border: '3px solid #111', display: 'inline-block', backgroundColor: '#fff' }}>
                <h3>Resumen Rápido</h3>
                <p><strong>Láminas en catálogo:</strong> {productos.length}</p>
            </div>
          </div>
        )}

        {/* VISTA: CATÁLOGO */}
        {vistaActiva === 'catalogo' && (
          <div>
            <h1>Gestión de Catálogo</h1>
            
            {/* Formulario de Creación/Edición */}
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px', marginBottom: '30px' }}>
                <h3>{idEdicion ? '✏️ Editar Lámina' : '➕ Nueva Lámina'}</h3>
                
                <form onSubmit={guardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                    
                    <input 
                        type="text" 
                        placeholder="Título de la lámina" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required 
                        style={{ padding: '8px', border: '2px solid #111' }}
                    />
                    
                    <input 
                        type="number" 
                        placeholder="Precio (Ej: 15000)" 
                        value={precio} 
                        onChange={(e) => setPrecio(e.target.value)} 
                        required 
                        style={{ padding: '8px', border: '2px solid #111' }}
                    />

                    {/* --- CAMPO DE URL VISIBLE (NUEVO) --- */}
                    <input 
                        type="url" 
                        placeholder="URL de la imagen (se llena sola o pégala aquí)" 
                        value={imagen} 
                        onChange={(e) => setImagen(e.target.value)} 
                        required 
                        style={{ padding: '8px', border: '2px dashed #111', backgroundColor: '#f9f9f9' }}
                    />
                    
                    {/* BOTÓN PARA SUBIR IMAGEN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Subir Fotografía (Opcional):</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={manejarSubidaImagen} 
                            style={{ padding: '8px', border: '2px solid #111', backgroundColor: '#f4f0e6', cursor: 'pointer' }}
                        />
                        
                        {/* Mensaje de espera */}
                        {subiendo && <p style={{ margin: '5px 0', color: '#ff48b0', fontWeight: 'bold' }}>⏳ Subiendo a la nube...</p>}
                        
                        {/* Vista previa de la imagen ya subida */}
                        {imagen && !subiendo && (
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>✓ Imagen vinculada</p>
                                <img 
                                    src={imagen} 
                                    alt="Vista previa" 
                                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', border: '3px solid #111' }} 
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="btn-comprar" style={{ flex: 1, backgroundColor: '#fff000', border: '3px solid #111', fontWeight: 'bold', cursor: 'pointer', padding: '10px' }}>
                        {idEdicion ? 'Actualizar Lámina' : 'Guardar Lámina'}
                        </button>
                        {idEdicion && (
                        <button type="button" onClick={() => {setIdEdicion(null); setTitulo(''); setPrecio(''); setImagen('');}} style={{ padding: '10px', backgroundColor: '#ccc', border: '3px solid #111', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cancelar
                        </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabla de Productos */}
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '20px' }}>
                <h3>Láminas Actuales</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '3px solid #111' }}>
                    <th style={{ padding: '10px' }}>Imagen</th>
                    <th style={{ padding: '10px' }}>Título</th>
                    <th style={{ padding: '10px' }}>Precio</th>
                    <th style={{ padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                    <tr key={producto.id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '10px' }}>
                        <img src={producto.imagen} alt={producto.titulo} style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid #111' }} />
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{producto.titulo}</td>
                        <td style={{ padding: '10px' }}>${producto.precio}</td>
                        <td style={{ padding: '10px' }}>
                        <button onClick={() => editarProducto(producto)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', border: '2px solid #111', backgroundColor: '#00e5ff', fontWeight: 'bold' }}>Editar</button>
                        <button onClick={() => eliminarProducto(producto.id)} style={{ padding: '5px 10px', cursor: 'pointer', border: '2px solid #111', backgroundColor: '#ff48b0', color: 'white', fontWeight: 'bold' }}>Borrar</button>
                        </td>
                    </tr>
                    ))}
                    {productos.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No hay láminas en el catálogo aún.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          </div>
        )}

        {/* VISTA: VENTAS */}
        {vistaActiva === 'ventas' && (
          <div>
            <h1>Historial de Ventas</h1>
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#ff48b0' }}>Próximamente 🚧</h2>
                <p>Aquí verás un registro de todos los pagos aprobados por Mercado Pago.</p>
            </div>
          </div>
        )}

        {/* VISTA: DISEÑO WEB */}
        {vistaActiva === 'diseno' && (
          <div>
            <h1>Apariencia de la Tienda</h1>
            <div style={{ backgroundColor: '#fff', border: '3px solid #111', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#00e5ff' }}>Próximamente 🚧</h2>
                <p>Aquí podrás cambiar los colores flúor, textos y el banner principal de la página.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;