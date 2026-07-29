// Selección + optimización de las fotos del Taller de Liderazgo con Caballos.
// Los originales (51 fotos, 329 MB) NO se versionan; esto produce los masters de
// src/assets/images/empresas/coaching/ que sí van al repo y que Astro convierte a
// WebP responsive en el build.
//
// Uso: node design/optimize-coaching-photos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');

const SRC = path.join(
  ROOT,
  'src/assets/images/empresas/Fotos Taller Liderazgo con Caballos-20260729T220545Z-1-001/Fotos Taller Liderazgo con Caballos',
);
const OUT = path.join(ROOT, 'src/assets/images/empresas/coaching');

// Selección curada: recorre el taller de principio a fin (llegada → dinámicas con la
// escultura → trabajo real con el caballo → cierre) evitando los 11 retratos casi
// idénticos del original.
const PICKS = [
  ['_DSC6987.jpg', 'taller-01-circulo-inicial'],
  ['_DSC6994.jpg', 'taller-02-facilitador-escultura'],
  ['_DSC7054.jpg', 'taller-03-escultura-herraduras'],
  ['_DSC7098.jpg', 'taller-04-primer-encuentro'],
  ['_DSC7100.jpg', 'taller-05-equipo-caballo'],
  ['_DSC7151.jpg', 'taller-06-manos-confianza'],
  ['_DSC7165.jpg', 'taller-07-contacto-grupo'],
  ['_DSC7167.jpg', 'taller-08-conduciendo'],
  ['_DSC7169.jpg', 'taller-09-liderando-cuerda'],
  ['_DSC7183.jpg', 'taller-10-dinamica-antifaz'],
  ['_DSC7188.jpg', 'taller-11-facilitador-cierre'],
  ['_DSC7110.jpg', 'taller-12-retrato-caballo'],
  // Póster del video: no entra al grid.
  ['_DSC7145.jpg', 'video-poster'],
];

fs.mkdirSync(OUT, { recursive: true });
let total = 0;

for (const [file, name] of PICKS) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    console.error(`falta: ${file}`);
    continue;
  }
  const to = path.join(OUT, `${name}.jpg`);
  const info = await sharp(from)
    .rotate() // respeta la orientación EXIF antes de redimensionar
    // `inside` limita el LADO MAYOR: las verticales del set no se van a 2400 px de alto.
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(to);
  const kb = fs.statSync(to).size / 1024;
  total += kb;
  console.log(`${name}.jpg  ${info.width}x${info.height}  ${kb.toFixed(0)} KB`);
}

console.log(`\n${PICKS.length} masters · ${(total / 1024).toFixed(1)} MB en total → ${OUT}`);
