import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

export default function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // 🪄 Referencia para controlar el contenedor horizontal
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // 1. Carga de productos (optimizada con caché como hicimos antes)
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

  // 🪄 Lógica para convertir Scroll Vertical en Horizontal
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Si el usuario ya está usando un trackpad horizontal, no interferimos
      if (e.deltaY === 0) return; 

      // Calculamos si estamos en los bordes izquierdo o derecho
      const isAtStart = container.scrollLeft === 0;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      // Si baja la rueda y no está al final -> Mueve a la derecha
      if (e.deltaY > 0 && !isAtEnd) {
        e.preventDefault(); // Evita que la página baje
        container.scrollLeft += e.deltaY;
      }
      // Si sube la rueda y no está al principio -> Mueve a la izquierda
      else if (e.deltaY < 0 && !isAtStart) {
        e.preventDefault(); // Evita que la página suba
        container.scrollLeft += e.deltaY;
      }
    };

    // Usamos { passive: false } para poder usar e.preventDefault() y detener la página
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => container.removeEventListener('wheel', handleWheel);
  }, [productos, cargando]);

  return (
    <section id="catalogo" style={{ width: '100%', padding: '40px 0', backgroundColor: 'var(--color-fondo)' }}>
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ fontFamily: "'Arimo', sans-serif" }}>Cargando galería... ⏳</h3>
        </div>
      ) : (
        /* CONTENEDOR HORIZONTAL SCROLLABLE */
        <div 
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '40px',              // Espacio amplio entre cuadros para el look de galería
            padding: '0 40px',        // Margen a los lados
            paddingBottom: '20px',    
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch', // Scroll suave en iPhones
            scrollbarWidth: 'none',   // Oculta la barra en Firefox
            msOverflowStyle: 'none'   // Oculta la barra en IE/Edge
          }}
          // Clase extra para ocultar la barra en Chrome/Safari
          className="ocultar-scrollbar"
        >
          {productos.map((producto) => (
            
            /* TARJETA DE PRODUCTO AJUSTADA PARA MODO HORIZONTAL */
            <div 
              key={producto.id} 
              className="producto-card" 
              style={{ 
                flex: '0 0 auto',       // 🪄 Esto evita que las tarjetas se aplasten
                width: '350px',         // Ancho fijo editorial
                opacity: producto.stock === 0 ? 0.6 : 1,
                position: 'relative'
              }}
            >
              
              {producto.stock === 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#111', color: 'white', padding: '5px 10px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', zIndex: 20 }}>
                  Agotado
                </div>
              )}

              {/* Imagen con Aspect Ratio de Arte (más alta que ancha) */}
              <div className="producto-imagen-wrapper" style={{ height: '450px', width: '100%', border: '2px solid #111' }}>
                <img src={producto.imagen} alt={producto.titulo} className="img-principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <img src={producto.imagen_hover || producto.imagen} alt={`${producto.titulo} hover`} className="img-secundaria" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div className="producto-info" style={{ marginTop: '20px', textAlign: 'left' }}>
                <h3 style={{ fontFamily: "'Arimo', sans-serif", fontSize: '1.2rem', marginBottom: '5px', color: '#111' }}>
                  {producto.titulo}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: "'Azeret Mono', monospace", fontSize: '1.1rem', margin: 0, color: '#ff48b0', fontWeight: 'bold' }}>
                    ${producto.precio}
                  </p>
                  {producto.stock > 0 && producto.stock <= 3 && (
                    <span style={{ fontSize: '0.8rem', color: '#111', backgroundColor: '#eee', padding: '2px 6px' }}>
                      Quedan {producto.stock}
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={producto.stock === 0}
                  style={{ 
                    marginTop: '20px', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 20px',
                    backgroundColor: producto.stock === 0 ? '#e5e7eb' : 'transparent',
                    color: producto.stock === 0 ? '#9ca3af' : '#111',
                    border: producto.stock === 0 ? '2px solid #e5e7eb' : '2px solid #111',
                    fontFamily: "'Arimo', sans-serif",
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { if (producto.stock > 0) { e.target.style.backgroundColor = '#111'; e.target.style.color = 'white'; } }}
                  onMouseLeave={(e) => { if (producto.stock > 0) { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#111'; } }}
                >
                  {producto.stock === 0 ? 'Sin Stock' : 'Agregar Obra'} <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}