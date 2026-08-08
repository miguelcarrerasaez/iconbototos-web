import React from 'react';
import './Nosotros.css';

export default function Nosotros() {
  return (
    <section className="nosotros-seccion">
      {/* Contenedor padre: flex row, centrado, gap 60px, ancho 871px */}
      <div className="nosotros-contenedor">
        
        {/* Imagen izquierda: 470px x 481px */}
        <img 
          className="nosotros-imagen" 
          src="/img/90ad871dc63677999a8837f34bd5bba9801f9737.jpg" 
          alt="Nosotros Iconbototos" 
        />

        {/* Columna de texto derecha */}
        <div className="nosotros-texto">
          <p className="nosotros-parrafo">
            Somos una microeditorial y estudio de risografía de Rancagua, Chile. Actualmente imprimiendo desde Santiago.
          </p>
          <button className="nosotros-boton">Saber más</button>
        </div>

      </div>
    </section>
  );
}