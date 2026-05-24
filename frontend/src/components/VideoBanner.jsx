{/*import React from 'react';

export default function VideoBanner() {
  return (
    <section 
      style={{ 
        width: '100%', 
        borderTop: '3px solid #111',    // Bordes gruesos estilo brutalista
        borderBottom: '3px solid #111', 
        backgroundColor: '#e6f7ff',     // Un color de fondo por si el video tarda en cargar
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <video 
        src="/img/video_banner.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ 
          width: '100%', 
          maxHeight: '70vh',    // Evita que el video ocupe toda la pantalla en monitores gigantes
          objectFit: 'cover',   // Hace que el video se comporte como un banner recortando los bordes si es necesario
          display: 'block' 
        }} 
      />
    </section>
  );
}  