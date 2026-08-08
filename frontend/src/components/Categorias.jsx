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

          {/* Izquierda: Tetera */}
          <div className="categorias-item">
            <img 
              className="categorias-img" 
              src="/img/tetera.png" 
              alt="Tetera" 
              style={{ width: '155.24px', height: '178.70px' }}
            />
          </div>

          {/* Centro: Fanzine con título "FANZINES" arriba */}
          <div className="categorias-item categorias-item-centro">
            <span className="categorias-label">FANZINES</span>
            <img 
              className="categorias-img" 
              src="/img/carta.png" 
              alt="Carta" 
              style={{ width: '287.11px', height: '321.04px' }}
            />
          </div>

          {/* Derecha: Uva */}
          <div className="categorias-item">
            <img 
              className="categorias-img" 
              src="/img/uva.png" 
              alt="Uva" 
              style={{ width: '168.23px', height: '178.47px' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}