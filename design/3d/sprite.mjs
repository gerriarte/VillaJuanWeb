// Recorta el margen transparente COMÚN a todos los frames (para que el sombrero
// no "salte" entre frames) y compone el sprite sheet.
// Uso: node sprite.mjs [--dir frames] [--cols 6] [--frame-width 480] [--quality 62] [--pad 14]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// sharp ya es dependencia del sitio (Astro): lo tomamos de ahí en vez de duplicarlo.
const require = createRequire(path.join(HERE, '../../package.json'));
const sharp = require('sharp');
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const DIR = path.join(HERE, String(arg('dir', 'frames')));
const COLS = Number(arg('cols', 6));
const FRAME_W = Number(arg('frame-width', 480));
const QUALITY = Number(arg('quality', 62));

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png')).sort();

// 1. Bounding box de alpha por frame → unión de todos.
const bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
let W = 0;
let H = 0;
for (const f of files) {
  const img = sharp(path.join(DIR, f));
  const { width, height } = await img.metadata();
  W = width;
  H = height;
  const alpha = await img.clone().extractChannel(3).raw().toBuffer();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > 8) {
        if (x < bounds.left) bounds.left = x;
        if (x > bounds.right) bounds.right = x;
        if (y < bounds.top) bounds.top = y;
        if (y > bounds.bottom) bounds.bottom = y;
      }
    }
  }
}

// 2. Caja simétrica respecto al centro del render: así el eje de giro queda
//    centrado en el frame recortado y la rotación no cabecea.
const cx = W / 2;
const cy = H / 2;
// `pad`: aire transparente dentro de la celda para que el frame vecino no asome
// por redondeo de subpíxeles al escalar el sheet.
const PAD = Number(arg('pad', 12));
const halfW = Math.ceil(Math.max(cx - bounds.left, bounds.right - cx)) + PAD;
const halfH = Math.ceil(Math.max(cy - bounds.top, bounds.bottom - cy)) + PAD;
const crop = {
  left: Math.max(0, Math.round(cx - halfW)),
  top: Math.max(0, Math.round(cy - halfH)),
  width: Math.min(W, halfW * 2),
  height: Math.min(H, halfH * 2),
};
console.log('alpha bounds:', bounds, '→ crop:', crop);

// 3. Recorte + resize a la resolución de salida.
const frameW = FRAME_W;
const frameH = Math.round((crop.height / crop.width) * frameW);
const tiles = [];
for (const f of files) {
  tiles.push(
    await sharp(path.join(DIR, f))
      .extract(crop)
      .resize(frameW, frameH, { fit: 'fill', kernel: 'lanczos3' })
      .png()
      .toBuffer()
  );
}

const rows = Math.ceil(tiles.length / COLS);
const sheet = sharp({
  create: {
    width: frameW * COLS,
    height: frameH * rows,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
}).composite(
  tiles.map((input, i) => ({
    input,
    left: (i % COLS) * frameW,
    top: Math.floor(i / COLS) * frameH,
  }))
);

const out = path.join(HERE, 'out');
fs.mkdirSync(out, { recursive: true });
const base = sheet.clone();
const variants = {
  webp: await base.clone().webp({ quality: QUALITY, alphaQuality: 90, effort: 6 }).toBuffer(),
  avif: await base.clone().avif({ quality: QUALITY, effort: 6 }).toBuffer(),
};
for (const [ext, buf] of Object.entries(variants)) {
  fs.writeFileSync(path.join(out, `sombrero-sprite.${ext}`), buf);
  console.log(`${ext}: ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log(
  JSON.stringify(
    { frames: tiles.length, cols: COLS, rows, frameW, frameH, sheetW: frameW * COLS, sheetH: frameH * rows },
    null,
    2
  )
);
