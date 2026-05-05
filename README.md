# 🖨️ Iconbototos E-commerce | Riso Press

Plataforma de comercio electrónico a medida para **Editorial Iconbototos**, un estudio independiente de fanzines y arte impreso en risografía con base en Santiago de Chile.

Este proyecto utiliza una arquitectura **desacoplada (Headless)** para garantizar máxima velocidad, seguridad y una gestión de contenidos amigable para el equipo de diseño.

## 🏗️ Arquitectura del Proyecto

* **Frontend:** HTML5, CSS3 y Vanilla JavaScript. Alojado en **Vercel** (CDN Global).
* **Backend:** Servidor Python. Alojado en **Render**.
* **Base de Datos (Catálogo):** Google Sheets conectado vía API pública (CSV) usando PapaParse.
* **Pasarela de Pagos:** Integración directa con la API de Mercado Pago.

## ✨ Características Principales

1. **Catálogo Dinámico (Headless CMS):** Los productos, precios y control de stock se gestionan desde una hoja de cálculo de Google Sheets. No se requiere tocar el código fuente para actualizar la tienda.
2. **Sistema de Diseño por Variables (Design Tokens):** Todo el aspecto visual (colores y tipografías) está centralizado en el archivo `variables.css`, permitiendo traducciones directas desde Figma.
3. **Carrito de Compras Persistente:** Desarrollado con JavaScript y `localStorage`, el carrito no pierde los productos aunque el usuario recargue o cierre la página.
4. **Optimización SEO:** Implementación de metadatos y etiquetas Open Graph para un posicionamiento orgánico óptimo y previsualización de enlaces en redes sociales.

---

## 🤝 Flujo de Trabajo del Equipo

Este repositorio está estructurado para separar el desarrollo lógico del diseño visual y el contenido.

### 🎨 Para Diseño y Contenido (Monserrat)
No necesitas saber programar para gestionar la tienda. Tus herramientas son:

* **Para agregar o editar productos:** Abre el archivo de **Google Sheets** (Catálogo Iconbototos). Puedes cambiar títulos, precios y links de imágenes. Los cambios se reflejarán en la web al instante tras recargar la página.
* **Para cambiar colores o tipografías:**
  1. Abre el archivo `variables.css` en este repositorio.
  2. Edita los códigos de color hexadecimal (ej: `#FFE600`).
  3. Haz un *Commit* para guardar. Vercel actualizará la página automáticamente.

### 💻 Para Desarrollo Lógico (Miguel)
El motor de la página se controla en los siguientes archivos:

* `index.html`: Estructura base y ventanas modales (Carrito).
* `style.css`: Estructura visual, layout, grillas y animaciones.
* `main.js`: Lógica del carrito, lectura del CSV de Google Sheets y conexión con la API del servidor Python para enviar las órdenes de compra.

---

## ⚠️ Notas Técnicas de Operación

**Cold Start (Reinicio en Frío):**
El backend está alojado en el plan gratuito de Render. Si la web no recibe tráfico en 15 minutos, el servidor entra en estado de hibernación. La primera vez que un cliente presione "Ir a Pagar" después de un periodo de inactividad, la conexión con Mercado Pago puede demorar entre **30 y 50 segundos** en responder mientras el servidor "despierta". Las compras posteriores serán instantáneas.

## 📝 Licencia
Propiedad exclusiva de Iconbototos Limitada. Diseño web x Riso.