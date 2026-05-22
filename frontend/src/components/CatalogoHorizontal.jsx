import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

export default function CatalogoHorizontal({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const cacheGuardado = localStorage.getItem('catalogoIconbototos');
    if (cacheGuardado) {
      setProductos(JSON.parse(cacheGuardado));
      setCargando(false);
    }

    fetch(`${BACKEND_URL}/api/productos`) 
      .then(respuesta => respuesta.json())
      .then(data => {
        setProductos(data);
        localStorage.setItem('catalogoIconbototos', JSON.stringify(data));
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return; 
      const isAtStart = container.scrollLeft === 0;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      if (e.deltaY > 0 && !isAtEnd) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
      } else if (e.deltaY < 0 && !isAtStart) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [productos, cargando]);

  return (
    <section style={{ width: '100%', padding: '40px 0 0 0', backgroundColor: 'var(--color-fondo)', borderBottom: '2px solid #111' }}>
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ fontFamily: "'Arimo', sans-serif" }}>Cargando galería... ⏳</h3>
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0px', // Totalmente juntos, sin margen lateral
            padding: '0', 
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="ocultar-scrollbar"
        >
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              style={{ 
                flex: '0 0 auto',
                width: '300px', // Ancho fijo perfecto para mantener consistencia de grilla horizontal
                position: 'relative',
                overflow: 'hidden',
                borderRight: '2px solid #111', // Línea divisoria brutalista
                backgroundColor: '#ffffff',
                opacity: producto.stock === 0 ? 0.6 : 1
              }}
              className="horizontal-item-wrapper"
            >
              {/* Contenedor de Imagen con máscara para el zoom interno */}
              <div style={{ width: '100%', height: '400px', overflow: 'hidden', position: 'relative', borderBottom: '2px solid #111' }}>
                <img 
                  src={producto.imagen} 
                  alt={producto.titulo} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                  }} 
                  className="img-horizontal-zoom"
                />
                
                {producto.stock === 0 && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#111', color: 'white', padding: '4px 8px', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Agotado
                  </div>
                )}
              </div>

              {/* Información inferior limpia */}
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h4 style={{ margin: 0, fontFamily: "'Arimo', sans-serif", fontSize: '0.95rem', textTransform: 'uppercase', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {producto.titulo}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <p style={{ margin: 0, fontFamily: "'Azeret Mono', monospace", fontSize: '0.9rem', color: '#ff48b0', fontWeight: 'bold' }}>
                    ${producto.precio}
                  </p>
                  
                  {producto.stock > 0 && (
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.2s'
                      }}
                      className="btn-add-horizontal"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}