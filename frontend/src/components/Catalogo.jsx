import React from 'react';

// 1. Nuestra "Base de datos" local (más adelante puede venir de un archivo o base real)
const productos = [
  {
    id: 1,
    titulo: 'Lámina Azul',
    precio: 5000,
    imagen: '/img/lamina-azul.jpg',
  },
  {
    id: 2,
    titulo: 'Lámina Sombra',
    precio: 5000,
    imagen: '/img/lamina-sombra.jpg',
  },
  {
    id: 3,
    titulo: 'Lámina Tendedero',
    precio: 6000,
    imagen: '/img/lamina-tendedero.jpg',
  }
];

export default function Catalogo() {
  return (
    <section id="catalogo" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestro Catálogo</h2>
      
      {/* Grilla de productos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* 2. Aquí React "mapea" (recorre) la lista y crea una tarjeta por cada producto */}
        {productos.map((producto) => (
          <div key={producto.id} style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <img 
              src={producto.imagen} 
              alt={producto.titulo} 
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' }} 
            />
            <h3 style={{ margin: '15px 0 5px 0' }}>{producto.titulo}</h3>
            <p style={{ fontWeight: 'bold', color: '#333' }}>${producto.precio}</p>
            <button style={{ 
              marginTop: '10px', 
              padding: '10px 15px', 
              backgroundColor: 'black', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}>
              Agregar al carrito
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}