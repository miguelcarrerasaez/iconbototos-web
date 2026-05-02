import React from 'react';
import { ShoppingCart } from 'lucide-react'; // Aquí usamos la librería de íconos que instalaste

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #ccc' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>ICONBOTOTOS</div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: 'black' }}>Inicio</a>
        <a href="#catalogo" style={{ textDecoration: 'none', color: 'black' }}>Catálogo</a>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShoppingCart size={24} />
          <span>(0)</span>
        </button>
      </div>
    </nav>
  );
}