import React, { useState } from 'react';
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

       {/* 2. BOTÓN HAMBURGUESA */}
       <button 
        onClick={() => setMenuOpen(!menuOpen)} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 101 }}
       >
         {menuOpen ? <X size={32} /> : <Menu size={32} />}
       </button>

       {/* 3. MENU OVERLAY (El menú hamburguesa desplegado) */}
       {menuOpen && (
         <div style={{
           position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
           backgroundColor: '#f4f0e6', display: 'flex', flexDirection: 'column',
           justifyContent: 'center', alignItems: 'center', gap: '30px', zIndex: 99
         }}>
           {links.map(ruta => (
             <Link key={ruta} to={`/${ruta}`} onClick={() => setMenuOpen(false)} style={{
               textDecoration: 'none', color: '#111', fontWeight: '900',
               fontSize: '2rem', textTransform: 'uppercase', fontFamily: "'Arimo', sans-serif"
             }}>
               {ruta}
             </Link>
           ))}
           
           {/* Iconos de Login y Carrito dentro del menú */}
           <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
              <Link to="/admin" onClick={() => setMenuOpen(false)}><User size={32} /></Link>
              <button onClick={() => { setIsCartOpen(true); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ShoppingCart size={32} />
                {totalItems > 0 && <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>({totalItems})</span>}
              </button>
           </div>
         </div>
       )}
    </nav>
  );
}