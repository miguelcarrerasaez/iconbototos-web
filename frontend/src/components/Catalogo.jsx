import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Catalogo({ agregarAlCarrito }) {
  // 1. Ahora los productos son un Estado vacío que se llenará con lo que diga Python
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. useEffect hace el fetch a Python apenas carga el componente
  useEffect(() => {
    // IMPORTANTE: Asegúrate de que este sea el puerto donde corre tu Flask local (usualmente 5000)
    fetch('http://127.0.0.1:5000/api/productos') 
      .then(respuesta => respuesta.json())
      .then(data => {
        setProductos(data); // Guardamos los productos que mandó Python
        setCargando(false); // Apagamos el estado de carga
      })
      .catch(error => {
        console.error("Error al cargar el catálogo:", error);
        setCargando(false);
      });
  }, []);

  return (
    <section id="catalogo" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Nuestro Catálogo</h2>
      
      {/* 3. Mientras esperamos a Python, mostramos un mensaje de carga */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Cargando láminas... ⏳</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {productos.map((producto) => (
            <div key={producto.id} style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <img src={producto.imagen} alt={producto.titulo} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' }} />
              <h3 style={{ margin: '15px 0 5px 0' }}>{producto.titulo}</h3>
              <p style={{ fontWeight: 'bold', color: '#333' }}>${producto.precio}</p>
              
              <button 
                onClick={() => agregarAlCarrito(producto)}
                style={{ 
                  marginTop: '10px', padding: '10px 15px', backgroundColor: 'black', color: 'white', 
                  border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}>
                <ShoppingCart size={18} /> Agregar
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}