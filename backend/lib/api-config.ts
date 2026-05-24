const DEFAULT_API = 'https://ele5-6.apolobyte.top/api/productos';
const DEFAULT_IMAGE_BASE = 'https://ele5-6.apolobyte.top/imagenes';

export function resolveCatalogMode(): {
  apiBase: string;
  imageBase: string;
  useRemote: boolean;
} {
  const apiBase = process.env.EXPO_PUBLIC_CATALOG_API?.trim() || DEFAULT_API;
  const imageBase = process.env.EXPO_PUBLIC_CATALOG_IMAGE_BASE?.trim() || DEFAULT_IMAGE_BASE;
  const flag = process.env.EXPO_PUBLIC_USE_REMOTE_CATALOG?.trim().toLowerCase();
  const useRemote = flag === '1' || flag === 'true' || flag === 'yes';
  return { apiBase, imageBase, useRemote };
}
