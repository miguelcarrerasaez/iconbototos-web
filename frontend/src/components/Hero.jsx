import React, { useState, useEffect, useMemo } from 'react';
import './Hero.css';

// Componente individual para cada columna
const ColumnaAnimada = ({ todasLasImagenes, indiceInicial, ritmo }) => {
  const [indice, setIndice] = useState(indiceInicial);

  useEffect(() => {
    // El intervalo "latido" que mantiene la columna cambiando para siempre
    const intervalo = setInterval(() => {
      setIndice((prevIndice) => {
        let nuevoIndice;
        // Obligamos a que la nueva imagen elegida al azar NUNCA sea igual a la anterior
        do {
          nuevoIndice = Math.floor(Math.random() * todasLasImagenes.length);
        } while (nuevoIndice === prevIndice);
        
        return nuevoIndice;
      });
    }, ritmo);

    return () => clearInterval(intervalo);
  }, [todasLasImagenes.length, ritmo]);

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

  // Generamos 3 índices iniciales distintos matemáticamente separados
  // para asegurar que las 3 columnas arranquen con fotos diferentes
  const inicial1 = 0; 
  const inicial2 = 4;
  const inicial3 = 8;

  return (
    <section className="hero-seccion">
      {/* 
        Restauramos el hero-grid que envuelve las columnas 
        para que mantengan su forma de 3 bloques perfectos 
      */}
      <div className="hero-grid">
        <ColumnaAnimada 
          todasLasImagenes={listaCompleta} 
          indiceInicial={inicial1} 
          ritmo={2500} /* Cambia cada 2.5 segundos */
        />
        <ColumnaAnimada 
          todasLasImagenes={listaCompleta} 
          indiceInicial={inicial2} 
          ritmo={3200} /* Cambia cada 3.2 segundos (desfasado) */
        />
        <ColumnaAnimada 
          todasLasImagenes={listaCompleta} 
          indiceInicial={inicial3} 
          ritmo={2800} /* Cambia cada 2.8 segundos (desfasado) */
        />
      </div>
    </section>
  );
}