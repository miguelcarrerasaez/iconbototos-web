import React from 'react';
import { Link } from 'react-router-dom';
import './Imprimir.css';

// Colores de tinta disponibles (cuadro de color + nombre + código HEX)
const tintas = [
  { hex: '#F15060', nombre: 'Bright Red', codigo: '#F15060' },
  { hex: '#0078BF', nombre: 'Blue', codigo: '#0078BF' },
  { hex: '#000000', nombre: 'Black', codigo: '#000000' }
];

// Bloques explicativos de "Cómo Imprimimos" (texto Lorem Ipsum provisional)
const bloquesComoImprimimos = [
  {
    titulo: 'FORMATOS',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    titulo: 'COLOR',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    titulo: 'TEXTOS',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  {
    titulo: 'PAPEL',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    titulo: 'ARCHIVO',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
  },
  {
    titulo: 'TIRAJE',
    texto:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
];

export default function Imprimir() {
  return (
    <div className="imprimir-layout">

      {/* SECCIÓN 1: NUESTRAS TINTAS */}
      <section className="imprimir-tintas">
        <div className="tintas-header">
          <h1 className="tintas-titulo">Nuestras Tintas</h1>
          <p className="tintas-descripcion">
            Nuestras tintas son translúcidas y se pueden mezclar entre sí para crear
            capas, tonos y texturas únicas en cada impresión. Cada color aplicado sobre
            otro se transforma, dando resultados siempre distintos e irrepetibles.
          </p>
        </div>

        <div className="tintas-grid">
          {tintas.map(tinta => (
            <div key={tinta.hex} className="tinta-tarjeta">
              <div
                className="tinta-cuadro"
                style={{ backgroundColor: tinta.hex }}
                aria-label={`Color de tinta ${tinta.nombre}`}
              ></div>
              <p className="tinta-nombre">
                {tinta.nombre} {tinta.codigo}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: CÓMO IMPRIMIMOS */}
      <section className="imprimir-como">
        <h2 className="como-titulo">Cómo Imprimimos</h2>

        <div className="como-grid">
          {bloquesComoImprimimos.map(bloque => (
            <article key={bloque.titulo} className="como-bloque">
              <h3 className="como-bloque-titulo">{bloque.titulo}</h3>
              <p className="como-bloque-texto">{bloque.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: CALL TO ACTION */}
      <section className="imprimir-cta">
        <h2 className="cta-titulo">¿Tienes algún proyecto en mente? ¡Imprimamos juntos!</h2>
        <Link to="/contacto" className="cta-boton">Contáctanos</Link>
      </section>

    </div>
  );
}