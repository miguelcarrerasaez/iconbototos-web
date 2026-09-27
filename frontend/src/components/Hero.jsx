import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  // Inicializamos la navegación
  const navigate = useNavigate();

  return (
    <section className="hero-seccion">
      {/* Contenedor padre: flex horizontal, centrado, gap 59px */}
      <div className="hero-contenedor">
        
        {/* Columna de texto: flex vertical, gap 36px, width 341px */}
        <div className="hero-texto">
          <h1 className="hero-titulo">RISO, MAGIA, ZINES</h1>
          <p className="hero-parrafo">
            Libros, prints y publicaciones en edición limitada realizados en risografía, en colaboración con artistas emergentes de todo el mundo.
          </p>
          {/* Botón conectado a la ruta /tienda */}
          <button className="hero-boton" onClick={() => navigate('/tienda')}>
            Comprar ahora
          </button>
        </div>

        {/* Imagen a la derecha */}
        <img 
          className="hero-imagen" 
          src="/img/hero-fanzine.jpg" 
          alt="Fanzine Iconbototos" 
        />

      </div>
    </section>
  );
}