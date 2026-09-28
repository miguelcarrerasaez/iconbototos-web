import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio } from '../utils/formatearPrecio';
import { BACKEND_URL } from '../config';
import '../components/DetalleProducto.css';

export default function DetalleProducto() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  
  // Estados para controlar los datos desde Render
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [cantidad, setCantidad] = useState(1);
  const [indiceImagen, setIndiceImagen] = useState(0); 
  const [sugerencias, setSugerencias] = useState([]); // ⭐️ "Te podría interesar" 
  
  useEffect(() => {
    // 1. Buscamos los productos en tu base de datos real
    fetch(`${BACKEND_URL}/api/productos`)
      .then(res => res.json())
      .then(datos => {
        // 2. Filtramos el producto exacto que estamos viendo (el ID de la URL es texto, el de la BD es número)
        const prod = datos.find((p) => p.id.toString() === id);
        setProducto(prod);
        // 2b. "Te podría interesar": excluimos el producto actual y tomamos los primeros 3
        const datosFiltrados = datos.filter((p) => p.id.toString() !== id);
        setSugerencias(datosFiltrados.slice(0, 3));
        setCargando(false);
      })
      .catch(error => {
        console.error("Error cargando el producto:", error);
        setCargando(false);
      });
  }, [id]);

  // Pantalla de carga
  if (cargando) {
    return <div style={{ textAlign: "center", padding: "100px" }}><h2>Cargando lámina...</h2></div>;
  }

  // Si alguien pone una URL inventada
  if (!producto) {
    return <div style={{ textAlign: "center", padding: "100px" }}><h2>Producto no encontrado</h2></div>;
  }
  
  // 3. Adaptamos las fotos reales al Carrusel
  const imagenesArray = [];
  if (producto.imagen) imagenesArray.push(producto.imagen); // 1. Agrega la portada
  if (producto.imagen_hover) imagenesArray.push(producto.imagen_hover); // 2. Agrega el hover (solo si existe)
  
  if (producto.galeria && Array.isArray(producto.galeria)) {
    imagenesArray.push(...producto.galeria); // 3. Agrega todas las de la galería extra
  }
  
  // Lógica del Carrusel
  const irImagenAnterior = () => {
    setIndiceImagen(prev => (prev === 0 ? imagenesArray.length - 1 : prev - 1));
  };

  const irImagenSiguiente = () => {
    setIndiceImagen(prev => (prev === imagenesArray.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="detalle-layout">
      
      {/* SECCIÓN 1: MAIN CONTENT */}
      <div className="detalle-main">
        {/* Izquierda: Carrusel */}
        <div className="detalle-carrusel">
          <div className="carrusel-imagen-contenedor">
            {/* Solo mostramos flechas si hay más de 1 imagen */}
            {imagenesArray.length > 1 && (
              <button className="carrusel-flecha izquierda" onClick={irImagenAnterior}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}
            
            {/* Imagen Dinámica (lee el índice actual) */}
            <img src={imagenesArray[indiceImagen]} alt={producto.titulo} className="carrusel-imagen-principal" />
            
            {imagenesArray.length > 1 && (
              <button className="carrusel-flecha derecha" onClick={irImagenSiguiente}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}
          </div>
          
          {/* Puntos de paginación dinámicos */}
          {imagenesArray.length > 1 && (
            <div className="carrusel-paginacion">
              {imagenesArray.map((_, index) => (
                <span 
                  key={index} 
                  className={`punto ${index === indiceImagen ? 'activo' : ''}`}
                  onClick={() => setIndiceImagen(index)}
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
            </div>
          )}
        </div>

        {/* Derecha: Info */}
        <div className="detalle-info">
          <h1 className="detalle-titulo">{producto.titulo}</h1>
          
          <div className="detalle-etiquetas">
            {producto.categoria && <span className="badge-gris">{producto.categoria}</span>}
            {producto.autor && <span className="badge-gris">{producto.autor}</span>}
          </div>

          <div className="detalle-precio">{formatearPrecio(producto.precio)}</div>

          <div className="detalle-controles">
            <div className="selector-cantidad">
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</span>
              <span>{cantidad}</span>
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(cantidad + 1)}>+</span>
            </div>
            {/* Botón conectado al carrito global */}
            <button 
              className="btn-agregar-negro" 
              onClick={() => agregarAlCarrito(producto, cantidad)}
              disabled={producto.stock === 0}
            >
              {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>

          {/* INDICADOR DE STOCK DINÁMICO */}
          {producto.stock > 0 ? (
            <div className="detalle-stock">
              <img src="/img/ícono_carita.stock.svg" alt="Ícono en stock" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              En stock
            </div>
          ) : (
            <div className="detalle-stock sin-stock">
              <img src="/img/ícono_carita.Nostock.svg" alt="Ícono sin stock" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              Sin stock
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: DESCRIPCIÓN */}
      {/* Usamos white-space pre-wrap para que respete los "enters" del panel de administración */}
      <div className="detalle-descripcion" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        <p>{producto.descripcion || 'Sin descripción disponible.'}</p>
      </div>

      {/* SECCIÓN 3: TE PODRÍA INTERESAR */}
      <div className="te-podria-interesar">
        <h2 className="te-podria-titulo">Te podría interesar</h2>
        <div className="te-podria-grilla">
          {sugerencias.map((item) => (
            /* Convertimos toda la tarjeta en un Link y forzamos display block */
            <Link 
              key={item.id}
              to={`/tienda/${item.id}`} 
              className="tarjeta-interes" 
              onClick={() => window.scrollTo(0, 0)}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="tarjeta-interes-img-container">
                <img src={item.imagen} alt={item.titulo} className="tarjeta-interes-img" />
              </div>
              <div className="tarjeta-interes-info">
                <h3 className="tarjeta-interes-titulo">{item.titulo}</h3>
                <p className="tarjeta-interes-autor">{item.autor || 'Iconbototos'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}