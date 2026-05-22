import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Recuerda mantener tu Public Key real aquí
initMercadoPago('APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c', { locale: 'es-CL' });

export default function Carrito({ carrito, isCartOpen, setIsCartOpen, agregarAlCarrito, quitarDelCarrito }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [cargando, setCargando] = useState(false);

  if (!isCartOpen) return null;

  const total = carrito.reduce((suma, producto) => suma + (producto.precio * producto.cantidad), 0);
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
      {/* Fondo oscuro transparente */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
      />
      
      {/* Panel lateral */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: 'white', zIndex: 1000, padding: '20px', boxShadow: '-2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase' }}>Tu Carrito ({totalArticulos})</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#111' }}>
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {carrito.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px', flex: 1 }}>
            <ShoppingCart size={48} strokeWidth={1.5} style={{ margin: '0 auto', opacity: 0.3, marginBottom: '15px' }} />
            <p style={{ fontWeight: 'bold' }}>Tu carrito está vacío</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Lista de productos */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', paddingRight: '10px' }}>
              {carrito.map((producto) => (
                <div key={producto.id} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #eaeaea' }}>
                  
                  <img src={producto.imagen} alt={producto.titulo} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{producto.titulo}</span>
                      <span style={{ fontWeight: 'bold' }}>${producto.precio * producto.cantidad}</span>
                    </div>
                    
                    {/* Controles de Cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #111', borderRadius: '4px' }}>
                        
                        <button 
                          onClick={() => quitarDelCarrito(producto.id)}
                          style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {producto.cantidad === 1 ? <Trash2 size={16} color="#dc2626" strokeWidth={2.5} /> : <Minus size={16} strokeWidth={2.5} />}
                        </button>
                        
                        <span style={{ padding: '0 10px', fontWeight: '900' }}>{producto.cantidad}</span>
                        
                        {/* BOTÓN PLUS ACTUALIZADO: Bloqueado si se alcanza el stock máximo */}
                        <button 
                          onClick={() => agregarAlCarrito(producto)}
                          disabled={producto.cantidad >= producto.stock}
                          title={producto.cantidad >= producto.stock ? 'Stock máximo alcanzado' : 'Agregar unidad'}
                          style={{ 
                            padding: '5px 10px', 
                            background: 'none', 
                            border: 'none', 
                            cursor: producto.cantidad >= producto.stock ? 'not-allowed' : 'pointer', 
                            display: 'flex', 
                            alignItems: 'center',
                            color: producto.cantidad >= producto.stock ? '#ccc' : '#111'
                          }}
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </button>

                      </div>
                      
                      <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>${producto.precio} c/u</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Resumen y Botón de Pago */}
            <div style={{ borderTop: '2px solid #111', paddingTop: '20px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase' }}>
                <span>Total:</span>
                <span>${total}</span>
              </div>
              
              {!preferenceId ? (
                <button 
                  onClick={manejarPago}
                  disabled={cargando}
                  style={{ width: '100%', padding: '15px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', cursor: cargando ? 'wait' : 'pointer', transition: 'background-color 0.2s' }}
                >
                  {cargando ? 'PROCESANDO...' : 'PAGAR AHORA'}
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