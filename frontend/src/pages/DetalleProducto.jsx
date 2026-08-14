import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { productos } from '../data/productos'; // <-- Un solo '..' para subir a src/
import '../components/DetalleProducto.css';    // <-- Ruta correcta apuntando a components/

export default function DetalleProducto() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  
  // Buscar el producto en la base de datos
  const producto = productos.find(p => p.id === id);

  if (!producto) return <h2>Producto no encontrado</h2>;

  return (
    <div className="detalle-layout">
      
      {/* SECCIÓN 1: MAIN CONTENT */}
      <div className="detalle-main">
        {/* Izquierda: Carrusel */}
        <div className="detalle-carrusel">
          <img src={producto.imagenes[0]} alt={producto.titulo} className="carrusel-imagen-principal" />
          {/* Aquí irán los puntos de paginación del diseño */}
        </div>

        {/* Derecha: Info */}
        <div className="detalle-info">
          <h1 className="detalle-titulo">{producto.titulo}</h1>
          
          <div className="detalle-etiquetas">
            <span className="badge-gris">{producto.categoria}</span>
            <span className="badge-gris">{producto.autor}</span>
          </div>

          <div className="detalle-precio">{producto.precio}</div>

          <div className="detalle-controles">
            <div className="selector-cantidad">
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</span>
              <span>{cantidad}</span>
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(cantidad + 1)}>+</span>
            </div>
            <button className="btn-agregar-negro">Agregar al carrito</button>
          </div>

          {producto.stock && (
            <div className="detalle-stock">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                 {/* Reemplazar con el SVG real de la hojita */}
                 <circle cx="16" cy="16" r="12" stroke="#407060" strokeWidth="2"/>
              </svg>
              En stock
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: DESCRIPCIÓN */}
      <div className="detalle-descripcion">
        <p>{producto.descripcion.sinopsis}</p>
        <p>{producto.descripcion.bio}</p>
        <p>{producto.descripcion.fichaTecnica}</p>
      </div>

    </div>
  );
}