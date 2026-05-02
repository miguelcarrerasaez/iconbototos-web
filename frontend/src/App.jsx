import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalogo from './components/Catalogo';
import Carrito from './components/Carrito';
import Footer from './components/Footer';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Lógica mejorada: Ahora maneja cantidades
  const agregarAlCarrito = (producto) => {
    // Buscamos si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si existe, mapeamos el carrito y al producto que coincide le sumamos 1 a su cantidad
      setCarrito(
        carrito.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      );
      toast.success(`Se agregó otra unidad de ${producto.titulo}`);
    } else {
      // Si no existe, lo agregamos al carrito con cantidad inicial de 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      toast.success(`${producto.titulo} agregado al carrito 🛒`);
    }
  };

  // 2. Nueva función para restar cantidades o eliminar el producto
  const quitarDelCarrito = (productoId) => {
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente.cantidad === 1) {
      // Si solo queda 1, lo borramos del carrito filtrándolo
      setCarrito(carrito.filter(item => item.id !== productoId));
      toast.info('Producto eliminado del carrito');
    } else {
      // Si hay más de 1, le restamos 1 a la cantidad
      setCarrito(
        carrito.map(item => 
          item.id === productoId 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
        )
      );
    }
  };

  return (
    <div>
      <Toaster richColors position="bottom-right" />
      <Navbar carrito={carrito} setIsCartOpen={setIsCartOpen} />
      <Hero />
      <Catalogo agregarAlCarrito={agregarAlCarrito} /> 
      <Footer />
      {/* Pasamos las nuevas funciones al panel del carrito */}
      <Carrito 
        carrito={carrito} 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen} 
        agregarAlCarrito={agregarAlCarrito}
        quitarDelCarrito={quitarDelCarrito}
      />
    </div>
  );
}

export default App;