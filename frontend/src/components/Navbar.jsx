import React from 'react';
import { Link } from 'react-router-dom'; 
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar({ carrito, setIsCartOpen }) {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 40px', 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #111', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50
    }}>
       
       {/* 1. LOGO GRÁFICO / LINK AL HOME */}
       <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
         <img 
           src="/img/logo_iconbototos.png" 
           alt="Iconbototos Logo" 
           style={{ height: '45px', objectFit: 'contain', transition: 'transform 0.2s' }} 
           onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
           onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
         />
       </Link>

       {/* 2. LINKS CENTRALES */}
       <div style={{ display: 'flex', gap: '25px' }}>
         {['nosotros', 'tienda', 'eventos', 'imprimir', 'portafolio', 'talleres', 'contacto'].map(ruta => (
           <Link key={ruta} to={`/${ruta}`} style={{
             textDecoration: 'none', 
             color: '#ff48b0', 
             fontWeight: 'bold',
             textTransform: 'capitalize', 
             fontFamily: "'Arimo', sans-serif", 
             fontSize: '16px',
             transition: 'transform 0.2s'
           }}
           onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
           onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
           >
             {ruta}
           </Link>
         ))}
       </div>

       {/* 3. ICONOS DERECHA */}
       <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
         
         <Link to="/admin" style={{ color: '#111', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff48b0'} onMouseLeave={(e) => e.target.style.color = '#111'}>
           <User size={24} />
         </Link>

         <button 
           onClick={() => setIsCartOpen(true)} 
           style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', position: 'relative', transition: 'color 0.2s' }}
           onMouseEnter={(e) => e.currentTarget.style.color = '#ff48b0'} 
           onMouseLeave={(e) => e.currentTarget.style.color = '#111'}
         >
           <ShoppingCart size={24} />
           
           {totalItems > 0 && (
             <span style={{
               position: 'absolute', top: '-8px', right: '-8px',
               backgroundColor: '#ff48b0', color: 'white', borderRadius: '50%',
               width: '20px', height: '20px', fontSize: '12px', display: 'flex',
               justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
             }}>
               {totalItems}
             </span>
           )}
         </button>
       </div>
    </nav>
  );
}