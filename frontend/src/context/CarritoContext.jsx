/* eslint-disable react-refresh/only-export-components --
   Patrón estándar de Context: este módulo exporta el Provider y su hook. */
import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

// Context global del carrito: elimina el prop-drilling entre componentes.
const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // producto: objeto completo del producto; cantidadNueva: opcional (por defecto 1)
  const agregarAlCarrito = (producto, cantidadNueva = 1) => {
    const cantidad = Math.max(1, parseInt(cantidadNueva, 10) || 1);
    const productoExistente = carrito.find((item) => item.id === producto.id);
    const cantidadActual = productoExistente ? productoExistente.cantidad : 0;
    const stockNumerico = Number(producto.stock);
    const stockDisponible = Number.isFinite(stockNumerico) ? stockNumerico : 99;

    if (cantidadActual + cantidad > stockDisponible) {
      toast.error(`¡Ups! Solo quedan ${stockDisponible} unidades de ${producto.titulo}`);
      return;
    }

    if (productoExistente) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      );
      toast.success(`Se agregó otra unidad de ${producto.titulo}`);
    } else {
      setCarrito([...carrito, { ...producto, cantidad }]);
      toast.success(`${producto.titulo} agregado al carrito 🛒`);
    }
  };

  const quitarDelCarrito = (productoId) => {
    const productoExistente = carrito.find((item) => item.id === productoId);
    if (!productoExistente) return;

    if (productoExistente.cantidad === 1) {
      setCarrito(carrito.filter((item) => item.id !== productoId));
      toast.info('Producto eliminado del carrito');
    } else {
      setCarrito(
        carrito.map((item) =>
          item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
        )
      );
    }
  };

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const total = carrito.reduce(
    (suma, item) => suma + (Number(item.precio) || 0) * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, quitarDelCarrito, isCartOpen, setIsCartOpen, totalItems, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de un <CarritoProvider>');
  }
  return contexto;
}