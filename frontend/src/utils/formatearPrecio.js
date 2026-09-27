// Convierte un precio numérico (en CLP) al formato visual "$12.000".
export function formatearPrecio(precio) {
  const numero = Number(precio);
  if (Number.isNaN(numero)) return '$0';
  return `$${numero.toLocaleString('es-CL')}`;
}