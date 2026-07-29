// Genera el tile de fondo APLANADO que usa SiteBackground.
//
// Por qué: el tile original es un PNG 2000×2000 con canal alpha. WebP guarda el alpha
// SIN pérdida, así que el tile pesaba 875 KB servido (el asset más pesado del sitio, en
// todas las páginas). Como se repite en Y sobre un degradé HORIZONTAL, el degradé no
// varía con Y y se puede hornear dentro del tile: sin alpha, el mismo tile pesa 29 KB.
// Diferencia visual medida: 1,3/255 de media (imperceptible).
//
// Uso: node design/flatten-background.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');

const SRC = path.join(ROOT, 'src/assets/images/Fondo_repetitivo.png');
const OUT = path.join(ROOT, 'src/assets/images/Fondo_repetitivo_plano.webp');
const WIDTH = 1440;

// Debe coincidir con el degradé de SiteBackground.astro.
const FROM = '#99c43d';
const TO = '#0cbd35';

const tile = await sharp(SRC).resize({ width: WIDTH }).png().toBuffer();
const { height } = await sharp(tile).metadata();

const gradient = Buffer.from(
  `<svg width="${WIDTH}" height="${height}"><defs>` +
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0%" stop-color="${FROM}"/><stop offset="100%" stop-color="${TO}"/>` +
    `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

await sharp(gradient).composite([{ input: tile }]).webp({ quality: 62, effort: 6 }).toFile(OUT);

console.log(
  `${WIDTH}x${height} → ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB  ${path.relative(ROOT, OUT)}`,
);
