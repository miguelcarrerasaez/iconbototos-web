import React, { useState, useEffect, useMemo } from 'react';
import './Hero.css';

const ColumnaAnimada = ({ todasLasImagenes }) => {
  const [indice, setIndice] = useState(Math.floor(Math.random() * todasLasImagenes.length));
  const [tiempoSiguiente, setTiempoSiguiente] = useState(1000);

  useEffect(() => {
    const ritmos = [100, 200, 500, 1000, 2000, 3000, 150, 800];
    
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