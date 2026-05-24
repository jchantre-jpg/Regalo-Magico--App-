/**
 * Actualiza imports tras reorganizar en frontend / backend / database.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/** Raíz del proyecto regalo-magico-app (carpeta padre de scripts/). */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Recorre el árbol del proyecto buscando .ts y .tsx. */
function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'assets') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

/** Pares [texto viejo, texto nuevo] tras mover carpetas frontend/backend/database. */
const replacements = [
  // frontend/components (depth 3 to root)
  ["from '../../lib/admin-storage'", "from '../../../database/admin-storage'"],
  ["from '../../lib/catalog.generated'", "from '../../../database/catalog.generated'"],
  ["from '../../lib/admin-merge'", "from '../../../backend/lib/admin-merge'"],
  ["from '../../lib/admin-config'", "from '../../../backend/lib/admin-config'"],
  ["from '../../types/store'", "from '../../../backend/types/store'"],
  ["from '../../utils/", "from '../../../backend/utils/"],
  ["from '../../constants/", "from '../../../backend/constants/"],
  // frontend/App.tsx
  ["from './hooks/", "from '../backend/hooks/"],
  ["from './types/store'", "from '../backend/types/store'"],
  // backend/hooks
  ["from '../lib/admin-storage'", "from '../../database/admin-storage'"],
  ["from '../lib/catalog.generated'", "from '../../database/catalog.generated'"],
  ["from '../styles/appStyles'", "from '../../frontend/styles/appStyles'"],
  // backend/lib
  ["from './admin-storage'", "from '../../database/admin-storage'"],
  ["from './catalog.generated'", "from '../../database/catalog.generated'"],
];

let changed = 0;
// Sustituye rutas de import en cada .ts/.tsx del proyecto
for (const file of walk(ROOT)) {
  if (file.includes('fix-imports-structure')) continue;
  let text = fs.readFileSync(file, 'utf8');
  let next = text;
  for (const [a, b] of replacements) {
    next = next.split(a).join(b);
  }
  if (next !== text) {
    fs.writeFileSync(file, next);
    changed++;
    console.log('updated', path.relative(ROOT, file));
  }
}

console.log('done, files changed:', changed);
