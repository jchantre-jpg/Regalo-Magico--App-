/**
 * Inicia Expo en modo LAN para probar con Expo Go en el celular (misma Wi‑Fi).
 * Fija REACT_NATIVE_PACKAGER_HOSTNAME con la IPv4 local del PC.
 *
 * Uso: npm run start:lan
 */
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Obtiene la primera IPv4 no interna (Wi‑Fi o Ethernet). */
function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const ifaces of Object.values(nets)) {
    for (const net of ifaces ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const host = getLocalIPv4();
console.log(`\nRegalo Mágico — Expo LAN`);
console.log(`IP local para Expo Go: ${host}`);
console.log(`Asegúrate de que el celular esté en la misma red Wi‑Fi.\n`);

// -c limpia caché de Metro; REACT_NATIVE_PACKAGER_HOSTNAME fuerza la IP en el QR
const child = spawn('npx', ['expo', 'start', '--lan', '-c'], {
  cwd: APP_ROOT,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: host,
  },
});

child.on('exit', (code) => process.exit(code ?? 0));
