import React from 'react';
import { ShoppingCart } from 'lucide-react';

// 1. Recibimos setIsCartOpen
export default function Navbar({ carrito, setIsCartOpen }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #ccc' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>ICONBOTOTOS</div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: 'black' }}>Inicio</a>
        <a href="#catalogo" style={{ textDecoration: 'none', color: 'black' }}>Catálogo</a>
        
        {/* 2. Agregamos el onClick para abrir el panel */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ShoppingCart size={24} />
          <span>({carrito.length})</span>
        </button>
      </div>
    </nav>
  );
}