import type { ImageSourcePropType } from 'react-native';

import { CATALOG_IMAGE_BASE, PRODUCTOS, type CatalogProduct } from '../../database/catalog.generated';

const localById = new Map(PRODUCTOS.map((p) => [p.id, p]));
const localByArchivo = new Map(PRODUCTOS.map((p) => [p.archivo, p]));

function isBundledImage(img: ImageSourcePropType): boolean {
  return typeof img === 'number';
}

function isRemoteUri(img: ImageSourcePropType): img is { uri: string } {
  return typeof img === 'object' && img !== null && 'uri' in img && typeof (img as { uri: string }).uri === 'string';
}

function archivoFromUri(uri: string): string {
  try {
    return decodeURIComponent(uri.replace(/^.*\//, ''));
  } catch {
    return uri.replace(/^.*\//, '');
  }
}

/** URL remota (web). La app prioriza imágenes empaquetadas en assets/catalog. */
export function buildImageUri(archivo: string, imageBase = CATALOG_IMAGE_BASE): string {
  if (!archivo) return '';
  if (archivo.startsWith('http://') || archivo.startsWith('https://')) return archivo;
  const name = archivo.replace(/^.*[/\\]/, '');
  const encoded = encodeURIComponent(decodeURIComponent(name));
  return `${imageBase.replace(/\/$/, '')}/${encoded}`;
}

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

export function resolveProductImage<T extends CatalogProduct & { imageUris?: string[] }>(product: T): T {
  const currentUri = isRemoteUri(product.image) ? product.image.uri : undefined;
  const local = lookupLocal(product, currentUri);

  if (local) {
    return {
      ...product,
      image: local.image,
      archivo: local.archivo,
      imageUris: isBundledImage(local.image) ? undefined : product.imageUris,
    };
  }

  if (isBundledImage(product.image)) return product;

  if (currentUri?.startsWith('file://')) return product;

  const rebuilt = buildImageUri(product.archivo);
  if (rebuilt && rebuilt !== currentUri) {
    return { ...product, image: { uri: rebuilt } satisfies ImageSourcePropType };
  }

  return product;
}

export function resolveCatalogImages(products: CatalogProduct[]): CatalogProduct[] {
  return products.map(resolveProductImage);
}

/** Fusiona datos del API remoto pero mantiene fotos locales empaquetadas. */
export function mergeRemoteWithLocalCatalog(remoteRows: CatalogProduct[]): CatalogProduct[] {
  if (remoteRows.length === 0) return PRODUCTOS;
  const localByIdMap = new Map(PRODUCTOS.map((p) => [p.id, p]));
  const usedIds = new Set<number>();

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

  for (const p of PRODUCTOS) {
    if (!usedIds.has(p.id)) merged.push(p);
  }

  return merged.sort((a, b) => a.id - b.id);
}
