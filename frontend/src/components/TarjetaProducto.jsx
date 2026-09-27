import React from 'react';
import { Link } from 'react-router-dom';
import './TarjetaProducto.css';

export default function TarjetaProducto({ producto }) {
  // Aseguramos que use la primera imagen del array si existe, o una por defecto
  const imagenPortada = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes[0] 
    : producto.imagen;

  return (
    <div className="tarjeta-card">
      
      <div className="tarjeta-imagen-wrapper">
        {/* 1. ENVOLVEMOS LA IMAGEN CON UN LINK */}
        <Link to={`/tienda/${producto.id}`}>
          <img 
            className="tarjeta-imagen" 
            src={imagenPortada} 
            alt={producto.titulo} 
          />
        </Link>
        
        {/* El carrito queda fuera del Link para que el botón siga agregando al carro */}
        <button className="tarjeta-carrito" aria-label="Agregar al carrito">
          <img src="/img/menu-carrito.svg" alt="Carrito" />
        </button>
      </div>
      
      <div className="tarjeta-info">
        {/* 2. ENVOLVEMOS EL TÍTULO CON UN LINK */}
        <Link to={`/tienda/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="tarjeta-titulo">{producto.titulo}</h3>
        </Link>
      </div>

    </div>
  );
}