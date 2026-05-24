/**
 * Fusión del catálogo base con datos del admin.
 * Aplica overrides, oculta eliminados y convierte productos custom al tipo StoreProduct.
 */
import type { ImageSourcePropType } from 'react-native';

import type { AdminPersisted, CustomProductRecord, ProductOverride } from '../../database/admin-storage';
import type { CatalogProduct } from '../../database/catalog.generated';
import type { StoreProduct } from '../types/store';

export type { StoreProduct };

/** Imagen empaquetada con require() — en RN el tipo es number. */
export function isBundledSource(img: ImageSourcePropType): boolean {
  return typeof img === 'number';
}

/** Type guard: imagen cargada por URI (remota, file:// o galería). */
function isUriSource(img: ImageSourcePropType): img is { uri: string } {
  return typeof img === 'object' && img !== null && 'uri' in img && typeof (img as { uri: string }).uri === 'string';
}

/**
 * Lista final para la tienda: base − eliminados + overrides + customs, ordenada por id.
 */
export function mergeCatalog(base: CatalogProduct[], data: AdminPersisted | null): StoreProduct[] {
  const persist = data ?? { overrides: {}, customProducts: [], deletedIds: [] };
  const deleted = new Set(persist.deletedIds);
  const merged = base
    .filter((p) => !deleted.has(p.id))
    .map((p) => mergeOne(p, persist.overrides[String(p.id)]));
  // Productos creados solo en la app van al final del listado fusionado
  // Productos creados solo en la app van al final del listado fusionado
  const customs = persist.customProducts.map(customToStore);
  return [...merged, ...customs].sort((a, b) => a.id - b.id);
}

/** Aplica override sobre un producto del catálogo empaquetado (sin borrarlo del bundle). */
function mergeOne(p: CatalogProduct, o: ProductOverride | undefined): StoreProduct {
  // Sin override: conservar producto empaquetado; si solo hay URI, exponer imageUris
  if (!o) {
    if (isBundledSource(p.image)) return { ...p };
    const uris = isUriSource(p.image) ? [p.image.uri] : undefined;
    return uris ? { ...p, imageUris: uris } : { ...p };
  }

  const imageUris =
    o.imageUris && o.imageUris.length > 0
      ? o.imageUris
      : isUriSource(p.image)
        ? [p.image.uri]
        : undefined;

  // Primera URI del override sustituye la imagen principal en la tarjeta
  // Primera URI del override sustituye la imagen principal en la tarjeta
  const image =
    imageUris?.[0] != null
      ? { uri: imageUris[0] }
      : isBundledSource(p.image)
        ? p.image
        : p.image;

  return {
    ...p,
    nombre: o.nombre ?? p.nombre,
    categoria: o.categoria ?? p.categoria,
    precio: o.precio ?? p.precio,
    emoji: o.emoji ?? p.emoji,
    descripcion: o.descripcion ?? p.descripcion,
    descripcionAdicional: o.descripcionAdicional,
    stock: o.stock,
    image,
    imageUris,
  };
}

/** Producto creado en admin → formato StoreProduct para la tienda. */
function customToStore(c: CustomProductRecord): StoreProduct {
  const image: ImageSourcePropType =
    c.imageUris[0] != null ? { uri: c.imageUris[0] } : { uri: 'https://via.placeholder.com/400?text=Regalo' };
  return {
    id: c.id,
    nombre: c.nombre,
    categoria: c.categoria,
    precio: c.precio,
    emoji: c.emoji,
    descripcion: c.descripcion,
    descripcionAdicional: c.descripcionAdicional,
    stock: c.stock,
    archivo: `custom-${c.id}`,
    image,
    imageUris: c.imageUris.length ? c.imageUris : undefined,
    fromCustom: true,
  };
}

/** Siguiente ID libre (incluye eliminados para no reutilizar números). */
export function nextProductId(base: CatalogProduct[], data: AdminPersisted): number {
  const ids = [
    ...base.map((p) => p.id),
    ...data.customProducts.map((c) => c.id),
    ...data.deletedIds,
  ];
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

/** URIs para rellenar el formulario de edición en admin. */
export function getImageUrisForForm(product: StoreProduct, override: ProductOverride | undefined): string[] {
  if (override?.imageUris?.length) return override.imageUris;
  if (product.imageUris?.length) return product.imageUris;
  if (isUriSource(product.image)) return [product.image.uri];
  return [];
}

/** Indica si el producto ya tiene foto (empaquetada, URI o galería). */
export function catalogProductHasPhoto(product: StoreProduct): boolean {
  if (product.imageUris?.length) return true;
  if (isUriSource(product.image)) return true;
  return isBundledSource(product.image);
}
