import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Tienda() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <main style={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}>
        <div className="tienda-layout" style={{ backgroundColor: '#FFFFFF', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px', color: '#121212' }}>Cargando Catálogo...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}