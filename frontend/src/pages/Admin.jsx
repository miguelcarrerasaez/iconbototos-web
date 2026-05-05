import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, X, Save } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false); // Estado exclusivo para la foto
  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [formulario, setFormulario] = useState({
    titulo: '',
    precio: '',
    stock: '',
    imagen: '' 
  });

  // 1. VERIFICAR TOKEN Y LEER PRODUCTOS
  useEffect(() => {
    const token = localStorage.getItem('token_iconbototos');
    if (!token) {
      navigate('/login'); 
      return;
    }

    fetch('https://iconbototos-api.onrender.com/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando BD:", err);
        setCargando(false);
      });
  }, [navigate]);

  // 2. ELIMINAR PRODUCTO (Protegido con JWT)
  const eliminarProducto = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${titulo}" del catálogo?`)) return;

    const token = localStorage.getItem('token_iconbototos');

    try {
      const respuesta = await fetch(`https://iconbototos-api.onrender.com/api/productos/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (respuesta.ok) {
        setProductos(productos.filter(p => p.id !== id));
        toast.success(`"${titulo}" eliminado correctamente`);
      } else {
        toast.error('Tu sesión ha expirado o no tienes permisos');
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
    }
  };

  // 3. PREPARAR EDICIÓN
  const editarProducto = (producto) => {
    setFormulario({ titulo: producto.titulo, precio: producto.precio, stock: producto.stock, imagen: producto.imagen });
    setIdEdicion(producto.id);
    setMostrarFormulario(true);
  };

  // 4. GUARDAR (CREAR O ACTUALIZAR) (Protegido con JWT)
  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!formulario.titulo || !formulario.precio || !formulario.stock || !formulario.imagen) {
      toast.error('Por favor completa todos los campos y sube una imagen');
      return;
    }

    const payload = { ...formulario, precio: parseInt(formulario.precio), stock: parseInt(formulario.stock) };
    const token = localStorage.getItem('token_iconbototos');

    try {
      const url = idEdicion ? `https://iconbototos-api.onrender.com/api/productos/${idEdicion}` : 'https://iconbototos-api.onrender.com/api/productos';
      const metodo = idEdicion ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        if (idEdicion) {
          setProductos(productos.map(p => p.id === idEdicion ? data.producto : p));
          toast.success('¡Lámina actualizada!');
        } else {
          setProductos([...productos, data.producto]); 
          toast.success('¡Lámina agregada!');
        }
        setFormulario({ titulo: '', precio: '', stock: '', imagen: '' });
        setIdEdicion(null);
        setMostrarFormulario(false);
      } else {
        toast.error('Acceso denegado. Vuelve a iniciar sesión.');
      }
    } catch (error) {
      toast.error('Error de conexión al guardar');
    }
  };

  // 5. CERRAR Y ABRIR FORMULARIO
  const toggleFormulario = () => {
    if (mostrarFormulario) {
      setFormulario({ titulo: '', precio: '', stock: '', imagen: '' });
      setIdEdicion(null);
    }
    setMostrarFormulario(!mostrarFormulario);
  };

  // 6. CERRAR SESIÓN
  const cerrarSesion = () => {
    localStorage.removeItem('token_iconbototos');
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Toaster richColors position="bottom-right" />

      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>Panel de Administración</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Gestión de inventario - Iconbototos</p>
        </div>
        <button onClick={cerrarSesion} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={18} /> Salir
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* BARRA SUPERIOR BOTÓN AGREGAR */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={toggleFormulario}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: mostrarFormulario ? '#6b7280' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
            {mostrarFormulario ? <X size={18} /> : <Plus size={18} />} 
            {mostrarFormulario ? 'Cancelar' : 'Agregar Lámina'}
          </button>
        </div>

        {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
        {mostrarFormulario && (
          <form onSubmit={guardarProducto} style={{ padding: '20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#374151' }}>Título de la Lámina</label>
              <input type="text" value={formulario.titulo} onChange={(e) => setFormulario({...formulario, titulo: e.target.value})} placeholder="Ej: Lámina Roja" style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#374151' }}>Precio ($)</label>
              <input type="number" value={formulario.precio} onChange={(e) => setFormulario({...formulario, precio: e.target.value})} placeholder="Ej: 5000" style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#374151' }}>Stock Actual</label>
              <input type="number" value={formulario.stock} onChange={(e) => setFormulario({...formulario, stock: e.target.value})} placeholder="Ej: 10" style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>

            {/* BOTÓN IMGBB */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#374151', display: 'flex', justifyContent: 'space-between' }}>
                Subir Imagen 
                {subiendoImagen && <span style={{color: '#3b82f6'}}>(Subiendo... ⏳)</span>}
              </label>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  disabled={subiendoImagen}
                  onChange={async (e) => {
                    const archivo = e.target.files[0];
                    if (!archivo) return;

                    setSubiendoImagen(true);
                    
                    const formData = new FormData();
                    formData.append('image', archivo);

                    try {
                      // ⚠️ REEMPLAZA ESTO CON TU API KEY DE IMGBB
                      const API_KEY = "369301acc9fbf5e2b93cbabc2cba70fd"; 
                      
                      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                        method: 'POST',
                        body: formData
                      });

                      const data = await res.json();

                      if (data.success) {
                        setFormulario({...formulario, imagen: data.data.url}); 
                        toast.success('¡Imagen lista!');
                      } else {
                        toast.error('Error al subir a ImgBB');
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error('Error de conexión con la nube');
                    } finally {
                      setSubiendoImagen(false);
                    }
                  }} 
                  style={{ flex: 1, padding: '7px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: 'white' }} 
                />
                {formulario.imagen && (
                  <img src={formulario.imagen} alt="Preview" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                )}
              </div>
            </div>

            <button type="submit" disabled={subiendoImagen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', height: '40px', backgroundColor: subiendoImagen ? '#ccc' : (idEdicion ? '#f59e0b' : '#3b82f6'), color: 'white', border: 'none', borderRadius: '6px', cursor: subiendoImagen ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              <Save size={18} /> {idEdicion ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        )}

        {/* TABLA */}
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Cargando base de datos... ⏳</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.9rem' }}>
              <tr>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>Imagen</th>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>Título</th>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>Precio</th>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb' }}>Stock</th>
                <th style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={{ padding: '15px 20px', color: '#6b7280' }}>#{producto.id}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <img src={producto.imagen} alt={producto.titulo} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#111827' }}>{producto.titulo}</td>
                  <td style={{ padding: '15px 20px', color: '#111827' }}>${producto.precio}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ backgroundColor: producto.stock > 5 ? '#d1fae5' : '#fee2e2', color: producto.stock > 5 ? '#065f46' : '#991b1b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {producto.stock} uds.
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                    <button onClick={() => editarProducto(producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '15px' }} title="Editar">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => eliminarProducto(producto.id, producto.titulo)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}