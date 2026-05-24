import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-seccion">
      
      {/* Contenedor principal que mantiene la forma y los bordes redondeados */}
      <div className="hero-grid">
        
        {/* 
          AQUÍ VA TU VIDEO 
          Asegúrate de guardar el video de Montserrat en tu carpeta "public/img/" 
          con el nombre "video-hero.mp4" (o cambia la ruta abajo)
        */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src="/img/video-hero.mp4" type="video/mp4" />
          
          {/* Fallback de Figma por si el video tarda en cargar */}
          <img 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            src="https://placehold.co/858x510" 
            alt="Iconbototos" 
          />
        </video>

      </div>

    </section>
  );
}