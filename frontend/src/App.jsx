import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// --- COMPONENTES COMPARTIDOS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Carrito from './components/Carrito';

// --- SECCIONES DE LA PÁGINA ---
import Hero from './components/Hero';
import Carrusel from './components/Carrusel';
import Animacion from './components/Animacion';
import Nosotros from './components/Nosotros';
import Categorias from './components/Categorias';
import Catalogo from './components/Catalogo';
import Admin from './pages/Admin';

// --- COMPONENTE TEMPORAL PARA PÁGINAS EN CONSTRUCCIÓN ---
const PaginaEnConstruccion = ({ titulo }) => (
  <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', backgroundColor: 'var(--color-fondo)' }}>
    <h1 style={{ color: '#ff48b0', textTransform: 'uppercase', fontSize: '3rem', margin: 0 }}>{titulo}</h1>
    <p style={{ fontSize: '1.2rem', marginTop: '20px', color: 'var(--color-texto)' }}>
      Estamos preparando esta sección editorial para ti. 🚧
    </p>
  </div>
);

// --- ESTRUCTURA PRINCIPAL QUE VIGILA LAS RUTAS ---
function LayoutPrincipal() {
  // Leemos en qué URL estamos parados
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith('/admin');

  // 🛒 EL ESTADO DEL CARRITO AHORA VIVE AQUÍ (Memoria global)
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    const cantidadActual = productoExistente ? productoExistente.cantidad : 0;

    if (cantidadActual >= producto.stock) {
      toast.error(`¡Ups! Solo quedan ${producto.stock} unidades de ${producto.titulo}`);
      return; 
    }

    if (productoExistente) {
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
      toast.success(`Se agregó otra unidad de ${producto.titulo}`);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      toast.success(`${producto.titulo} agregado al carrito 🛒`);
    }
  };

  const quitarDelCarrito = (productoId) => {
    const productoExistente = carrito.find(item => item.id === productoId);
    if (productoExistente.cantidad === 1) {
      setCarrito(carrito.filter(item => item.id !== productoId));
      toast.info('Producto eliminado del carrito');
    } else {
      setCarrito(carrito.map(item => item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Toaster richColors position="bottom-right" />
      
      {/* Ocultamos la Navbar pública si estamos en el Panel de Admin */}
      {!esRutaAdmin && <Navbar carrito={carrito} setIsCartOpen={setIsCartOpen} />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* 1. HOME: Hero, Carrusel, Animación, Nosotros, Categorías y Footer */}
          <Route path="/" element={
            <>
              <Hero />
              <Carrusel />
              <Animacion />
              <Nosotros />
              <Categorias />
            </>
          } />

          {/* 2. TIENDA: Vista clásica estructurada en grilla */}
          <Route path="/tienda" element={
            <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
              <Catalogo agregarAlCarrito={agregarAlCarrito} /> 
            </div>
          } />

          {/* 3. RUTAS EDITORIALES EN CONSTRUCCIÓN */}
          <Route path="/nosotros" element={<PaginaEnConstruccion titulo="Nosotros" />} />
          <Route path="/eventos" element={<PaginaEnConstruccion titulo="Eventos" />} />
          <Route path="/imprimir" element={<PaginaEnConstruccion titulo="¡Imprimir!" />} />
          <Route path="/portafolio" element={<PaginaEnConstruccion titulo="Portafolio" />} />
          <Route path="/talleres" element={<PaginaEnConstruccion titulo="Talleres" />} />
          <Route path="/contacto" element={<PaginaEnConstruccion titulo="Contacto" />} />

          {/* 4. PANEL DE ADMINISTRACIÓN RISO */}
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>

      {/* Ocultamos Footer y Carrito en la zona de administración */}
      {!esRutaAdmin && (
        <>
          <Footer />
          <Carrito 
            carrito={carrito} 
            isCartOpen={isCartOpen} 
            setIsCartOpen={setIsCartOpen} 
            agregarAlCarrito={agregarAlCarrito} 
            quitarDelCarrito={quitarDelCarrito} 
          />
        </>
      )}
    </div>
  );
}

// Envolvemos todo en el Router para que la magia funcione
export default function App() {
  return (
    <Router>
      <LayoutPrincipal />
    </Router>
  );
}