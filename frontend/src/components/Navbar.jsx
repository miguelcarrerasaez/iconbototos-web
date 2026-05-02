import React from 'react';
import { ShoppingCart, User } from 'lucide-react'; // Sumamos el icono de Usuario
import { useNavigate } from 'react-router-dom';

export default function Navbar({ carrito, setIsCartOpen }) {
  const navigate = useNavigate();
  // Calculamos cuántos ítems hay en total
  const totalArticulos = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'white', borderBottom: '2px solid #111', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* Logo tipográfico fuerte estilo Risotto */}
      <h2 
        onClick={() => navigate('/')} 
        style={{ margin: 0, cursor: 'pointer', fontWeight: '900', letterSpacing: '1px', fontSize: '1.8rem', textTransform: 'uppercase' }}
      >
        Iconbototos
      </h2>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        {/* Botón oculto a simple vista para el Admin */}
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }} title="Acceso Admin">
          <User size={26} strokeWidth={2.5} />
        </button>
        
        {/* Botón del Carrito */}
        <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#111' }}>
          <ShoppingCart size={26} strokeWidth={2.5} />
          {totalArticulos > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {totalArticulos}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}