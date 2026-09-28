import React, { useState, useEffect } from 'react';
import TarjetaProducto from '../components/TarjetaProducto';
import './Tienda.css';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Llamamos a tu servidor real en Render
    fetch('https://iconbototos-api.onrender.com/api/productos')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setProductos(datos); // 2. Guardamos los productos reales
        setCargando(false);
      })
      .catch(error => {
        console.error("Error cargando el catálogo:", error);
        setCargando(false);
      });
  }, []);

  // Pantalla de carga mientras trae los datos de Render
  if (cargando) {
    return (
      <div className="tienda-layout" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Cargando catálogo...</h2>
      </div>
    );
  }

  return (
    <div className="tienda-layout">
      <div className="tienda-grid">
        {productos.map(producto => (
          <TarjetaProducto
            key={producto.id}
            producto={producto} 
          />
        ))}
      </div>
    </div>
  );
}