/**
 * Resolución de imágenes del catálogo.
 * Prioriza fotos locales (require) sobre URLs remotas para rendimiento offline.
 */
import type { ImageSourcePropType } from 'react-native';

import { CATALOG_IMAGE_BASE, PRODUCTOS, type CatalogProduct } from '../../database/catalog.generated';

/** Índices del catálogo empaquetado para resolver require() sin red. */
/** Índices del catálogo empaquetado para resolver require() sin red. */
const localById = new Map(PRODUCTOS.map((p) => [p.id, p]));
const localByArchivo = new Map(PRODUCTOS.map((p) => [p.archivo, p]));

/** true si la imagen viene de require() (número en RN). */
function isBundledImage(img: ImageSourcePropType): boolean {
  return typeof img === 'number';
}

/** Type guard: imagen con URI (http, https o file://). */
function isRemoteUri(img: ImageSourcePropType): img is { uri: string } {
  return typeof img === 'object' && img !== null && 'uri' in img && typeof (img as { uri: string }).uri === 'string';
}

/** Extrae el nombre de archivo desde una URL para cruzar con el catálogo local. */
function archivoFromUri(uri: string): string {
  try {
    return decodeURIComponent(uri.replace(/^.*\//, ''));
  } catch {
    return uri.replace(/^.*\//, '');
  }
}

/** Construye URL absoluta a partir del nombre de archivo y la base del servidor. */
export function buildImageUri(archivo: string, imageBase = CATALOG_IMAGE_BASE): string {
  if (!archivo) return '';
  if (archivo.startsWith('http://') || archivo.startsWith('https://')) return archivo;
  const name = archivo.replace(/^.*[/\\]/, '');
  const encoded = encodeURIComponent(decodeURIComponent(name));
  return `${imageBase.replace(/\/$/, '')}/${encoded}`;
}

/** Busca el producto empaquetado por id, archivo o nombre extraído de la URI. */
function lookupLocal(product: Pick<CatalogProduct, 'id' | 'archivo'>, uri?: string) {
  const byId = localById.get(product.id);
  if (byId) return byId;
  const byArchivo = localByArchivo.get(product.archivo);
  if (byArchivo) return byArchivo;
  if (uri) {
    const name = archivoFromUri(uri);
    return localByArchivo.get(name);
  }
  return undefined;
}

/**
 * Para cada producto: si hay asset local, usarlo; si no, URI remota o file:// del admin.
 */
export function resolveProductImage<T extends CatalogProduct & { imageUris?: string[] }>(product: T): T {
  const currentUri = isRemoteUri(product.image) ? product.image.uri : undefined;
  const local = lookupLocal(product, currentUri);

  // Prioridad: asset local empaquetado (offline y más rápido)
  if (local) {
    return {
      ...product,
      image: local.image,
      archivo: local.archivo,
      imageUris: isBundledImage(local.image) ? undefined : product.imageUris,
    };
  }

  if (isBundledImage(product.image)) return product;
  // Fotos elegidas en admin (galería) no se reemplazan por URL remota
  if (currentUri?.startsWith('file://')) return product;

  // Último recurso: reconstruir URL del servidor de imágenes
  const rebuilt = buildImageUri(product.archivo);
  if (rebuilt && rebuilt !== currentUri) {
    return { ...product, image: { uri: rebuilt } satisfies ImageSourcePropType };
  }

  return product;
}

/** Aplica resolveProductImage a cada fila del catálogo base. */
export function resolveCatalogImages(products: CatalogProduct[]): CatalogProduct[] {
  return products.map(resolveProductImage);
}

/**
 * Mezcla filas del API remoto con el catálogo empaquetado:
 * mismos IDs conservan foto local; productos solo locales se añaden al final.
 */
export function mergeRemoteWithLocalCatalog(remoteRows: CatalogProduct[]): CatalogProduct[] {
  if (remoteRows.length === 0) return PRODUCTOS;

  const localByIdMap = new Map(PRODUCTOS.map((p) => [p.id, p]));
  const usedIds = new Set<number>();

  // Por cada fila remota: conservar require() local si existe el mismo id/archivo
  const merged = remoteRows.map((row, index) => {
    const local = localByIdMap.get(row.id) ?? localByArchivo.get(row.archivo);
    const id = local?.id ?? row.id ?? index + 1;
    usedIds.add(id);
    const base = local ?? lookupLocal(row, isRemoteUri(row.image) ? row.image.uri : undefined);

    if (base) {
      return resolveProductImage({
        ...row,
        id,
        image: base.image,
        archivo: base.archivo,
      });
    }
    return resolveProductImage({ ...row, id });
  });

  // Productos solo locales (no venían en el API) se conservan al final
  for (const p of PRODUCTOS) {
    if (!usedIds.has(p.id)) merged.push(p);
  }

  return merged.sort((a, b) => a.id - b.id);
}
