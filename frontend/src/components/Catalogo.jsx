import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Catalogo({ agregarAlCarrito }) {
  // 1. Ahora los productos son un Estado vacío que se llenará con lo que diga Python
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. useEffect hace el fetch a Python apenas carga el componente
  useEffect(() => {
    // IMPORTANTE: Asegúrate de que este sea el puerto donde corre tu Flask local (usualmente 5000)
    fetch('https://iconbototos-api.onrender.com/api/productos') 
      .then(respuesta => respuesta.json())
      .then(data => {
        setProductos(data); // Guardamos los productos que mandó Python
        setCargando(false); // Apagamos el estado de carga
      })
      .catch(error => {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      });
  }, []);

  return (
    <section id="catalogo" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestro Catálogo</h2>
      
      {/* 3. Mientras esperamos a Python, mostramos un mensaje de carga */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Cargando láminas... ⏳</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {productos.map((producto) => (
            <div key={producto.id} style={{ border: '2px solid #eaeaea', borderRadius: '8px', padding: '15px', textAlign: 'center', position: 'relative', opacity: producto.stock === 0 ? 0.6 : 1 }}>
              
              {/* Etiqueta de Agotado visual estilo Risotto */}
              {producto.stock === 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'black', color: 'white', padding: '5px 10px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', borderRadius: '4px' }}>
                  Agotado
                </div>
              )}

              <img src={producto.imagen} alt={producto.titulo} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' }} />
              <h3 style={{ margin: '15px 0 5px 0', fontSize: '1.2rem' }}>{producto.titulo}</h3>
              <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>${producto.precio}</p>
              
              <button 
                onClick={() => agregarAlCarrito(producto)}
                disabled={producto.stock === 0} // Deshabilita el botón si no hay stock
                style={{ 
                  marginTop: '10px', padding: '12px 15px', 
                  backgroundColor: producto.stock === 0 ? '#ccc' : 'black', 
                  color: 'white', border: 'none', borderRadius: '4px', 
                  cursor: producto.stock === 0 ? 'not-allowed' : 'pointer', 
                  width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                  fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                <ShoppingCart size={18} /> {producto.stock === 0 ? 'Sin Stock' : 'Agregar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

