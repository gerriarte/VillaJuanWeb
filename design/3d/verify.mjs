// Verificación del turntable en el sitio: scrollea la home y captura la pieza.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'verify');
fs.mkdirSync(OUT, { recursive: true });

const CHROME =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const runs = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

try {
  for (const run of runs) {
    const page = await browser.newPage();
    await page.setViewport({ width: run.width, height: run.height, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.error(`[${run.name}] page error:`, e.message));
    page.on('requestfailed', (r) => console.error(`[${run.name}] req failed:`, r.url()));
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    const report = [];
    // Recorre la sección: de "entrando por abajo" a "saliendo por arriba".
    const offsets = [0.9, 0.6, 0.35, 0.1, -0.2];
    for (const [i, k] of offsets.entries()) {
      await page.evaluate((kk) => {
        const el = document.querySelector('.sombrero-3d');
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y - window.innerHeight * kk, behavior: 'instant' });
      }, k);
      await new Promise((r) => setTimeout(r, 700));

      const state = await page.evaluate(() => {
        const el = document.querySelector('.sombrero-3d');
        const img = el.querySelector('img');
        const r = el.getBoundingClientRect();
        return {
          visibility: document.visibilityState,
          c: el.style.getPropertyValue('--c'),
          r: el.style.getPropertyValue('--r'),
          loaded: img.complete && img.naturalWidth > 0,
          src: img.currentSrc.split('/').pop(),
          // rect relativo al VIEWPORT: el recorte se hace después, con sharp,
          // para no mover el scroll (movería el frame que estamos midiendo).
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        };
      });
      report.push({ k, ...state, rect: JSON.stringify(state.rect) });
      fs.writeFileSync(path.join(OUT, `${run.name}-${i}.json`), JSON.stringify(state.rect));
      await page.screenshot({ path: path.join(OUT, `${run.name}-${i}.png`), captureBeyondViewport: false });
    }
    console.log(`\n=== ${run.name} ===`);
    console.table(report);
    await page.close();
  }
} finally {
  await browser.close();
}
