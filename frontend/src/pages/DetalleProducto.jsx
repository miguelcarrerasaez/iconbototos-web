import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { productos } from '../data/productos';
import '../components/DetalleProducto.css';

export default function DetalleProducto() {
  const { id } = useParams();
  
  // Estados para controlar el componente
  const [cantidad, setCantidad] = useState(1);
  const [indiceImagen, setIndiceImagen] = useState(0); // Controla qué foto del carrusel se ve
  
  const producto = productos.find(p => p.id === id);

  if (!producto) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Producto no encontrado</h2>;

  // Lógica del Carrusel
  const irImagenAnterior = () => {
    setIndiceImagen(prev => (prev === 0 ? producto.imagenes.length - 1 : prev - 1));
  };

  const irImagenSiguiente = () => {
    setIndiceImagen(prev => (prev === producto.imagenes.length - 1 ? 0 : prev + 1));
  };

  // Convertimos el texto "Dato / Dato / Dato" en una lista hacia abajo
  const lineasFichaTecnica = producto.descripcion.fichaTecnica.split(' / ');

  return (
    <div className="detalle-layout">
      
      {/* SECCIÓN 1: MAIN CONTENT */}
      <div className="detalle-main">
        {/* Izquierda: Carrusel */}
        <div className="detalle-carrusel">
          <div className="carrusel-imagen-contenedor">
            {/* Flecha Izquierda (ahora con onClick) */}
            <button className="carrusel-flecha izquierda" onClick={irImagenAnterior}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            {/* Imagen Dinámica (lee el índice actual) */}
            <img src={producto.imagenes[indiceImagen]} alt={producto.titulo} className="carrusel-imagen-principal" />
            
            {/* Flecha Derecha (ahora con onClick) */}
            <button className="carrusel-flecha derecha" onClick={irImagenSiguiente}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          
          {/* Puntos de paginación dinámicos */}
          <div className="carrusel-paginacion">
            {producto.imagenes.map((_, index) => (
              <span 
                key={index} 
                className={`punto ${index === indiceImagen ? 'activo' : ''}`}
                onClick={() => setIndiceImagen(index)}
                style={{ cursor: 'pointer' }}
              ></span>
            ))}
          </div>
        </div>

        {/* Derecha: Info */}
        <div className="detalle-info">
          <h1 className="detalle-titulo">{producto.titulo}</h1>
          
          <div className="detalle-etiquetas">
            <span className="badge-gris">{producto.categoria}</span>
            <span className="badge-gris">{producto.autor}</span>
          </div>

          <div className="detalle-precio">{producto.precio}</div>

          <div className="detalle-controles">
            <div className="selector-cantidad">
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</span>
              <span>{cantidad}</span>
              <span style={{cursor: 'pointer'}} onClick={() => setCantidad(cantidad + 1)}>+</span>
            </div>
            {/* Pronto conectaremos este botón al carrito */}
            <button className="btn-agregar-negro">Agregar al carrito</button>
          </div>

          {producto.stock && (
            <div className="detalle-stock">
              <img 
                src="/img/ícono_carita.stock.svg" 
                alt="Ícono stock" 
                style={{ width: '32px', height: '32px' }} 
              />
              En stock
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: DESCRIPCIÓN */}
      <div className="detalle-descripcion">
        <p>{producto.descripcion.sinopsis}</p>
        <p>{producto.descripcion.bio}</p>
        {/* Renderizamos la ficha técnica línea por línea hacia abajo */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {lineasFichaTecnica.map((linea, index) => (
            <span key={index}>{linea}</span>
          ))}
        </div>
      </div>

{/* SECCIÓN 3: TE PODRÍA INTERESAR */}
      <div className="te-podria-interesar">
        <h2 className="te-podria-titulo">Te podría interesar</h2>
        <div className="te-podria-grilla">
          
          <div className="tarjeta-interes">
            {/* Contenedor blanco añadido aquí */}
            <div className="tarjeta-interes-img-container">
              <img src="/img/objetos.jpg" alt="Objetos que quitan el frío" className="tarjeta-interes-img" />
            </div>
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Objetos que quitan el frío</h3>
              <p className="tarjeta-interes-autor">Monserrat Mella</p>
            </div>
          </div>
          
          <div className="tarjeta-interes">
            {/* Contenedor blanco añadido aquí */}
            <div className="tarjeta-interes-img-container">
              <img src="/img/sabanas.jpg" alt="Sábanas" className="tarjeta-interes-img" />
            </div>
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Sábanas</h3>
              <p className="tarjeta-interes-autor">Violeta Capasso</p>
            </div>
          </div>
          
          <div className="tarjeta-interes">
            {/* Contenedor blanco añadido aquí */}
            <div className="tarjeta-interes-img-container">
              <img src="/img/domingo.fanzine.jpg" alt="Domingo" className="tarjeta-interes-img" />
            </div>
            <div className="tarjeta-interes-info">
              <h3 className="tarjeta-interes-titulo">Domingo</h3>
              <p className="tarjeta-interes-autor">Monserrat Mella</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}