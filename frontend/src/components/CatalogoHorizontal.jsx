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

  // Scroll Horizontal infinito (efecto visual)
  const productosDuplicados = [...productos, ...productos];

  return (
    <section style={{ width: '100%', overflow: 'hidden', backgroundColor: '#f4f0e6' }}>
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
          {productosDuplicados.map((producto, index) => (
            <div key={`${producto.id}-${index}`} className="item-galeria">
              <div className="imagen-contenedor">
                <img src={producto.imagen} alt={producto.titulo} className="img-zoom" />
              </div>
              <div className="info-galeria">
                <h4>{producto.titulo}</h4>
                <p>${producto.precio}</p>
                <button onClick={() => agregarAlCarrito(producto)}><ShoppingCart size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}