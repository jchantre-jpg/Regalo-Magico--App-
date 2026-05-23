/**
 * Arranca Expo en modo LAN y fija REACT_NATIVE_PACKAGER_HOSTNAME a la IPv4
 * de la red local (evita que Expo elija 172.x de WSL/Hyper-V y el telefono no conecte).
 * Elige un puerto libre (por defecto desde EXPO_PORT o 8085) para no bloquearse en modo no interactivo.
 */
import { spawn } from 'node:child_process';
import net from 'node:net';
import os from 'node:os';

const PREFERRED = Number(process.env.EXPO_PORT) || 8085;

function pickLanIp() {
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(nets)) {
    for (const i of nets[name] || []) {
      if (i.internal) continue;
      if (i.family !== 'IPv4' && i.family !== 4) continue;
      candidates.push(i.address);
    }
  }
  const pick = (prefix) => candidates.find((a) => a.startsWith(prefix));
  return (
    pick('192.168.') ||
    pick('10.') ||
    candidates.find((a) => !a.startsWith('172.')) ||
    candidates[0] ||
    '127.0.0.1'
  );
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.listen(port, '0.0.0.0', () => {
      s.close(() => resolve(true));
    });
  });
}

async function pickFreePort(start) {
  for (let p = start; p < start + 40; p++) {
    if (await isPortFree(p)) return p;
  }
  return start;
}

const ip = pickLanIp();
const port = await pickFreePort(PREFERRED);
const env = { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: ip };

console.log('');
console.log('>>> Expo / telefono misma Wi‑Fi: IP del packager =>', ip);
console.log('>>> En Expo Go escanea o abre: exp://' + ip + ':' + port);
console.log('>>> Si Windows bloquea el puerto, regla firewall TCP entrante ' + port);
if (port !== PREFERRED) {
  console.log('>>> Nota: puerto ' + PREFERRED + ' ocupado; usando ' + port);
}
console.log('');

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';
const child = spawn(cmd, ['expo', 'start', '--lan', '--clear', '--port', String(port)], {
  stdio: 'inherit',
  shell: isWin,
  env,
});

child.on('exit', (code) => process.exit(code ?? 0));
