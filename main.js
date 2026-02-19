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
// ==========================================
// 5. INTERFAZ DEL CARRITO Y PAGO TOTAL
// ==========================================

function abrirCarrito() {
    const modal = document.getElementById('modal-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total-carrito');

    lista.innerHTML = ''; // Limpiamos la lista visual

    if (carrito.length === 0) {
        lista.innerHTML = '<p>Tu carrito está vacío. ¡Agrega algo de tinta!</p>';
        totalSpan.innerText = '0';
    } else {
        let total = 0;
        // Dibujamos cada producto en la ventanita
        carrito.forEach((item, index) => {
            total += item.precio;
            lista.innerHTML += `
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 14px; border-bottom: 1px dotted #ccc; padding-bottom: 5px;">
                    <span>${item.titulo}</span>
                    <span>$${item.precio.toLocaleString('es-CL')}</span>
                </div>
            `;
        });
        // Actualizamos el número grande del total
        totalSpan.innerText = total.toLocaleString('es-CL');
    }

    // Mostramos la ventana
    modal.style.display = 'block';
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito-iconbototos', JSON.stringify(carrito));
    actualizarContadorCarrito();
    abrirCarrito(); // Para refrescar la vista
}

// === EL MOMENTO DE LA VERDAD: PAGAR ===
async function pagarCarrito() {
    if (carrito.length === 0) {
        alert("Agrega al menos un producto antes de pagar.");
        return;
    }

    const btnPagar = document.getElementById('btn-pagar');
    btnPagar.innerText = "Conectando...";
    btnPagar.style.backgroundColor = "#ffe600"; // Amarillo Riso
    btnPagar.style.cursor = "wait";

    // Sumamos el total matemático
    const totalPagar = carrito.reduce((sum, item) => sum + item.precio, 0);
    // Agrupamos el nombre del pedido (Ej: "Pedido Iconbototos (3 items)")
    const tituloPedido = `Pedido Iconbototos (${carrito.length} impresiones)`;

    try {
        console.log(`Enviando a Render: ${tituloPedido} por $${totalPagar}`);

        const response = await fetch(`${BACKEND_URL}/crear_preferencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo: tituloPedido,
                precio: totalPagar
            }),
        });

        const data = await response.json();

        if (data.id) {
            // ¡Abrir Mercado Pago!
            mp.checkout({
                preference: { id: data.id },
                autoOpen: true,
            });
        } else {
            console.error("Error del servidor:", data);
            alert("Hubo un error al generar el cobro.");
        }
    } catch (error) {
        console.error("Error fetch:", error);
        alert("Error de conexión. Revisa que tu servidor Render esté 'Live'.");
    } finally {
        btnPagar.innerText = "Ir a Pagar";
        btnPagar.style.backgroundColor = "transparent";
        btnPagar.style.cursor = "pointer";
    }
}