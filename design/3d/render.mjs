// Render offline de un turntable del .glb a PNGs con alpha (Chrome headless + three.js).
// Uso: node render.mjs [--model x.glb] [--frames 36] [--size 800] [--elev 20] [--out frames]
// Ver README.md. No forma parte del build del sitio.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? def : process.argv[i + 1];
};
const MODEL = path.join(HERE, String(arg('model', 'sobrero_villajuan.glb')));
const FRAMES = Number(arg('frames', 36));
const SIZE = Number(arg('size', 800));
const ELEV = Number(arg('elev', 20));
const OUT = path.join(HERE, String(arg('out', 'frames')));

if (!fs.existsSync(MODEL)) {
  console.error(`No encuentro el modelo: ${MODEL}\nPonelo en design/3d/ (no se versiona).`);
  process.exit(1);
}

// Chrome de escritorio: no descargamos un Chromium aparte.
const CHROME =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].find((p) => fs.existsSync(p));
if (!CHROME) {
  console.error('No encuentro Chrome. Seteá CHROME_PATH.');
  process.exit(1);
}

// Servidor estático: la página, el modelo y three.js desde node_modules (sin copiar nada).
const THREE_DIR = path.join(HERE, 'node_modules/three');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary' };
const resolve = (url) => {
  if (url === '/') return path.join(HERE, 'viewer.html');
  if (url === '/model.glb') return MODEL;
  if (url.startsWith('/vendor/build/')) return path.join(THREE_DIR, 'build', url.slice(14));
  if (url.startsWith('/vendor/jsm/')) return path.join(THREE_DIR, 'examples/jsm', url.slice(12));
  return null;
};
const server = http.createServer((req, res) => {
  const file = resolve(decodeURIComponent(req.url.split('?')[0]));
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  // WebGL por software: no dependemos de la GPU de la máquina.
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE });
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  page.on('requestfailed', (r) => console.error('[req failed]', r.url()));
  await page.goto(`http://127.0.0.1:${port}/?size=${SIZE}`, { waitUntil: 'load' });

  await page.waitForFunction('window.__ready === true || window.__error', { timeout: 300000 });
  const err = await page.evaluate('window.__error || null');
  if (err) throw new Error(`GLTFLoader: ${err}`);
  console.log('modelo:', await page.evaluate('window.__info'));

  await page.evaluate((e) => window.__setCamera(e), ELEV);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  for (let i = 0; i < FRAMES; i++) {
    const dataUrl = await page.evaluate((d) => window.__frame(d), (360 / FRAMES) * i);
    fs.writeFileSync(
      path.join(OUT, `frame-${String(i).padStart(2, '0')}.png`),
      Buffer.from(dataUrl.split(',')[1], 'base64'),
    );
    process.stdout.write(`\rframe ${i + 1}/${FRAMES}`);
  }
  console.log(`\nlisto → ${OUT}\nAhora: node sprite.mjs`);
} finally {
  await browser.close();
  server.close();
}
