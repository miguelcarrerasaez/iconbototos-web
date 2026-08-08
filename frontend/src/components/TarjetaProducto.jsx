import React from 'react';
import './TarjetaProducto.css';

export default function TarjetaProducto({ imagen, titulo, precio, onClick }) {
  return (
    <div className="tarjeta-producto">
      <div className="tarjeta-imagen-wrapper">
        <img 
          src={imagen} 
          alt={titulo} 
          className="tarjeta-imagen"
        />
      </div>
      <div className="tarjeta-info">
        <h3 className="tarjeta-titulo">{titulo}</h3>
        <button className="tarjeta-carrito" onClick={onClick} aria-label="Agregar al carrito">
          <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.2973 14.29H22.5352V4.56671C22.5352 2.04501 20.4901 0 18.0 0C15.5099 0 13.4648 2.04501 13.4648 4.56671V14.29H10.7027C8.21166 14.29 6.1665 16.335 6.1665 18.8567C6.1665 21.3784 8.21166 23.4234 10.7027 23.4234H25.2973C27.7883 23.4234 29.8335 21.3784 29.8335 18.8567C29.8335 16.335 27.7883 14.29 25.2973 14.29Z" fill="black"/>
            <path d="M3.37718 4.81119C3.2981 4.56672 3.37718 4.30005 3.58005 4.10005C3.78293 3.90005 4.0496 3.80005 4.2981 3.87813C4.54661 3.95621 4.71328 4.12288 4.81328 4.37139C4.91328 4.6199 4.90005 4.90005 4.71328 5.10005L2.67161 8.53348C2.50005 8.75621 2.24293 8.85621 1.97161 8.85621C1.70028 8.85621 1.44316 8.75621 1.27161 8.53348L-0.770271 5.10005C-0.956198 4.90005 -0.969426 4.6199 -0.869426 4.37139C-0.769426 4.12288 -0.602758 3.90005 -0.354257 3.87813C-0.105755 3.80005 0.160912 3.90005 0.362788 4.10005L2.40446 7.53348L3.37718 4.81119Z" fill="black"/>
            <path d="M3.2981 4.56672H0.535995C0.237788 4.56672 0 4.80451 0 5.10005C0 5.3956 0.237788 5.63339 0.535995 5.63339H3.2981C3.59631 5.63339 3.8341 5.3956 3.8341 5.10005C3.8341 4.80451 3.59631 4.56672 3.2981 4.56672Z" fill="black"/>
          </svg>
        </button>
      </div>
    </div>
  );
}