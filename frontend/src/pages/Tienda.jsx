import React from 'react';
import TarjetaProducto from '../components/TarjetaProducto';
import './Tienda.css';
import { productos } from '../data/productos'; 

export default function Tienda() {
  return (
    <div className="tienda-layout">
      <div className="tienda-grid">
        {productos.map(producto => (
          <TarjetaProducto
            key={producto.id}
            producto={producto} /* Esto soluciona el pantallazo blanco */
          />
        ))}
      </div>
    </div>
  );
}