import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ carrito, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Mantenemos tu contador del carrito
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  // Transformamos el array para que los nombres coincidan 100% con Figma
  const links = [
    { path: '/', label: 'Home' },
    { path: '/tienda', label: 'Tienda' },
    { path: '/portafolio', label: 'Portafolio' },
    { path: '/imprimir', label: '¡Quiero Imprimir!' },
    { path: '/talleres', label: 'Talleres' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/eventos', label: 'Eventos' },
    { path: '/contacto', label: 'Contáctanos' }
  ];

  return (
    <nav className="navbar">
       {/* 1. LOGO IZQUIERDA */}
       <Link to="/" className="navbar-logo">
         <img src="/img/Logo.svg" alt="Iconbototos Logo" />
       </Link>

       {/* 2. GRUPO DERECHA: Login, Buscar, Carrito y Menú */}
       <div className="navbar-actions" style={{ position: 'relative' }}>
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

         <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="navbar-icon-btn" 
            style={{ backgroundColor: menuOpen ? 'var(--color-gris-claro)' : 'transparent' }}
         >
          <img src="/img/MenúHamburguesa.svg" alt="Menú" />
         </button>

         {/* 3. MENÚ DESPLEGABLE */}
         {menuOpen && (
           <div className="navbar-dropdown">
             {links.map(link => (
               <Link 
                 key={link.path} 
                 to={link.path} 
                 onClick={() => setMenuOpen(false)} 
                 className="dropdown-link"
               >
                 {link.label}
               </Link>
             ))}
           </div>
         )}
       </div>
    </nav>
  );
}