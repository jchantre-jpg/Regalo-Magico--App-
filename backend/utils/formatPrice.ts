/**
 * Formato de precios en pesos colombianos (COP).
 * Usado en tarjetas, carrito, detalle y mensaje de WhatsApp.
 */
export function formatPriceCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
