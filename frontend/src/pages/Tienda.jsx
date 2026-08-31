import React from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import './Tienda.css';

const productos = [
  { id: 1, titulo: 'DOMINGO', precio: '$12.000', imagen: '/img/domingo.png' },
  { id: 2, titulo: 'HAY FLORES QUE CRECEN SOBRE BICICLETAS FANTASMA', precio: '$12.000', imagen: '/img/hay_flores.png' },
  { id: 3, titulo: 'SÁBANAS', precio: '$12.000', imagen: '/img/sabanas.png' },
  { id: 4, titulo: 'AL CAJÓN DE LOS JUGUETES', precio: '$12.000', imagen: '/img/al_cajon_1.jpg' },
  { id: 5, titulo: 'QUIZÁS LAS FOTOS SON UNA MALDICIÓN Y NO DEBERÍA FOTOGRAFIAR EN NOMBRE DEL AMOR', precio: '$10.000', imagen: '/img/quizas.png' },
  { id: 6, titulo: 'LENTO', precio: '$12.000', imagen: '/img/lento.png' },
  { id: 7, titulo: 'OBJETOS QUE QUITAN EL FRÍO', precio: '$12.000', imagen: '/img/objetos.png' },
  { id: 8, titulo: 'PRINT FLORES AZULES', precio: '$12.000', imagen: '/img/print_flo.png' },
  { id: 9, titulo: 'PRINT NIÑA DE LAS FLORES', precio: '$12.000', imagen: '/img/print_sara.jpg' },
  { id: 10, titulo: 'PRINT SIMÓN', precio: '$12.000', imagen: '/img/domingo_2.png' },
  { id: 11, titulo: 'PRINT TRONCO', precio: '$12.000', imagen: '/img/print_tronco.png' },
];

export default function Tienda() {
  const navigate = useNavigate();

  return (
    <div className="tienda-layout">
      <div className="tienda-grid">
        {productos.map(producto => (
          <TarjetaProducto
            key={producto.id}
            imagen={producto.imagen}
            titulo={producto.titulo}
            precio={producto.precio}
            // En lugar de una alerta, ahora navegamos a la ruta del producto
            onClick={() => navigate(`/tienda/${producto.id}`)}
          />
        ))}
      </div>
    </div>
  );
}