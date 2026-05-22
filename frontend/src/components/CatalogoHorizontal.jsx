import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';

const BACKEND_URL = "https://iconbototos-api.onrender.com"; 

export default function CatalogoHorizontal({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/productos`) 
      .then(r => r.json())
      .then(data => { setProductos(data); setCargando(false); });
  }, []);

  // Para el efecto infinito, duplicamos o triplicamos la lista
  const productosInfinitos = [...productos, ...productos, ...productos];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault(); // Evita que la página suba/baje
      container.scrollLeft += e.deltaY; // Mueve horizontalmente según la rueda
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [cargando]);

  return (
    <section style={{ width: '100%', overflow: 'hidden', backgroundColor: '#f4f0e6', padding: '0' }}>
      {cargando ? <p style={{ padding: '20px' }}>Cargando galería...</p> : (
        <div 
          ref={scrollContainerRef}
          className="horizontal-scroll-container"
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0px', 
            scrollbarWidth: 'none'
          }}
        >
          {productosInfinitos.map((producto, index) => (
            <div key={`${producto.id}-${index}`} className="item-galeria">
              <div className="imagen-contenedor">
                <img src={producto.imagen} alt={producto.titulo} className="img-zoom" />
              </div>
              <div className="info-galeria">
                <h4 style={{ margin: 0 }}>{producto.titulo}</h4>
                <p style={{ margin: 0 }}>${producto.precio}</p>
                <button onClick={() => agregarAlCarrito(producto)} className="btn-add">
                   <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}