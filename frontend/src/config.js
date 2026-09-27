// ===========================================================
// Configuración central de Iconbototos (frontend)
// ===========================================================
// BACKEND_URL : servidor Flask.
//   - Desarrollo  : http://localhost:5000
//   - Producción  : usa VITE_BACKEND_URL si está definida, si no cae
//                   en la URL del backend en Render.
// MP_PUBLIC_KEY : llave PÚBLICA de Mercado Pago (lee VITE_MP_PUBLIC_KEY
//                 del archivo .env del frontend).
//   ⚠️ Es pública (no secreta); el access token vive SOLO en backend/.env.

const esDesarrollo =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const URL_PRODUCCION =
  import.meta.env.VITE_BACKEND_URL || 'https://iconbototos-api.onrender.com';

export const BACKEND_URL = esDesarrollo ? 'http://localhost:5000' : URL_PRODUCCION;

export const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || '';