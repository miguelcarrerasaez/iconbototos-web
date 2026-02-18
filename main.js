// ==========================================
// 1. CONFIGURACIÓN
// ==========================================
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000" 
    : "https://iconbototos-web.onrender.com";

const mp = new MercadoPago('APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c', {
    locale: 'es-CL'
});

// ==========================================
// 2. CATÁLOGO DINÁMICO
// ==========================================
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        const productos = await respuesta.json();
        const contenedor = document.getElementById('contenedor-productos');
        
        contenedor.innerHTML = ''; // Limpiamos contenedor

        productos.forEach(producto => {
            const estiloExtra = producto.estiloImagen ? `style="${producto.estiloImagen}"` : '';
            
            const tarjetaHTML = `
                <div class="card-producto">
                    <div class="img-wrapper">
                        <img src="${producto.imagen}" alt="${producto.titulo}" ${estiloExtra}>
                    </div>
                    <div class="info">
                        <h3>${producto.titulo}</h3>
                        <p class="precio">$${producto.precio.toLocaleString('es-CL')} CLP</p>
                        <button class="btn-comprar" onclick="agregarAlCarrito('${producto.titulo}', ${producto.precio})">
                            ${producto.botonTexto}
                        </button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// ==========================================
// 3. CARRITO DE COMPRAS (Memoria)
// ==========================================
let carrito = JSON.parse(localStorage.getItem('carrito-iconbototos')) || [];

function agregarAlCarrito(titulo, precio) {
    carrito.push({
        titulo: titulo,
        precio: precio
    });

    localStorage.setItem('carrito-iconbototos', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`¡"${titulo}" se agregó a tu carrito! 🛒`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.innerText = carrito.length; 
    }
}

// ==========================================
// 4. INICIALIZAR PÁGINA
// ==========================================
// Cuando la página carga, ejecutamos estas dos cosas:
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarContadorCarrito();
});