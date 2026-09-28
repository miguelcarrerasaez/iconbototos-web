import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { BACKEND_URL } from '../config';
import './Carrusel.css';

export default function Carrusel() {
  const { agregarAlCarrito } = useCarrito();

  // ⭐️ Productos DESTACADOS: los elige el admin con el checkbox del panel.
  // En lugar de tomar los últimos 3, filtramos los que tienen destacado === true.
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/productos`)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        const lista = Array.isArray(datos) ? datos : [];
        const soloDestacados = lista.filter((p) => p.destacado === true);
        // Si el admin aún no marcó ninguno, mostramos todos para no dejar la sección vacía
        setDestacados(soloDestacados.length > 0 ? soloDestacados : lista);
      })
      .catch((error) => console.error('Error cargando destacados:', error));
  }, []);

  return (
    <section className="carrusel-seccion">
      <Link to="/tienda" className="carrusel-ver-mas">Ver más</Link>

      <div className="carrusel-contenedor">
        {destacados.map(producto => (
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