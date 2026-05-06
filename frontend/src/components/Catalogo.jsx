import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

// URL dinámica para que funcione tanto en tu PC como en la web
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

export default function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/productos`) 
      .then(respuesta => respuesta.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      });
  }, []);

  return (
      <section id="catalogo" className="seccion-catalogo">
      
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Cargando láminas... ⏳</h3>
        </div>
      ) : (
        /* AQUÍ ESTÁ LA MAGIA: Llamamos a la clase de la grilla de 4 columnas */
        <div className="catalogo-grid">
          {productos.map((producto) => (
            /* Llamamos a la clase de la tarjeta brutalista */
            <div key={producto.id} className="producto-card" style={{ opacity: producto.stock === 0 ? 0.6 : 1 }}>
              
              {/* Etiqueta de Agotado */}
              {producto.stock === 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'black', color: 'white', padding: '5px 10px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', zIndex: 20 }}>
                  Agotado
                </div>
              )}

              {/* Contenedor de la imagen con efecto Hover/Zoom */}
              <div className="producto-imagen-wrapper">
                <img src={producto.imagen} alt={producto.titulo} className="img-principal" />
                <img src={producto.imagen_hover || producto.imagen} alt={`${producto.titulo} hover`} className="img-secundaria" />
              </div>

              <div className="producto-info">
                <h3>{producto.titulo}</h3>
                
                <div className="producto-precio-stock">
                  <p className="precio">${producto.precio}</p>
                  {producto.stock > 0 && producto.stock <= 3 && (
                    <span className="stock-bajo">¡Solo quedan {producto.stock}!</span>
                  )}
                </div>

                <button 
                  className="btn-comprar"
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={producto.stock === 0}
                  style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '8px',
                    // Si está agotado, apagamos el color flúor del botón
                    backgroundColor: producto.stock === 0 ? '#ccc' : 'var(--color-botones)',
                    color: producto.stock === 0 ? '#666' : 'var(--color-texto)',
                    cursor: producto.stock === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ShoppingCart size={18} /> {producto.stock === 0 ? 'Sin Stock' : 'Agregar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}