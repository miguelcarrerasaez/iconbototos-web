import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ carrito, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const links = ['nosotros', 'tienda', 'eventos', 'imprimir', 'portafolio', 'talleres', 'contacto'];

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      height: '71px', padding: '10px 10px', backgroundColor: '#ffffff',
      gap: '80px', maxWidth: '880px', margin: '0 auto', width: '100%',
      position: 'sticky', top: 0, zIndex: 100,
      fontFamily: "'Montserrat', sans-serif"
    }}>
       {/* 1. LOGO IZQUIERDA */}
       <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
         <img src="/img/Logo.svg" alt="Iconbototos Logo" style={{ height: '40px' }} />
       </Link>

       {/* 2. GRUPO DERECHA: Login, Buscar, Carrito y Menú */}
       <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
         <Link to="/admin" style={{ display: 'flex', alignItems: 'center' }}>
           <img src="/img/MenúCuenta.svg" alt="Cuenta" style={{ width: '40px', height: '40px' }} />
         </Link>

         <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
           <img src="/img/MenúBuscar.svg" alt="Buscar" style={{ width: '40px', height: '40px' }} />
         </button>

         <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
           <img src="/img/MenúCarrito.svg" alt="Carrito" style={{ width: '40px', height: '40px' }} />
           {totalItems > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '10px', background: '#ff48b0', color: 'white', borderRadius: '50%', padding: '2px 5px' }}>{totalItems}</span>}
         </button>

         <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
           <img src="/img/MenúHamburguesa.svg" alt="Menú" style={{ width: '40px', height: '40px' }} />
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