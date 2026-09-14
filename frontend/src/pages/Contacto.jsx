import React, { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  // Confirmación tras enviar el formulario (sin backend aún)
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 5000);
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
            className="campo-textarea"
          ></textarea>
        </div>

        <button type="submit" className="contacto-boton">Enviar mensaje</button>
      </form>

      {enviado && <p className="contacto-exito">¡Mensaje enviado! Te escribiremos de vuelta pronto.</p>}

    </div>
  );
}