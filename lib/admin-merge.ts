import type { ImageSourcePropType } from 'react-native';

import type { AdminPersisted, CustomProductRecord, ProductOverride } from './admin-storage';
import type { CatalogProduct } from './catalog.generated';

export type StoreProduct = CatalogProduct & {
  descripcionAdicional?: string;
  stock?: number;
  fromCustom?: boolean;
  /** Todas las fotos del producto (admin); la primera es `image` */
  imageUris?: string[];
};

function isBundledSource(img: ImageSourcePropType): boolean {
  return typeof img === 'number';
}

function isUriSource(img: ImageSourcePropType): img is { uri: string } {
  return typeof img === 'object' && img !== null && 'uri' in img && typeof (img as { uri: string }).uri === 'string';
}

export function mergeCatalog(base: CatalogProduct[], data: AdminPersisted | null): StoreProduct[] {
  const persist = data ?? { overrides: {}, customProducts: [], deletedIds: [] };
  const deleted = new Set(persist.deletedIds);
  const merged = base
    .filter((p) => !deleted.has(p.id))
    .map((p) => mergeOne(p, persist.overrides[String(p.id)]));
  const customs = persist.customProducts.map(customToStore);
  return [...merged, ...customs].sort((a, b) => a.id - b.id);
}

function mergeOne(p: CatalogProduct, o: ProductOverride | undefined): StoreProduct {
  if (!o) {
    if (isBundledSource(p.image)) return { ...p };
    const uris = isUriSource(p.image) ? [p.image.uri] : undefined;
    return uris ? { ...p, imageUris: uris } : { ...p };
  }
  const imageUris =
    o.imageUris?.length ? o.imageUris : isUriSource(p.image) ? [p.image.uri] : undefined;
  const image = imageUris?.[0] != null ? { uri: imageUris[0] } : p.image;
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

export function nextProductId(base: CatalogProduct[], data: AdminPersisted): number {
  const ids = [...base.map((p) => p.id), ...data.customProducts.map((c) => c.id)];
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

export function getImageUrisForForm(product: StoreProduct, override: ProductOverride | undefined): string[] {
  if (override?.imageUris?.length) return override.imageUris;
  if (isUriSource(product.image)) return [product.image.uri];
  return [];
}
