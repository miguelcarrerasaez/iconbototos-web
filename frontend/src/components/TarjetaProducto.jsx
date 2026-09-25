import React from 'react';
import './TarjetaProducto.css';

export default function TarjetaProducto({ imagen, titulo, precio, onClick }) {
  return (
    <div className="tarjeta-producto">
      
      {/* Contenedor de la imagen y el carrito flotante */}
      <div className="tarjeta-imagen-wrapper">
        <img 
          src={imagen} 
          alt={titulo} 
          className="tarjeta-imagen"
        />
        {/* El botón del carrito ahora está aquí adentro */}
        <button className="tarjeta-carrito" aria-label="Agregar al carrito">
          <img src="/img/MenúCarrito.svg" alt="Carrito" />
        </button>
      </div>
      
      {/* Contenedor del título */}
      <div className="tarjeta-info">
        <h3 className="tarjeta-titulo">{titulo}</h3>
      </div>
      
    </div>
  );
}