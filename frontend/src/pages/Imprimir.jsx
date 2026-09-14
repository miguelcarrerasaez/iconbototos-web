import React from 'react';
import './Imprimir.css';

export default function Imprimir() {
  return (
    <div className="imprimir-page">
      
      {/* SECCIÓN 1: TINTAS */}
      <section className="seccion-tintas">
        <div className="imprimir-container">
          
          <div className="tintas-header">
            <h1 className="titulo-editorial">
              <span className="font-light">Nuestras</span><br />
              <strong>Tintas</strong>
            </h1>
            <p className="texto-descriptivo">
              Todas las tintas son translúcidas, por lo que al sobreponer las capas de tinta se crean otras capas nuevas. Por ejemplo si imprimimos rojo y azul, podemos generar un morado.
            </p>
          </div>

          <div className="tintas-grid">
            <div className="tinta-card">
              <div className="color-box" style={{ backgroundColor: '#F15060' }}></div>
              <div className="color-info">
                <span className="color-name">Bright Red</span>
                <span className="color-hex">#F15060</span>
              </div>
            </div>
            
            <div className="tinta-card">
              <div className="color-box" style={{ backgroundColor: '#0078BF' }}></div>
              <div className="color-info">
                <span className="color-name">Blue</span>
                <span className="color-hex">#0078BF</span>
              </div>
            </div>

            <div className="tinta-card">
              <div className="color-box" style={{ backgroundColor: '#000000' }}></div>
              <div className="color-info">
                <span className="color-name">Black</span>
                <span className="color-hex">#000000</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 2: CÓMO IMPRIMIMOS */}
      <section className="seccion-como">
        <div className="imprimir-container">
          
          <h2 className="titulo-editorial">
            <span className="font-light">Cómo</span><br />
            <strong>Imprimimos</strong>
          </h2>

          {/* Aquí ya no hay tarjetas blancas, solo texto sobre el fondo */}
          <div className="como-grid">
            <div className="como-item">
              <h3>FORMATOS</h3>
              <p>El tamaño máximo que imprimimos es de 29,7 cm x 42 cm (Tamaño A3) con un área de impresión máxima de 28,7 cm x 41 cm (por tanto siempre quedarán al menos 5 mm de margen por cada lado de la hoja). Es importante evitar la sobrecarga de tinta en los bordes de la imagen que estén próximos a los márgenes.</p>
            </div>
            <div className="como-item">
              <h3>COLOR</h3>
              <p>¡Las tintas riso son transparentes! Es importante que lo sepas al momento de diseñar, ya que al sobreponer tintas se crearán colores nuevos. También es importante que uses las tintas solo al 80 o 90% de opacidad en las zonas de tu diseño donde hay grandes áreas de color.</p>
            </div>
            <div className="como-item">
              <h3>TEXTOS</h3>
              <p>El tamaño mínimo para las fuentes es de 6 pt. En este caso el color del texto debe ser necesariamente negro.</p>
            </div>
            <div className="como-item">
              <h3>PAPEL</h3>
              <p>Imprimimos solo en papel no estucado, en un rango de 80 a 250 grs. Consulta por la carta de disponibilidad de papeles.</p>
            </div>
            <div className="como-item">
              <h3>ARCHIVO</h3>
              <p>Envía un archivo PDF acoplado en escala de grises por cada capa de color. Se aceptan archivos PSD con capas de color para el formato A3. Resolución mínima de 300 ppi. Incluye una vista previa de referencia de color (se admite RGB o CMYK).</p>
            </div>
            <div className="como-item">
              <h3>TIRAJE</h3>
              <p>El tiraje mínimo es de 30 copias. Cada copia se imprime mediante una matriz (stencil). Debes saber que es normal que se produzcan ligeros desplazamientos, variaciones de textura y marcas de los rodillos.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 3: CTA */}
      <section className="seccion-cta">
        <div className="imprimir-container cta-container">
          <h2>¿Tienes algún proyecto en mente?<br/>¡Imprimamos juntos!</h2>
          <button className="btn-magenta">Contáctanos</button>
        </div>
      </section>

    </div>
  );
}