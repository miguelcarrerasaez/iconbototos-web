import React from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import './Tienda.css';
// 1. Importamos la base de datos centralizada
import { productos } from '../data/productos'; 

export default function Tienda() {
  const navigate = useNavigate();

  return (
    <div className="tienda-layout">
      <div className="tienda-grid">
        {productos.map(producto => (
          <TarjetaProducto
            key={producto.id}
            // 2. Leemos la primera imagen del array 'imagenes' que usamos en productos.js
            imagen={producto.imagenes[0]} 
            titulo={producto.titulo}
            precio={producto.precio}
            onClick={() => navigate(`/tienda/${producto.id}`)}
          />
        ))}
      </div>
    </div>
  );
}