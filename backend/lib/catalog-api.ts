/**
 * Cliente HTTP del catálogo remoto.
 * Normaliza distintos formatos JSON del API a CatalogProduct[].
 */
import type { CatalogProduct } from '../../database/catalog.generated';

/** Extrae string no vacío de campos JSON heterogéneos del API. */
function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Acepta foto como string, array o alias (fotos, imagen, image). */
function normalizeFotoPaths(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(asString).filter((x): x is string => !!x);
  }
  const one = asString(raw);
  return one ? [one] : [];
}

/** Convierte ruta relativa o URL en { archivo, uri } listo para Image. */
function toAbsoluteUri(fotoPath: string, imageBase: string): { archivo: string; uri: string } {
  const archivo = fotoPath.replace(/^.*[/\\]/, '');
  if (fotoPath.startsWith('http://') || fotoPath.startsWith('https://')) {
    return { archivo, uri: fotoPath };
  }
  const base = imageBase.replace(/\/$/, '');
  const encoded = encodeURIComponent(decodeURIComponent(archivo));
  return { archivo, uri: `${base}/${encoded}` };
}

/**
 * Descarga productos del API y los normaliza al tipo CatalogProduct de la app.
 * Omite filas sin imagen.
 */
export async function fetchCatalogProducts(apiBase: string, imageBase: string): Promise<CatalogProduct[]> {
  const res = await fetch(apiBase);
  if (!res.ok) throw new Error(`Catalog API ${res.status}`);

  const data = (await res.json()) as unknown;
  // El API puede devolver [] directo o { productos: [] }
  const rows = Array.isArray(data)
    ? data
    : Array.isArray((data as { productos?: unknown }).productos)
      ? (data as { productos: unknown[] }).productos
      : [];

  const out: CatalogProduct[] = [];
  let id = 1;

  // Normalizar cada fila del JSON a CatalogProduct (omitir sin foto)
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const fotos = normalizeFotoPaths(r.foto ?? r.fotos ?? r.imagen ?? r.image);
    if (fotos.length === 0) continue;

    const { archivo, uri } = toAbsoluteUri(fotos[0], imageBase);
    const nombre = asString(r.nombre) ?? asString(r.name) ?? archivo;
    const categoria = asString(r.categoria) ?? asString(r.category) ?? 'personalizados';
    const precio = typeof r.precio === 'number' ? r.precio : typeof r.price === 'number' ? r.price : 45000;
    const descripcion = asString(r.descripcion) ?? asString(r.description) ?? '';

    out.push({
      id: typeof r.id === 'number' ? r.id : id++,
      nombre,
      categoria,
      precio,
      emoji: asString(r.emoji) ?? '✨',
      descripcion,
      archivo,
      image: { uri },
    });
  }

  return out;
}
