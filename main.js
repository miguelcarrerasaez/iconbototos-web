// ==========================================
// 1. CONFIGURACIÓN (Conexión Automática)
// ==========================================

// Detecta si estás en tu casa (Localhost) o en Internet
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000" // Si estás en tu PC, usa Python local
    : "https://iconbototos-web.onrender.com"; // <--- ¡AQUÍ VA TU URL NUEVA!

// Ejemplo: "https://iconbototos-api.onrender.com"
// (Sin la barra / al final)

// Pega aquí TU PUBLIC KEY de Mercado Pago
const mp = new MercadoPago('APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c', {
    locale: 'es-CL'
});

// ==========================================
// 2. LÓGICA DE COMPRA
// ==========================================
const botonesCompra = document.querySelectorAll('.btn-comprar');

botonesCompra.forEach(boton => {
    boton.addEventListener('click', async function(e) {
        e.preventDefault(); 
        
        // UI Feedback: Botón en estado de carga
        const textoOriginal = this.innerText;
        this.innerText = "Creando orden...";
        this.style.backgroundColor = "#ffe600"; // Amarillo Riso
        this.style.cursor = "wait";

        // Obtener datos del DOM (HTML)
        // Buscamos el contenedor padre (.info) y luego subimos a (.card-producto)
        // O más fácil: closest busca hacia arriba
        const tarjeta = this.closest('.card-producto'); 
        const tituloProducto = tarjeta.querySelector('h3').innerText;
        const textoPrecio = tarjeta.querySelector('.precio').innerText;
        
        // Limpiar precio (de "$15.000 CLP" a 15000)
        const precioNumerico = parseInt(textoPrecio.replace(/\D/g, '')); 

        try {
            console.log(`Pidiendo preferencia para: ${tituloProducto}`);

            const response = await fetch(`${BACKEND_URL}/crear_preferencia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titulo: tituloProducto, 
                    precio: precioNumerico 
                }),
            });

            const data = await response.json();

            if (data.id) {
                mp.checkout({
                    preference: { id: data.id },
                    autoOpen: true,
                });
            } else {
                console.error("Error backend:", data);
                alert("Hubo un error al conectar con Mercado Pago.");
            }

        } catch (error) {
            console.error("Error fetch:", error);
            alert("Error de conexión: Revisa que tu app.py esté corriendo.");
        } finally {
            // Restaurar botón
            this.innerText = textoOriginal;
            this.style.backgroundColor = "transparent";
            this.style.cursor = "pointer";
        }
    });
});