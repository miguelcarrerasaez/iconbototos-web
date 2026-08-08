import React from 'react';
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
    titulo: 'Lento',
    precio: '$12.000',
    imagen: '/img/lento.png'
  },
  {
    id: 3,
    titulo: 'Fanzine Iconbototos',
    precio: '$8.000',
    imagen: '/img/fanzine_iconbototos.jpg'
  },
  {
    id: 4,
    titulo: 'Domingo (variante)',
    precio: '$12.000',
    imagen: '/img/domingo_2.png'
  },
  {
    id: 5,
    titulo: 'Hero Fanzine',
    precio: '$10.000',
    imagen: '/img/hero-fanzine.jpg'
  },
  {
    id: 6,
    titulo: 'Post 01',
    precio: '$5.000',
    imagen: '/img/Post 01.png'
  }
];

export default function Tienda() {
  return (
    <div className="tienda-layout">
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
  );
}
