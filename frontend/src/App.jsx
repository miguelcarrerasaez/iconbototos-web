import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// --- COMPONENTES COMPARTIDOS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoContext';

// --- SECCIONES DE LA PÁGINA ---
import Hero from './components/Hero';
import Carrusel from './components/Carrusel';
import Animacion from './components/Animacion';
import Nosotros from './components/Nosotros';
import Categorias from './components/Categorias';
import Tienda from './pages/Tienda';
import DetalleProducto from './pages/DetalleProducto';
import Imprimir from './pages/Imprimir';
import PaginaNosotros from './pages/Nosotros';
import PaginaContacto from './pages/Contacto';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Toaster richColors position="bottom-right" />

      {/* Ocultamos la Navbar pública si estamos en el Panel de Admin */}
      {!esRutaAdmin && <Navbar />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* 1. HOME: Hero, Carrusel, Animación, Nosotros y Categorías */}
          <Route path="/" element={
            <>
              <Hero />
              <Carrusel />
              <Animacion />
              <Nosotros />
              <Categorias />
            </>
          } />

          {/* 2. TIENDA: Vista del catálogo */}
          <Route path="/tienda" element={<Tienda />} />

          {/* 3. TIENDA DETALLE: Vista individual del producto */}
          <Route path="/tienda/:id" element={<DetalleProducto />} />

          {/* 4. RUTAS EDITORIALES EN CONSTRUCCIÓN */}
          <Route path="/nosotros" element={<PaginaNosotros />} />
          <Route path="/eventos" element={<PaginaEnConstruccion titulo="Eventos" />} />
          <Route path="/imprimir" element={<Imprimir />} />
          <Route path="/portafolio" element={<PaginaEnConstruccion titulo="Portafolio" />} />
          <Route path="/talleres" element={<PaginaEnConstruccion titulo="Talleres" />} />
          <Route path="/contacto" element={<PaginaContacto />} />

          {/* 5. PANEL DE ADMINISTRACIÓN RISO */}
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>

      {/* Ocultamos Footer y Carrito en la zona de administración */}
      {!esRutaAdmin && (
        <>
          <Footer />
          <Carrito />
        </>
      )}
    </div>
  );
}

// Envolvemos todo en el Router y el provider de carrito para que la magia funcione
export default function App() {
  return (
    <Router>
      <CarritoProvider>
        <LayoutPrincipal />
      </CarritoProvider>
    </Router>
  );
}
