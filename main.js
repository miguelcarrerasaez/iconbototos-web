// Seleccionamos todos los elementos que queremos animar
const hiddenElements = document.querySelectorAll('.hidden');

// Creamos el observador
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry) // Para que veas en consola qué pasa
        if (entry.isIntersecting) {
            // Si el elemento es visible, agregamos la clase 'show'
            entry.target.classList.add('show');
        } 
        // Si quisieras que la animación se repita al salir y entrar, 
        // agregarías un 'else' para remover la clase.
    });
});

// Le decimos al observador que vigile a cada elemento oculto
hiddenElements.forEach((el) => observer.observe(el));