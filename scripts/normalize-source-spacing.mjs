/**
 * Herramienta de mantenimiento: quita líneas en blanco duplicadas en .ts/.tsx
 * y deja un espaciado legible entre bloques de imports y funciones.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
/** Carpetas/archivos que no se reformatean. */
const SKIP = new Set(['node_modules', '.expo', 'catalog.generated.ts']);

/** Lista recursiva de archivos .ts/.tsx (omite node_modules y catalog.generated). */
function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

/** Quita líneas vacías duplicadas y reagrupa bloques (imports, exports). */
function normalize(content) {
  const lines = content.split(/\r?\n/);
  const compact = lines.filter((line) => line.trim() !== '');
  if (compact.length === lines.length) return content;

  const blocks = [];
  let block = [];

  const isImport = (line) => /^\s*import\b/.test(line);
  const flush = () => {
    if (block.length) blocks.push(block);
    block = [];
  };

  for (const line of compact) {
    if (block.length === 0) {
      block.push(line);
      continue;
    }
    const prev = block[block.length - 1];
    const breakBefore =
      (isImport(line) && !isImport(prev)) ||
      (/^export\s+(default\s+)?function\b/.test(line) && !/^export/.test(prev)) ||
      (/^export\s+function\b/.test(line) && !/^export/.test(prev)) ||
      (/^function\s+createStyles/.test(line) && block.length > 3);

    if (breakBefore) {
      flush();
      block.push(line);
    } else {
      block.push(line);
    }
  }
  flush();

  return `${blocks.map((b) => b.join('\n')).join('\n\n')}\n`;
}

let changed = 0;
// Reescribe solo archivos cuyo espaciado cambió tras compactar líneas vacías
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('database' + path.sep) && rel.includes('catalog.generated')) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = normalize(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
    console.log('normalized:', rel);
  }
}
console.log(`Done. ${changed} file(s) updated.`);
