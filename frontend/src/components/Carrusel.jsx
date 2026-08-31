import React from 'react';
import { ShoppingCart } from 'lucide-react';
import './Carrusel.css';

export default function Carrusel() {
  const productos = [
    { id: 1, titulo: 'Lento', imagen: '/img/lento.png' },
    { id: 2, titulo: 'Sábanas', imagen: '/img/sabanas.png' },
    { id: 3, titulo: 'Domingo', imagen: '/img/domingo.png' },
  ];

  return (
    <section className="carrusel-seccion">
      {/* Enlace "Ver más" alineado a la derecha */}
      <a href="/tienda" className="carrusel-ver-mas">Ver más</a>

      {/* Contenedor del carrusel */}
      <div className="carrusel-contenedor">
        {productos.map(producto => (
          <div key={producto.id} className="carrusel-card">
            <img 
              className="carrusel-imagen" 
              src={producto.imagen} 
              alt={producto.titulo} 
            />
            <div className="carrusel-info">
              <h3 className="carrusel-titulo">{producto.titulo}</h3>
              <button className="carrusel-carrito" aria-label="Agregar al carrito">
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}