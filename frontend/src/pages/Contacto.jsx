import React, { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setCargando(true);

    const form = evento.target;
    const formData = new FormData(form);

    try {
      // Usamos la API de FormSubmit para enviar el correo sin recargar la página
      const response = await fetch("https://formsubmit.co/ajax/iconbototos.editorial@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Correo: formData.get("correo"),
          Telefono: formData.get("telefono"),
          Mensaje: formData.get("mensaje"),
          _subject: "✨ Nuevo mensaje de contacto en la web de Iconbototos" // Asunto del correo
        })
      });

      if (response.ok) {
        setEnviado(true);
        form.reset(); // Limpia los campos del formulario
        setTimeout(() => setEnviado(false), 5000);
      } else {
        alert("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (error) {
      alert("Error de conexión al enviar el mensaje.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contacto-layout">
      {/* SECCIÓN 1: ENCABEZADO */}
      <h1 className="contacto-titulo">Contáctanos</h1>

      {/* SECCIÓN 2: TEXTOS DEL FORMULARIO */}
      <h2 className="contacto-subtitulo">¡Déjanos un mensaje!</h2>
      <p className="contacto-descripcion">te responderemos a la brevedad vía correo electrónico</p>

      {/* SECCIÓN 3: FORMULARIO */}
      <form className="contacto-formulario" onSubmit={manejarEnvio} noValidate>
        <div className="campo-formulario">
          <label className="campo-etiqueta" htmlFor="correo">
            Correo electrónico (obligatorio)
          </label>
          <input
            id="correo"
            type="email"
            name="correo"
            placeholder="ejemplo@gmail.com"
            required
            className="campo-input"
          />
        </div>

        <div className="campo-formulario">
          <label className="campo-etiqueta" htmlFor="telefono">
            Número de contacto
          </label>
          <input
            id="telefono"
            type="text"
            name="telefono"
            placeholder="+5699538XXXX"
            className="campo-input"
          />
        </div>

        <div className="campo-formulario">
          <label className="campo-etiqueta" htmlFor="mensaje">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="6"
            required
            className="campo-textarea"
          ></textarea>
        </div>

        <button type="submit" className="contacto-boton" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>

      {enviado && <p className="contacto-exito">¡Mensaje enviado! Te escribiremos de vuelta pronto.</p>}
    </div>
  );
}