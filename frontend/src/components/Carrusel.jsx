import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { productos as productosData } from '../data/productos';
import './Carrusel.css';

export default function Carrusel() {
  const { agregarAlCarrito } = useCarrito();

  // Usamos productos COMPLETOS (con precio/stock) para que funcionen en el carrito.
  const idsCarrusel = ["6", "3", "1"];
  const productos = idsCarrusel
    .map(id => productosData.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ ...p, imagen: p.imagenes[0] }));

  return (
    <section className="carrusel-seccion">
      <Link to="/tienda" className="carrusel-ver-mas">Ver más</Link>

      <div className="carrusel-contenedor">
        {productos.map(producto => (
          <div key={producto.id} className="carrusel-card">
            
            <div className="carrusel-imagen-wrapper">
              <Link to={`/tienda/${producto.id}`}>
                <img 
                  className="carrusel-imagen" 
                  src={producto.imagen} 
                  alt={producto.titulo} 
                />
              </Link>
              
              <button 
              className="carrusel-carrito" 
              aria-label="Agregar al carrito"
              onClick={() => agregarAlCarrito(producto)}
              disabled={producto.stock === 0}
              title={producto.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
            >
                <img src="/img/MenúCarrito.svg" alt="Carrito" />
              </button>
            </div>
            
            <div className="carrusel-info">
              <Link to={`/tienda/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="carrusel-titulo">{producto.titulo}</h3>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}