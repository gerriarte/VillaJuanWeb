import type { ImageMetadata } from 'astro';

/**
 * Registro drop-and-go de imágenes locales optimizables (astro:assets → AVIF/WebP, responsive, lazy).
 *
 * Cómo usar:
 *   1. Deja el archivo en `src/assets/images/<sección>/` (jpg/png/webp/avif).
 *   2. En el componente/página se referencia por nombre: img('Cumpleaños_Villa_Juan').
 *   3. El match ignora MAYÚSCULAS, acentos, espacios, guiones y extensión, así que
 *      `Cumpleaños_Villa_Juan.png`, `cumpleanos-villa-juan.webp` y `CUMPLEANOSVILLAJUAN.avif`
 *      resuelven al mismo nombre.
 *   4. Si no existe el archivo, img() devuelve undefined y el componente muestra el placeholder.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

function normalize(name: string): string {
  return name
    .normalize('NFD') // separa acentos; el filtro final los descarta
    .replace(/\.[^.]+$/, '') // quita extensión
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ''); // deja solo letras/números (elimina acentos, espacios, guiones)
}

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  const base = path.split('/').pop() ?? path;
  byName.set(normalize(base), mod.default);
}

export function img(name: string): ImageMetadata | undefined {
  return byName.get(normalize(name));
}
