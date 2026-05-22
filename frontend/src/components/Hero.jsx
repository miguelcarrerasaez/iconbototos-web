import React, { useState, useEffect, useMemo } from 'react';
import './Hero.css';

const ColumnaAnimada = ({ todasLasImagenes }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Definimos el intervalo de tiempo (2.5 segundos es un ritmo editorial elegante)
    const intervalo = setInterval(() => {
      setIndice((prevIndice) => (prevIndice + 1) % todasLasImagenes.length);
    }, 2500);

    // Limpiamos el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, [todasLasImagenes.length]);
  
  return (
    <div className="columna-contenedor">
      {todasLasImagenes.map((img, i) => (
        <div
          key={i}
          className={`img-item ${i === indice ? 'activo' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const listaCompleta = useMemo(() => [
    '/img/hero.1.jpg',
    '/img/hero.2.jpg',
    '/img/hero.3.jpg',
    '/img/hero.4.jpg',
    '/img/hero.5.jpg',
    '/img/hero.6.jpg',
    '/img/hero.7.jpg',
    '/img/hero.8.jpg',
    '/img/hero.9.jpg',
    '/img/hero.10.jpg',
    '/img/hero.11.jpg',
    '/img/hero.12.jpg',
    '/img/hero.13.jpg',
    '/img/hero.14.jpg',
  ], []);

  return (
    <section className="hero-seccion">
      <div className="hero-grid">
        <ColumnaAnimada todasLasImagenes={listaCompleta} />
        <ColumnaAnimada todasLasImagenes={listaCompleta} />
        <ColumnaAnimada todasLasImagenes={listaCompleta} />
      </div>
{/*
      <div className="hero-texto-overlay">
        <h1>Iconbototos</h1>
        <p>ARTE INDEPENDIENTE • RISO ART • FANZINES</p>
      </div> */}
    </section>
  );
}