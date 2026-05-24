import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export default function Navbar({ carrito, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const links = ['nosotros', 'tienda', 'eventos', 'imprimir', 'portafolio', 'talleres', 'contacto'];

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 40px', backgroundColor: '#ffffff', borderBottom: '2px solid #111',
      position: 'sticky', top: 0, zIndex: 100
    }}>
       {/* 1. LOGO IZQUIERDA */}
       <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
         <img src="/img/logo_iconbototos.png" alt="Iconbototos Logo" style={{ height: '40px' }} />
       </Link>

       {/* 2. GRUPO DERECHA: Login, Carrito y Menú */}
       <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
         <Link to="/admin" style={{ color: '#111' }}><User size={24} /></Link>
         
         <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
           <ShoppingCart size={24} />
           {totalItems > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '10px', background: '#ff48b0', color: 'white', borderRadius: '50%', padding: '2px 5px' }}>{totalItems}</span>}
         </button>

         <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
           {menuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
       </div>

       {/* 3. MENÚ DESPLEGABLE (Cuadrado pequeño hacia abajo) */}
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