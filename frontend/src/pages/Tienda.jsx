import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TarjetaProducto from '../components/TarjetaProducto';
import './Tienda.css';

const productos = [
  {
    id: 1,
    titulo: 'Domingo',
    precio: '$12.000',
    imagen: '/img/domingo.jpg'
  },
  {
    id: 2,
    titulo: 'Sábanas',
    precio: '$12.000',
    imagen: '/img/sabanas.jpg'
  },
  {
    id: 3,
    titulo: 'Hay Flores que crecen sobre...',
    precio: '$12.000',
    imagen: '/img/hayflores.jpg'
  },
  {
    id: 4,
    titulo: 'Tronco',
    precio: '$12.000',
    imagen: '/img/tronco.jpg'
  },
  {
    id: 5,
    titulo: 'Lento',
    precio: '$12.000',
    imagen: '/img/lento.png'
  },
  {
    id: 6,
    titulo: 'Flores',
    precio: '$12.000',
    imagen: '/img/flores.jpg'
  }
];

export default function Tienda() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <main style={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}>
        <div className="tienda-layout" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="tienda-grid">
            {productos.map(producto => (
              <TarjetaProducto
                key={producto.id}
                imagen={producto.imagen}
                titulo={producto.titulo}
                precio={producto.precio}
                onClick={() => alert('Agregar al carrito: ' + producto.titulo)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}