/**
 * 1. Lee metadatos de la tienda web (regalo-magico/src/data/catalog.ts)
 * 2. Copia cada imagen a assets/catalog/p{id}.ext
 * 3. Genera lib/catalog.generated.ts con require() + títulos/descripciones reales
 *
 * Ejecutar: npm run generate-catalog
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const IMAGENES_DIR = path.join(APP_ROOT, '..', 'regalo-magico', 'public', 'imagenes');
const WEB_CATALOG_TS = path.join(APP_ROOT, '..', 'regalo-magico', 'src', 'data', 'catalog.ts');
const ASSETS_DIR = path.join(APP_ROOT, 'assets', 'catalog');
const OUT_FILE = path.join(APP_ROOT, 'database', 'catalog.generated.ts');
const OVERRIDES_FILE = path.join(APP_ROOT, 'database', 'product-copy-overrides.json');

const REMOTE_IMAGE_BASE = 'https://ele5-6.apolobyte.top/imagenes';
const EXT_RE = /\.(jpe?g|png|webp|avif)$/i;
const VALID_CATS = new Set(['desayunos', 'flores', 'chocolates', 'peluches', 'globos', 'personalizados']);

function loadOverrides() {
  if (!fs.existsSync(OVERRIDES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function normKey(name) {
  return name.trim().toLowerCase();
}

/** Parsea PRODUCTOS desde catalog.ts de la web (sin dependencias TS). */
function parseWebCatalog() {
  if (!fs.existsSync(WEB_CATALOG_TS)) {
    console.warn('No se encontró catalog.ts web:', WEB_CATALOG_TS);
    return [];
  }
  const text = fs.readFileSync(WEB_CATALOG_TS, 'utf8');
  const start = text.indexOf('export const PRODUCTOS = [');
  const end = text.indexOf('] satisfies', start);
  if (start < 0 || end < 0) return [];

  const block = text.slice(start, end);
  const chunks = block.split(/\n  \{ id: /).slice(1);
  const products = [];

  for (const chunk of chunks) {
    const body = `{ id: ${chunk}`;
    const id = Number(/id:\s*(\d+)/.exec(body)?.[1]);
    const archivo = /fotos:\s*\[\s*['"]\/imagenes\/([^'"]+)['"]\s*\]/.exec(body)?.[1];
    if (!id || !archivo) continue;

    const nombre =
      /nombre:\s*'((?:\\'|[^'])*)'/s.exec(body)?.[1]?.replace(/\\'/g, "'") ??
      /nombre:\s*`([^`]*)`/s.exec(body)?.[1] ??
      `Producto ${id}`;

    const categoria = /categoria:\s*'([^']+)'/.exec(body)?.[1] ?? 'personalizados';
    const precio = Number(/precio:\s*(\d+)/.exec(body)?.[1] ?? 45000);
    const emoji = /emoji:\s*'([^']*)'/.exec(body)?.[1] ?? emojiFor(categoria);

    let descripcion = '';
    const descTick = body.indexOf('descripcion: `');
    if (descTick >= 0) {
      const from = descTick + 'descripcion: `'.length;
      const to = body.indexOf('`,', from);
      descripcion = (to >= 0 ? body.slice(from, to) : body.slice(from, body.lastIndexOf('`'))).trim().replace(/\r\n/g, '\n');
    } else {
      descripcion =
        /descripcion:\s*'((?:\\'|[^'])*)'/s.exec(body)?.[1]?.replace(/\\'/g, "'").replace(/\r\n/g, '\n') ??
        /descripcion:\s*"((?:\\"|[^"])*)"/s.exec(body)?.[1] ??
        '';
    }

    products.push({ id, nombre, categoria, precio, emoji, descripcion, archivo });
  }

  return products;
}

function guessCategory(filename) {
  const f = filename.toLowerCase();
  if (/desayuno|desayun|caf[eé]|bandeja|taza|mug|pap[aá]|father|padre/.test(f)) return 'desayunos';
  if (/flor|ramo|rosas|girasol|gerbera|arreglo|bouquet|florer|jade|casablanca|tulip|lilium|hortensia|lisianthus|orqu[ií]dea/.test(f)) return 'flores';
  if (/chocolate|bomb[oó]n|kinder|choco|creme|bombones/.test(f)) return 'chocolates';
  if (/peluche|oso|osito|teddy|bear|pareja/.test(f)) return 'peluches';
  if (/globo|burbuja|balloon/.test(f)) return 'globos';
  if (/ancheta|canasta|cesta|sorpresa/.test(f)) return 'personalizados';
  return 'personalizados';
}

function emojiFor(cat) {
  const m = {
    desayunos: '🍳',
    flores: '🌸',
    chocolates: '🍫',
    peluches: '🧸',
    globos: '🎈',
    personalizados: '✨',
  };
  return m[cat] ?? '🎁';
}

function titleCaseWords(s) {
  return s
    .split(/\s+/)
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ')
    .trim();
}

function stripNoiseFromBase(base) {
  return base
    .replace(/\b(scaled|min|11zon|hdr|copy|249x9|webp|jpeg|jpg)\b/gi, '')
    .replace(/\b\d{3,4}x\d{3,4}\b/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isHashLike(s) {
  const t = s.replace(/\s/g, '');
  return /^[a-f0-9]{14,}$/i.test(t);
}

function isOnlyDigits(s) {
  return /^\d{1,5}$/.test(s.trim());
}

function prettyName(file, id, categoria, overrides) {
  const o = overrides[file];
  if (o?.nombre) return o.nombre.length > 85 ? `${o.nombre.slice(0, 82)}…` : o.nombre;

  const baseRaw = file.replace(/\.[^.]+$/i, '');
  let base = stripNoiseFromBase(baseRaw);
  const firstPart = base.split(/\s*\(/)[0].trim();

  if (isHashLike(firstPart) || isOnlyDigits(firstPart)) {
    const labels = {
      desayunos: 'Desayuno o bandeja',
      flores: 'Arreglo floral',
      chocolates: 'Chocolates o bombones',
      peluches: 'Detalle con peluche',
      globos: 'Globos y decoración',
      personalizados: 'Ancheta o regalo sorpresa',
    };
    return `${labels[categoria] || 'Regalo'} · ref. ${id}`;
  }

  if (/^img\s/i.test(base)) {
    const cleaned = base
      .replace(/^img\s+/i, '')
      .replace(/\b(scaled|min|11zon)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length >= 3 && !isHashLike(cleaned.replace(/[-\s]/g, ''))) {
      const t = titleCaseWords(cleaned);
      return t.length > 52 ? `${t.slice(0, 50)}…` : t;
    }
    return `Foto catálogo · ref. ${id}`;
  }

  let t = titleCaseWords(firstPart);
  t = t.replace(/\s+/g, ' ');
  if (t.length > 52) t = `${t.slice(0, 50)}…`;
  return t || `Producto · ref. ${id}`;
}

function prettyDescription(file, categoria, overrides) {
  const o = overrides[file];
  if (o?.descripcion) return o.descripcion;

  const templates = {
    flores:
      'Arreglo floral según la foto. Flores y tonos pueden variar según temporada y stock. Escríbenos por WhatsApp con la referencia para confirmar detalles y precio.',
    desayunos:
      'Desayuno o bandeja sorpresa según la foto. Ingredientes y presentación pueden variar según disponibilidad. Coordina horario y mensaje por WhatsApp.',
    chocolates:
      'Caja o selección de chocolates según la foto. Sabores y marcas sujetos a stock — consúltanos por WhatsApp.',
    peluches:
      'Peluche u osito según la foto. Modelo, tamaño y color según stock disponible.',
    globos:
      'Globos o decoración según la foto. Colores y diseños según disponibilidad.',
    personalizados:
      'Composición tipo ancheta, canasta o caja regalo según la foto. Piezas según stock en tienda. Pregunta por el contenido exacto por WhatsApp.',
  };
  return templates[categoria] || templates.personalizados;
}

function assetFileName(id, originalFile) {
  let ext = path.extname(originalFile).toLowerCase() || '.jpg';
  if (ext === '.avif') ext = '.jpg';
  return `p${id}${ext}`;
}

function buildDiskIndex(files) {
  const byKey = new Map();
  for (const f of files) {
    byKey.set(normKey(f), f);
  }
  return byKey;
}

function applyOverrides(entry, overrides, diskFile) {
  const o = overrides[diskFile];
  if (!o) return entry;
  return {
    ...entry,
    nombre: o.nombre ?? entry.nombre,
    descripcion: o.descripcion ?? entry.descripcion,
    categoria: o.categoria && VALID_CATS.has(o.categoria) ? o.categoria : entry.categoria,
    emoji: entry.emoji,
  };
}

async function convertToJpeg(src, dest) {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(src).jpeg({ quality: 90 }).toFile(dest);
    return true;
  } catch {
    fs.copyFileSync(src, dest);
    return false;
  }
}

async function syncAssetsDir(entries) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const keep = new Set(entries.map((e) => assetFileName(e.id, e.diskFile)));

  for (const name of fs.readdirSync(ASSETS_DIR)) {
    if (!keep.has(name)) {
      fs.unlinkSync(path.join(ASSETS_DIR, name));
    }
  }

  let convertedAvif = 0;
  let mismatches = 0;

  for (const entry of entries) {
    const destName = assetFileName(entry.id, entry.diskFile);
    const dest = path.join(ASSETS_DIR, destName);
    const src = path.join(IMAGENES_DIR, entry.diskFile);
    const srcExt = path.extname(entry.diskFile).toLowerCase();

    if (srcExt === '.avif') {
      const ok = await convertToJpeg(src, dest);
      if (ok) convertedAvif += 1;
    } else {
      fs.copyFileSync(src, dest);
      const srcSize = fs.statSync(src).size;
      const destSize = fs.statSync(dest).size;
      if (srcSize !== destSize) {
        mismatches += 1;
        fs.copyFileSync(src, dest);
      }
    }
  }

  if (convertedAvif > 0) console.log('AVIF → JPEG:', convertedAvif);
  if (mismatches > 0) console.warn('Re-copiados por tamaño distinto:', mismatches);
}

function buildCatalogEntries(files, webProducts, overrides) {
  const diskIndex = buildDiskIndex(files);
  const usedFiles = new Set();
  const entries = [];

  for (const web of webProducts) {
    const diskFile = diskIndex.get(normKey(web.archivo));
    if (!diskFile) {
      console.warn('Web sin archivo en disco:', web.archivo, `(id ${web.id})`);
      continue;
    }
    usedFiles.add(diskFile);
    entries.push(
      applyOverrides(
        {
          id: web.id,
          diskFile,
          archivo: diskFile,
          nombre: web.nombre,
          categoria: VALID_CATS.has(web.categoria) ? web.categoria : 'personalizados',
          precio: web.precio,
          emoji: web.emoji || emojiFor(web.categoria),
          descripcion: web.descripcion || prettyDescription(diskFile, web.categoria, overrides),
          fromWeb: true,
        },
        overrides,
        diskFile
      )
    );
  }

  const maxWebId = entries.length ? Math.max(...entries.map((e) => e.id)) : 0;
  let nextId = maxWebId + 1;

  const extraFiles = files.filter((f) => !usedFiles.has(f)).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));

  for (const diskFile of extraFiles) {
    let categoria = guessCategory(diskFile);
    const ovr = overrides[diskFile];
    if (ovr?.categoria && VALID_CATS.has(ovr.categoria)) categoria = ovr.categoria;

    while (entries.some((e) => e.id === nextId)) nextId += 1;

    entries.push(
      applyOverrides(
        {
          id: nextId++,
          diskFile,
          archivo: diskFile,
          nombre: prettyName(diskFile, nextId - 1, categoria, overrides),
          categoria,
          precio: 45000,
          emoji: emojiFor(categoria),
          descripcion: prettyDescription(diskFile, categoria, overrides),
          fromWeb: false,
        },
        overrides,
        diskFile
      )
    );
  }

  entries.sort((a, b) => a.id - b.id);
  return entries;
}

async function main() {
  const overrides = loadOverrides();

  if (!fs.existsSync(IMAGENES_DIR)) {
    console.error('No existe la carpeta:', IMAGENES_DIR);
    process.exit(1);
  }

  const webProducts = parseWebCatalog();
  console.log('Productos web (catalog.ts):', webProducts.length);

  const files = fs
    .readdirSync(IMAGENES_DIR)
    .filter((f) => EXT_RE.test(f))
    .filter((f) => !f.toLowerCase().endsWith('.crdownload'));

  const entries = buildCatalogEntries(files, webProducts, overrides);
  const webCount = entries.filter((e) => e.fromWeb).length;
  console.log('Copiando', entries.length, 'imágenes a assets/catalog/ …', `(${webCount} con datos de la web)`);
  await syncAssetsDir(entries);

  const lines = [
    '/**',
    ' * Generado por scripts/generate-catalog.mjs — no editar a mano.',
    ` * ${entries.length} productos · ${webCount} alineados con regalo-magico/src/data/catalog.ts`,
    ' * Imágenes empaquetadas en assets/catalog/ (sin depender de internet).',
    ' */',
    "import type { ImageSourcePropType } from 'react-native';",
    '',
    'export type CatalogProduct = {',
    '  id: number;',
    '  nombre: string;',
    '  categoria: string;',
    '  precio: number;',
    '  emoji: string;',
    '  descripcion: string;',
    '  archivo: string;',
    '  image: ImageSourcePropType;',
    '};',
    '',
    `export const CATALOG_IMAGE_BASE = ${JSON.stringify(REMOTE_IMAGE_BASE)} as const;`,
    '',
    'export const PRODUCTOS: CatalogProduct[] = [',
  ];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const assetName = assetFileName(e.id, e.diskFile);
    const requirePath = `../assets/catalog/${assetName}`;
    const row =
      '  {' +
      ` id: ${e.id},` +
      ` nombre: ${JSON.stringify(e.nombre)},` +
      ` categoria: ${JSON.stringify(e.categoria)},` +
      ` precio: ${e.precio},` +
      ` emoji: ${JSON.stringify(e.emoji)},` +
      ` descripcion: ${JSON.stringify(e.descripcion)},` +
      ` archivo: ${JSON.stringify(e.archivo)},` +
      ` image: require(${JSON.stringify(requirePath)})` +
      ' }' +
      (i < entries.length - 1 ? ',' : '');
    lines.push(row);
  }

  lines.push('];', '');
  fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
  console.log('OK:', OUT_FILE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
