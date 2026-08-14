import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { productos } from '../data/productos';
import '../components/DetalleProducto.css';

export default function DetalleProducto() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  
  const producto = productos.find(p => p.id === id);

  if (!producto) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Producto no encontrado</h2>;

  return (
    <div className="detalle-layout">
      
      {/* SECCIÓN 1: MAIN CONTENT */}
      <div className="detalle-main">
        {/* Izquierda: Carrusel */}
        <div className="detalle-carrusel">
          <div className="carrusel-imagen-contenedor">
            {/* Flecha Izquierda */}
            <button className="carrusel-flecha izquierda">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <img src={producto.imagenes[0]} alt={producto.titulo} className="carrusel-imagen-principal" />
            
            {/* Flecha Derecha */}
            <button className="carrusel-flecha derecha">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          
          {/* Puntos de paginación */}
          <div className="carrusel-paginacion">
            <span className="punto activo"></span>
            <span className="punto"></span>
            <span className="punto"></span>
          </div>
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
                 <rect x="6" y="8" width="20" height="18" rx="2" stroke="#407060" strokeWidth="1.5"/>
                 <path d="M11 14L15 18L21 12" stroke="#407060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* SECCIÓN 3: TE PODRÍA INTERESAR */}
      <div className="te-podria-interesar">
        <h2 className="te-podria-titulo">Te podría interesar</h2>
        <div className="te-podria-grilla">
          
          {/* Tarjeta 1 */}
          <div className="tarjeta-interes">
            <img src="/img/Post 01.png" alt="Objetos que quitan el frío" className="tarjeta-interes-img" />
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Objetos que quitan el frío</h3>
              <p className="tarjeta-interes-autor">Monserrat Mella</p>
            </div>
          </div>
          
          {/* Tarjeta 2 */}
          <div className="tarjeta-interes">
            <img src="/img/domingo_2.png" alt="Sábanas" className="tarjeta-interes-img" />
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Sábanas</h3>
              <p className="tarjeta-interes-autor">Violeta Capasso</p>
            </div>
          </div>
          
          {/* Tarjeta 3 */}
          <div className="tarjeta-interes">
            <img src="/img/domingo.jpg" alt="Domingo" className="tarjeta-interes-img" />
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Domingo</h3>
              <p className="tarjeta-interes-autor">Monserrat Mella</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}