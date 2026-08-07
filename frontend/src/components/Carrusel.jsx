import React from 'react';
import { ShoppingCart } from 'lucide-react';
import './Carrusel.css';

export default function Carrusel() {
  const productos = [
    { id: 1, titulo: 'Lenta' },
    { id: 2, titulo: 'Domingo' },
    { id: 3, titulo: 'Título obra' },
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
              src="D:\iconbototos\frontend\public\img\lamina-azul.jpg" 
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