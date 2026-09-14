import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ carrito, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
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

       {/* 2. GRUPO DERECHA */}
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

         {/* 3. BURBUJA DEL MENÚ HAMBURGUESA (FORZADA CON ESTILOS EN LÍNEA) */}
         <div style={{ position: 'relative', display: 'flex', height: '40px' }}>
           <button 
             onClick={() => setMenuOpen(!menuOpen)} 
             className="navbar-icon-btn"
             style={{ 
               backgroundColor: menuOpen ? 'var(--color-gris-claro)' : 'transparent',
               height: '40px',
               padding: 0,
               border: 'none',
               display: 'flex'
             }}
           >
             <img src="/img/MenúHamburguesa.svg" alt="Menú" style={{ display: 'block', height: '40px' }} />
           </button>

           {/* MENÚ DESPLEGABLE */}
           {menuOpen && (
             <div 
               className="navbar-dropdown"
               style={{ 
                 top: '40px', /* Forzamos la posición exacta ignorando el CSS externo */
                 marginTop: '0px',
                 right: '0px'
               }}
             >
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
       </div>
</nav>
  );
}