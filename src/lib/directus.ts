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

interface Schema {
  posts: DirectusPost[];
  cards: DirectusCard[];
}

export const directus = !directusEnabled
  ? null
  : DIRECTUS_TOKEN
    ? createDirectus<Schema>(DIRECTUS_URL!).with(rest()).with(staticToken(DIRECTUS_TOKEN))
    : createDirectus<Schema>(DIRECTUS_URL!).with(rest());

/** URL de un asset de Directus con transformación on-the-fly (webp + ancho + calidad). */
export function assetUrl(
  id: string | null | undefined,
  opts: { width?: number; quality?: number } = {},
): string {
  if (!id || !DIRECTUS_URL) return '';
  const p = new URLSearchParams({ format: 'webp', quality: String(opts.quality ?? 72) });
  if (opts.width) p.set('width', String(opts.width));
  return `${DIRECTUS_URL}/assets/${id}?${p.toString()}`;
}

export { readItems };
