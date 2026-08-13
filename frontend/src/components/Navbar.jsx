import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ carrito, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const links = ['nosotros', 'tienda', 'eventos', 'imprimir', 'portafolio', 'talleres', 'contacto'];

  return (
    <nav className="navbar">
       {/* 1. LOGO IZQUIERDA */}
       <Link to="/" className="navbar-logo">
         <img src="/img/Logo.svg" alt="Iconbototos Logo" />
       </Link>

       {/* 2. GRUPO DERECHA: Login, Buscar, Carrito y Menú */}
       <div className="navbar-actions">
         <Link to="/admin" className="navbar-icon-btn">
           <img src="/img/MenúCuenta.svg" alt="Cuenta" />
         </Link>

         <button className="navbar-icon-btn">
           <img src="/img/MenúBuscar.svg" alt="Buscar" />
         </button>

         <button onClick={() => setIsCartOpen(true)} className="navbar-icon-btn">
           <img src="/img/MenúCarrito.svg" alt="Carrito" />
           {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
         </button>

         <button onClick={() => setMenuOpen(!menuOpen)} className="navbar-icon-btn">
           <img src="/img/MenúHamburguesa.svg" alt="Menú" />
         </button>
       </div>

       {/* 3. MENÚ DESPLEGABLE */}
       {menuOpen && (
         <div className="navbar-dropdown">
           {links.map(ruta => (
             <Link key={ruta} to={`/${ruta}`} onClick={() => setMenuOpen(false)} className="dropdown-link">
               {ruta}
             </Link>
           ))}
         </div>
       )}
    </nav>
  );
}