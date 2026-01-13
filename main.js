// ==========================================
// 1. CONFIGURACIÓN INICIAL
// ==========================================

// Inicializa Mercado Pago con TU PUBLIC KEY
// (La que es pública, NO el Access Token)
const mp = new MercadoPago('APP_USR-7ed5aea3-fb5c-413b-94a4-342cc1ce033c', {
    locale: 'es-CL'
});

// URL de tu Backend (Si usas Ngrok, cambia esto por la url de ngrok)
const BACKEND_URL = "http://127.0.0.1:5000";

// ==========================================
// 2. LÓGICA DE PAGOS
// ==========================================
const botonesCompra = document.querySelectorAll('.btn-comprar');

botonesCompra.forEach(boton => {
    boton.addEventListener('click', async function(e) {
        e.preventDefault(); // Evita que la página salte al inicio (#)
        
        // Efecto visual: Feedback para el usuario
        const textoOriginal = this.innerText;
        this.innerText = "Procesando...";
        this.style.opacity = "0.7";
        this.style.pointerEvents = "none"; // Evita doble click

        // Capturamos datos del HTML
        const tarjeta = this.closest('.card-producto');
        const tituloProducto = tarjeta.querySelector('h3').innerText;
        const textoPrecio = tarjeta.querySelector('.precio').innerText;
        
        // Limpieza de precio: De "$15.000 CLP" a 15000 numérico
        const precioNumerico = parseInt(textoPrecio.replace(/\D/g, '')); 

        try {
            console.log(`Iniciando compra: ${tituloProducto} por ${precioNumerico}`);

            // Llamada al Backend
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
                // Abre el checkout de Mercado Pago
                mp.checkout({
                    preference: { id: data.id },
                    autoOpen: true,
                });
            } else {
                alert("Error: No se recibió ID de pago del servidor.");
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error: Asegúrate de que el servidor Python (app.py) esté corriendo.");
        } finally {
            // Restaurar botón pase lo que pase
            this.innerText = textoOriginal;
            this.style.opacity = "1";
            this.style.pointerEvents = "auto";
        }
    });
});

// ==========================================
// 3. ANIMACIONES (Observer)
// ==========================================
// Si tenías código para animar los elementos .hidden, va aquí:
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } 
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));