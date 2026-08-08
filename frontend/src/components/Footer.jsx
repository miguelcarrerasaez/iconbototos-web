import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// SVG del icono de Instagram (32x32, stroke #121212)
const InstagramIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" rx="7" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="6.5" stroke="#121212" strokeWidth="1.5"/>
    <circle cx="22.5" cy="9.5" r="1.5" fill="#121212"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer-seccion">
      {/* Contenedor padre: flex column, centrado, padding 20px, ancho 1090px */}
      <div className="footer-contenedor">
        
        {/* Contenedor de columnas: flex row, gap 4px, ancho 817px */}
        <div className="footer-columnas">

          {/* Columna 1: Studio */}
          <div className="footer-col">
            <h3 className="footer-titulo-col">Studio</h3>
            <Link to="/imprimir" className="footer-enlace">¡Quiero imprimir!</Link>
            <Link to="/nosotros" className="footer-enlace">Nosotros</Link>
            <Link to="/tienda" className="footer-enlace">Tienda</Link>
          </div>

          {/* Columna 2: Ayuda */}
          <div className="footer-col">
            <h3 className="footer-titulo-col">Ayuda</h3>
            <Link to="/faq" className="footer-enlace">Preguntas frecuentes</Link>
            <Link to="/legal" className="footer-enlace">Legal</Link>
            <Link to="/devolucion" className="footer-enlace">Política de devolución</Link>
            <Link to="/terminos" className="footer-enlace">Términos y condiciones</Link>
          </div>

          {/* Columna 3: Social */}
          <div className="footer-col">
            <h3 className="footer-titulo-col">Social</h3>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <InstagramIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <InstagramIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
                <InstagramIcon />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}