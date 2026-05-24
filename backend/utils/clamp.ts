/**
 * Limita un número al rango [min, max] (útil para escala responsive).
 * @example clamp(2.5, 0.78, 1.14) → 1.14
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
