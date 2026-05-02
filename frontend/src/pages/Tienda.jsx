import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Catalogo from '../components/Catalogo';
import Carrito from '../components/Carrito';
import Footer from '../components/Footer';

export default function Tienda() {
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    const cantidadActualEnCarrito = productoExistente ? productoExistente.cantidad : 0;

    // EL GRAN FRENO: Si intentan agregar más de lo que hay en stock
    if (cantidadActualEnCarrito >= producto.stock) {
      toast.error(`¡Ups! Solo quedan ${producto.stock} unidades de ${producto.titulo}`);
      return; 
    }

    if (productoExistente) {
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
      toast.success(`Se agregó otra unidad de ${producto.titulo}`);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      toast.success(`${producto.titulo} agregado al carrito 🛒`);
    }
  };

  const quitarDelCarrito = (productoId) => {
    const productoExistente = carrito.find(item => item.id === productoId);
    if (productoExistente.cantidad === 1) {
      setCarrito(carrito.filter(item => item.id !== productoId));
      toast.info('Producto eliminado del carrito');
    } else {
      setCarrito(carrito.map(item => item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item));
    }
  };

  return (
    <div>
      <Toaster richColors position="bottom-right" />
      <Navbar carrito={carrito} setIsCartOpen={setIsCartOpen} />
      <Hero />
      <Catalogo agregarAlCarrito={agregarAlCarrito} /> 
      <Footer />
      <Carrito carrito={carrito} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} agregarAlCarrito={agregarAlCarrito} quitarDelCarrito={quitarDelCarrito} />
    </div>
  );
}