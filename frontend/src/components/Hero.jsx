import React from 'react';

export default function Hero() {
  return (
    <section style={{ 
      padding: '120px 20px', 
      textAlign: 'center', 
      // Usamos tu imagen real como fondo
      backgroundImage: 'url(/img/hero-fanzine.jpg)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white', // Texto blanco para que resalte
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // Sombra para que se lea perfecto sobre la foto
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '10px', textTransform: 'uppercase' }}>
        Iconbototos
      </h1>
      <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
        Fanzines, láminas y arte independiente directo a tus manos.
      </p>
    </section>
  );
}