import React from 'react';
import './Categorias.css';

export default function Categorias() {
  return (
    <section className="categorias-seccion">
      {/* Contenedor padre: flex column, gap 15px, ancho 920px */}
      <div className="categorias-contenedor">
        
        {/* Texto superior */}
        <p className="categorias-titulo">Compra según la categoría</p>

        {/* Contenedor de ilustraciones: flex row, centrado, gap 10px */}
        <div className="categorias-grid">

          {/* Izquierda: Cafetera */}
          <div className="categorias-item">
            <img 
              className="categorias-img" 
              src="/img/cafetera.png" 
              alt="Cafetera" 
              style={{ width: '155.24px', height: '178.70px' }}
            />
          </div>

          {/* Centro: Fanzine con título "FANZINES" arriba */}
          <div className="categorias-item categorias-item-centro">
            <span className="categorias-label">FANZINES</span>
            <img 
              className="categorias-img" 
              src="/img/fanzine.png" 
              alt="Fanzine" 
              style={{ width: '287.11px', height: '321.04px' }}
            />
          </div>

          {/* Derecha: Uvas */}
          <div className="categorias-item">
            <img 
              className="categorias-img" 
              src="/img/uvas.png" 
              alt="Uvas" 
              style={{ width: '168.23px', height: '178.47px' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}