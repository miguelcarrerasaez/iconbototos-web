import React from 'react';
import { Link } from 'react-router-dom'; // 🪄 La nueva herramienta de navegación
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar({ carrito, setIsCartOpen }) {
  // Calculamos cuántos productos hay en total en el carrito
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '20px 40px', 
      backgroundColor: '#ffffff', // Fondo blanco puro para contraste total
      borderBottom: '1px solid #111', // Borde sutil inferior
      position: 'sticky', 
      top: 0, 
      zIndex: 50
    }}>
       
       {/* 1. LOGO / LINK AL HOME */}
       <Link to="/" style={{ 
         textDecoration: 'none', 
         color: '#ff48b0', 
         fontWeight: 'bold', 
         fontSize: '24px', 
         fontFamily: "'Arimo', sans-serif" 
       }}>
         ICONBOTOTOS
       </Link>

       {/* 2. LINKS CENTRALES (Tipografía Arimo Bold en Rosa Flúor) */}
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

       {/* 3. ICONOS DERECHA (Negro Sólido) */}
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
           
           {/* La burbuja con el número de items flotando sobre el carrito */}
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