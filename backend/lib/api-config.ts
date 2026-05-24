/**
 * Configuración del catálogo remoto vía variables de entorno Expo.
 * Por defecto usa catálogo local (catalog.generated.ts).
 */
/** Valores por defecto si no hay variables EXPO_PUBLIC_* en .env */
const DEFAULT_API = 'https://ele5-6.apolobyte.top/api/productos';
const DEFAULT_IMAGE_BASE = 'https://ele5-6.apolobyte.top/imagenes';

/**
 * Lee EXPO_PUBLIC_* y decide si cargar catálogo remoto o solo el empaquetado.
 */
export function resolveCatalogMode(): {
  apiBase: string;
  imageBase: string;
  useRemote: boolean;
} {
  const apiBase = process.env.EXPO_PUBLIC_CATALOG_API?.trim() || DEFAULT_API;
  const imageBase = process.env.EXPO_PUBLIC_CATALOG_IMAGE_BASE?.trim() || DEFAULT_IMAGE_BASE;
  const flag = process.env.EXPO_PUBLIC_USE_REMOTE_CATALOG?.trim().toLowerCase();
  // Sin flag o en false: solo catalog.generated.ts empaquetado
  const useRemote = flag === '1' || flag === 'true' || flag === 'yes';
  return { apiBase, imageBase, useRemote };
}
