import React from 'react';
import { Link } from 'react-router-dom';
import './Carrusel.css';

export default function Carrusel() {
  // IDs actualizados según tu base de datos (productos.js)
  const productos = [
    { id: "6", titulo: 'Lento', imagen: '/img/lento.png' },
    { id: "3", titulo: 'Sábanas', imagen: '/img/sabanas.png' },
    { id: "1", titulo: 'Domingo', imagen: '/img/domingo.png' },
  ];

  return (
    <section className="carrusel-seccion">
      <Link to="/tienda" className="carrusel-ver-mas">Ver más</Link>

      <div className="carrusel-contenedor">
        {productos.map(producto => (
          <div key={producto.id} className="carrusel-card">
            
            <div className="carrusel-imagen-wrapper">
              <Link to={`/tienda/${producto.id}`}>
                <img 
                  className="carrusel-imagen" 
                  src={producto.imagen} 
                  alt={producto.titulo} 
                />
              </Link>
              
              <button className="carrusel-carrito" aria-label="Agregar al carrito">
                <img src="/img/MenúCarrito.svg" alt="Carrito" />
              </button>
            </div>
            
            <div className="carrusel-info">
              <Link to={`/tienda/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="carrusel-titulo">{producto.titulo}</h3>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}