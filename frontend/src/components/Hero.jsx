import React, { useState, useEffect } from 'react';
import './Hero.css'; 

// 🛠️ SUB-COMPONENTE: Controla cada columna por separado
const ColumnaAnimada = ({ imagenes, tiempoIntervalo }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, tiempoIntervalo);
    
    return () => clearInterval(timer);
  }, [imagenes, tiempoIntervalo]);

  return (
    <div className="columna-animada">
      {imagenes.map((img, i) => (
        <div
          key={i}
          className={`img-bg ${i === indice ? 'activo' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  // 📸 BATERÍA DE IMÁGENES POR COLUMNA
  // Reemplaza estos nombres con los archivos reales que tengas en public/img/
  const imgsCol1 = ['/img/hero-fanzine.jpg', '/img/04.jpg', '/img/07.jpg'];
  const imgsCol2 = ['/img/02.jpg', '/img/05.jpg', '/img/08.jpg'];
  const imgsCol3 = ['/img/03.jpg', '/img/06.jpg', '/img/09.jpg'];

  return (
    <section className="hero-container">
      
      {/* --- EL FONDO DIVIDIDO EN 3 --- */}
      <div className="hero-grid-fondo">
        {/* Le damos tiempos distintos a cada una para que el cambio no sea simultáneo */}
        <ColumnaAnimada imagenes={imgsCol1} tiempoIntervalo={3500} />
        <ColumnaAnimada imagenes={imgsCol2} tiempoIntervalo={5000} />
        <ColumnaAnimada imagenes={imgsCol3} tiempoIntervalo={4000} />
      </div>

      {/* --- TUS TEXTOS FLOTANDO ENCIMA 
      <div className="hero-content">
        <h1 style={{ fontSize: '4rem', marginBottom: '10px', textTransform: 'uppercase' }}>
          Iconbototos
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto', fontWeight: '500' }}>
          Fanzines, láminas y arte independiente directo a tus manos.
        </p>
      </div>--- */}

    </section>
  );
}