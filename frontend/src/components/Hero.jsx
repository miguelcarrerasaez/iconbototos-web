import React, { useState, useEffect, useMemo } from 'react';
import './Hero.css';

const ColumnaAnimada = ({ todasLasImagenes }) => {
  const [indice, setIndice] = useState(Math.floor(Math.random() * todasLasImagenes.length));
  const [tiempoSiguiente, setTiempoSiguiente] = useState(1000);

  useEffect(() => {
    const ritmos = [800, 1200, 1500, 2000];
    
    const cambiarImagen = () => {
      setIndice(Math.floor(Math.random() * todasLasImagenes.length));
      const nuevoRitmo = ritmos[Math.floor(Math.random() * ritmos.length)];
      setTiempoSiguiente(nuevoRitmo);
    };

    const timer = setTimeout(cambiarImagen, tiempoSiguiente);
    return () => clearTimeout(timer);
  }, [indice, tiempoSiguiente, todasLasImagenes.length]);

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