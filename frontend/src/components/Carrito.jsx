import React, { useState } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react'; // Agregamos más íconos
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Tu Public Key de Mercado Pago
initMercadoPago('APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c', { locale: 'es-CL' });

// Recibimos las nuevas funciones desde App.jsx
export default function Carrito({ carrito, isCartOpen, setIsCartOpen, agregarAlCarrito, quitarDelCarrito }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [cargando, setCargando] = useState(false);

  if (!isCartOpen) return null;

  // Nuevo cálculo del Total: (Precio * Cantidad) de cada producto
  const total = carrito.reduce((suma, producto) => suma + (producto.precio * producto.cantidad), 0);

  // Calculamos la cantidad total de artículos para mostrar (ej: 3 láminas iguales cuentan como 3)
  const totalArticulos = carrito.reduce((suma, producto) => suma + producto.cantidad, 0);

  const manejarPago = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("https://iconbototos-web.onrender.com/crear_preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrito: carrito }),
      });

      const data = await respuesta.json();
      
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        console.error("Error: No se recibió ID de preferencia");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
      />
      
      <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: 'white', zIndex: 1000, padding: '20px', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Tu Carrito ({totalArticulos})</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
            <X size={24} />
          </button>
        </div>

        {carrito.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px', flex: 1 }}>
            <ShoppingCart size={48} style={{ margin: '0 auto', opacity: 0.5, marginBottom: '15px' }} />
            <p>Tu carrito está vacío 😔</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Lista de productos con scroll */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', paddingRight: '10px' }}>
              {carrito.map((producto) => (
                <div key={producto.id} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
                  
                  <img src={producto.imagen} alt={producto.titulo} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{producto.titulo}</span>
                      <span style={{ fontWeight: 'bold' }}>${producto.precio * producto.cantidad}</span>
                    </div>
                    
                    {/* Controles de Cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <button 
                          onClick={() => quitarDelCarrito(producto.id)}
                          style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {producto.cantidad === 1 ? <Trash2 size={16} color="#dc2626" /> : <Minus size={16} />}
                        </button>
                        
                        <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{producto.cantidad}</span>
                        
                        <button 
                          onClick={() => agregarAlCarrito(producto)}
                          style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>${producto.precio} c/u</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Resumen y Botón de Pago (Fijo abajo) */}
            <div style={{ borderTop: '2px solid #000', paddingTop: '20px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                <span>Total:</span>
                <span>${total}</span>
              </div>
              
              {!preferenceId ? (
                <button 
                  onClick={manejarPago}
                  disabled={cargando}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#009ee3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: cargando ? 'wait' : 'pointer', transition: 'background-color 0.2s' }}
                >
                  {cargando ? 'Preparando pago...' : 'Pagar con Mercado Pago'}
                </button>
              ) : (
                <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}