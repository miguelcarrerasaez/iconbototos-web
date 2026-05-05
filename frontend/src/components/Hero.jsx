import React, { useState, useEffect, useMemo } from 'react';
import './Hero.css';

const ColumnaAnimada = ({ todasLasImagenes, ordenInicial }) => {
  const [indice, setIndice] = useState(ordenInicial);
  const [tiempoSiguiente, setTiempoSiguiente] = useState(1000);

  useEffect(() => {
    // Definimos una lista de tiempos para crear el efecto "atrapante"
    // Mezclamos tiempos largos, medios y ráfagas rápidas (milisegundos)
    const ritmos = [100, 200, 500, 1000, 2000, 3000, 150, 800];
    
    const cambiarImagen = () => {
      // 1. Cambiamos a una imagen aleatoria de la carpeta
      setIndice(Math.floor(Math.random() * todasLasImagenes.length));
      
      // 2. Elegimos un ritmo aleatorio de nuestra lista
      const nuevoRitmo = ritmos[Math.floor(Math.random() * ritmos.length)];
      setTiempoSiguiente(nuevoRitmo);
    };

    const timer = setTimeout(cambiarImagen, tiempoSiguiente);
    return () => clearTimeout(timer);
  }, [indice, tiempoSiguiente, todasLasImagenes.length]);

  return (
    <div className="columna-animada">
      {todasLasImagenes.map((img, i) => (
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
  // 📸 Lista de todas las imágenes en tu carpeta public/img
  // Agrega aquí todos los nombres de archivos que tengas
  const listaCompleta = useMemo(() => [
    '/img/hero-fanzine.jpg',
    '/img/01.jpg',
    '/img/02.jpg',
    '/img/03.jpg',
    '/img/04.jpg',
    '/img/05.jpg',
    '/img/06.jpg',
    '/img/07.jpg',
    '/img/08.jpg',
    '/img/09.jpg'
  ], []);

  return (
    <section className="hero-container">
      <div className="hero-grid-fondo">
        {/* Cada columna empieza en un punto diferente para variar el desorden */}
        <ColumnaAnimada todasLasImagenes={listaCompleta} ordenInicial={0} />
        <ColumnaAnimada todasLasImagenes={listaCompleta} ordenInicial={2} />
        <ColumnaAnimada todasLasImagenes={listaCompleta} ordenInicial={5} />
      </div>

      <div className="hero-content">
        <h1 style={{ fontSize: '4.5rem', marginBottom: '10px', textTransform: 'uppercase', lineHeight: '0.9' }}>
          Iconbototos
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto', fontWeight: 'bold', letterSpacing: '1px' }}>
          ARTE INDEPENDIENTE • RISO ART • FANZINES
        </p>
      </div>
    </section>
  );
}