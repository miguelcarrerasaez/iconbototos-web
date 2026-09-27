import React from 'react';
import { Link } from 'react-router-dom';
import './Carrusel.css';

export default function Carrusel() {
  const productos = [
    { id: 1, titulo: 'Lento', imagen: '/img/lento.png' },
    { id: 2, titulo: 'Sábanas', imagen: '/img/sabanas.png' },
    { id: 3, titulo: 'Domingo', imagen: '/img/domingo.png' },
  ];

  return (
    <section className="carrusel-seccion">
      {/* Enlace "Ver más" mejorado con React Router */}
      <Link to="/tienda" className="carrusel-ver-mas">Ver más</Link>

      {/* Contenedor del carrusel */}
      <div className="carrusel-contenedor">
        {productos.map(producto => (
          <div key={producto.id} className="carrusel-card">
            
            {/* 1. Nuevo contenedor relativo para la imagen y el carrito */}
            <div className="carrusel-imagen-wrapper">
              {/* ENVOLVEMOS LA IMAGEN CON UN LINK */}
              <Link to={`/tienda/${producto.id}`}>
                <img 
                  className="carrusel-imagen" 
                  src={producto.imagen} 
                  alt={producto.titulo} 
                />
              </Link>
              
              {/* El botón del carrito sigue flotando por encima sin interrumpir el clic de la foto */}
              <button className="carrusel-carrito" aria-label="Agregar al carrito">
                <img src="/img/MenúCarrito.svg" alt="Carrito" />
              </button>
            </div>
            
            {/* Información de la tarjeta */}
            <div className="carrusel-info">
              {/* ENVOLVEMOS EL TÍTULO CON UN LINK */}
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