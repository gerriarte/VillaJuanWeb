// Cliente de Directus (build-time). Si no hay URL/token, directus = null y las
// capas de datos caen a su contenido semilla local (el sitio compila igual).
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL as string | undefined;
// Token opcional: el blog es contenido público (lectura pública en Directus), así
// que en dev no hace falta. Si se setea uno válido, se usa (útil para prod cerrado).
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN as string | undefined;

export const directusEnabled = Boolean(DIRECTUS_URL);

export interface DirectusPost {
  id: string;
  status: string;
  slug: string;
  title: string;
  excerpt: string;
  categories: string[] | null;
  date: string;
  cover: string | null; // id del archivo en directus_files
  body: string | null; // Markdown
}

export interface DirectusCard {
  id: number;
  status: string;
  section: string;
  sort: number | null;
  title: string;
  note: string | null;
  body: string | null;
  image: string | null; // id del archivo
  image_right: boolean | null;
}

/** Archivo de Directus tal como llega al pedir `image.id`, `image.width`… */
export interface DirectusFile {
  id: string;
  width: number | null;
  height: number | null;
}

/** Foto de una galería/carrusel de fotos (home, coaching, platos). */
export interface DirectusPhoto {
  id: number;
  status: string;
  section: string;
  sort: number | null;
  alt: string;
  image: DirectusFile;
}

/** Slide del carrusel del hero: imagen + título + copy + CTA. */
export interface DirectusSlide {
  id: number;
  status: string;
  section: string;
  sort: number | null;
  alt: string;
  title: string;
  text: string | null;
  image: DirectusFile;
  title_image: string | null; // id del archivo (gráfico de título, normalmente SVG)
  cta_label: string | null;
  cta_href: string | null;
  cta_new_tab: boolean | null;
}

interface Schema {
  posts: DirectusPost[];
  cards: DirectusCard[];
  gallery: DirectusPhoto[];
  slides: DirectusSlide[];
  // Declarada para que el SDK reconozca `image` como relación y acepte pedir sus
  // campos anidados ({ image: ['id', 'width', 'height'] }).
  directus_files: DirectusFile[];
}

export const directus = !directusEnabled
  ? null
  : DIRECTUS_TOKEN
    ? createDirectus<Schema>(DIRECTUS_URL!).with(rest()).with(staticToken(DIRECTUS_TOKEN))
    : createDirectus<Schema>(DIRECTUS_URL!).with(rest());

/** URL de un asset de Directus con transformación on-the-fly (webp + ancho + calidad). */
export function assetUrl(
  id: string | null | undefined,
  opts: { width?: number; height?: number; quality?: number } = {},
): string {
  if (!id || !DIRECTUS_URL) return '';
  const p = new URLSearchParams({ format: 'webp', quality: String(opts.quality ?? 72) });
  if (opts.width) p.set('width', String(opts.width));
  if (opts.height) p.set('height', String(opts.height));
  return `${DIRECTUS_URL}/assets/${id}?${p.toString()}`;
}

/** `srcset` responsive del mismo asset (Directus transforma on-the-fly y cachea). */
export function assetSrcSet(
  id: string | null | undefined,
  widths: number[],
  quality?: number,
): string | undefined {
  if (!id || !DIRECTUS_URL) return undefined;
  return widths.map((w) => `${assetUrl(id, { width: w, quality })} ${w}w`).join(', ');
}

/** Asset SIN transformar. Para SVG/PNG con alpha: Directus no los rasteriza a webp. */
export function assetRaw(id: string | null | undefined): string {
  return id && DIRECTUS_URL ? `${DIRECTUS_URL}/assets/${id}` : '';
}

export { readItems };
