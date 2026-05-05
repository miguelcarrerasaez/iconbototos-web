import React, { useState, useEffect } from 'react';
import './Hero.css'; // Importamos la magia de la animación

export default function Hero() {
  // 1. Aquí pones las imágenes que quieres que se alternen
  // Deben estar guardadas en la carpeta public/img/
  const imagenesFondo = [
    '/img/hero-fanzine.jpg', // Tu foto original
    '/img/02.jpg',           // Foto 2 (asegúrate de que exista en tu carpeta)
    '/img/03.jpg'            // Foto 3 (asegúrate de que exista en tu carpeta)
  ];

  const [indiceActual, setIndiceActual] = useState(0);

  // 2. Temporizador: cambia la imagen cada 4 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % imagenesFondo.length);
    }, 4000); 

    return () => clearInterval(intervalo);
  }, [imagenesFondo.length]);

  return (
    <section className="hero-container">
      
      {/* 3. Renderizamos los fondos con animación */}
      {imagenesFondo.map((img, index) => (
        <div
          key={index}
          className={`hero-bg ${index === indiceActual ? 'activo' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      {/* 4. Tus textos exactos, flotando siempre por encima */}
      <div className="hero-content">
        <h1 style={{ fontSize: '4rem', marginBottom: '10px', textTransform: 'uppercase' }}>
          Iconbototos
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
          Fanzines, láminas y arte independiente directo a tus manos.
        </p>
      </div>

    </section>
  );
}