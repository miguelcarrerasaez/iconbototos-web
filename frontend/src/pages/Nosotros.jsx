import React, { useEffect, useRef } from 'react';
import './Nosotros.css';

// Primera galería: imágenes del estudio (placeholders)
const galeriaEstudio = [
  { src: '/img/nosotros-1.png', alt: 'Nosotros - Imagen 1' },
  { src: '/img/nosotros-2.png', alt: 'Nosotros - Imagen 2' },
  { src: '/img/nosotros-3.png', alt: 'Nosotros - Imagen 3' },
  { src: '/img/nosotros-4.png', alt: 'Nosotros - Imagen 4' },
  { src: '/img/nosotros-5.png', alt: 'Nosotros - Imagen 5' }
];

// El equipo: retrato + nombre (negrita) + cargo (regular)
const equipo = [
  { src: '/img/equipo-1.png', alt: 'Monserrat Mella', nombre: 'Monserrat Mella', cargo: 'Diseñadora' },
  { src: '/img/equipo-2.png', alt: 'Mauro Lucero', nombre: 'Mauro Lucero', cargo: 'Editor' },
  { src: '/img/equipo-3.png', alt: 'Víctor Peralta', nombre: 'Víctor Peralta', cargo: 'Ejecución y taller' }
];

export default function Nosotros() {
  // Referencia para controlar la "pista" del carrusel
  const trackRef = useRef(null);

  // Efecto que mueve el carrusel automáticamente cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (trackRef.current) {
        const track = trackRef.current;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Si llegó al final, vuelve al inicio. Si no, avanza el ancho de una foto.
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const imageWidth = track.firstElementChild?.clientWidth || 0;
          track.scrollBy({ left: imageWidth + 15, behavior: 'smooth' }); // +15px del gap
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nosotros-layout">

      {/* SECCIÓN 1: TÍTULO Y PRIMERA GALERÍA (CARRUSEL) */}
      <section className="nosotros-intro">
        <h1 className="nosotros-titulo">Nosotros</h1>

        <div className="nosotros-carrusel">
          <div className="nosotros-carrusel-track" ref={trackRef}>
            {galeriaEstudio.map(img => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="nosotros-carrusel-img"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: PRIMER PÁRRAFO */}
      <section className="nosotros-bloque-texto">
        <p className="nosotros-parrafo">
          Iconbototos nace en Rancagua en 2014 como un proyecto editorial experimental,
          que se consolida en 2016 en el contexto universitario y evoluciona en 2021 hacia
          un estudio de risografía. Surge desde intereses artísticos y la necesidad de
          visibilizar y publicar a creadores locales, ampliando luego su alcance a Santiago
          y a otros países de Latinoamérica. Publica con el objetivo de generar registro del
          arte contemporáneo y explorar la impresión como un espacio de experimentación gráfica.
        </p>
      </section>

      {/* SECCIÓN 3: EL EQUIPO (RETRATOS) */}
      <section className="nosotros-equipo">
        <div className="equipo-grid">
          {equipo.map(persona => (
            <article key={persona.nombre} className="equipo-miembro">
              <img
                src={persona.src}
                alt={persona.alt}
                className="equipo-img"
              />
              <p className="equipo-nombre">{persona.nombre}</p>
              <p className="equipo-cargo">{persona.cargo}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SECCIÓN 4: SEGUNDO PÁRRAFO */}
      <section className="nosotros-bloque-texto">
        <p className="nosotros-parrafo">
          Iconbototos se vincula a la risografía como medio central de producción y exploración.
          Utiliza sus particularidades técnicas —registro, capas de color y error— como lenguaje
          propio, integrando la experimentación material en cada publicación y entendiendo la
          impresión como parte del proceso creativo.
        </p>
      </section>

    </div>
  );
}