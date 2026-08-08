import React from 'react';
import './Animacion.css';

export default function Animacion() {
  return (
    <section className="animacion-seccion">
      <video 
        className="animacion-imagen" 
        src="/img/video-hero.mp4"
        autoPlay 
        loop 
        muted 
        playsInline
      />
    </section>
  );
}