// Tarjetas editables de las verticales (celebraciones, colegios, empresas…).
// Colección única `cards` en Directus, agrupada por `section`. Cada página pasa su
// semilla local como fallback, así el sitio compila aunque el CMS no responda.
import type { ImageMetadata } from 'astro';
import { directus, readItems } from './directus';

export type CardImage =
  | { kind: 'directus'; id: string | null; alt: string }
  | { kind: 'local'; asset: ImageMetadata; alt: string };

export interface Card {
  title: string;
  note?: string;
  body: string;
  imageRight: boolean;
  image: CardImage;
}

/** Tarjetas de una sección (Directus; fallback a la semilla local de la página). */
export async function getCards(section: string, seed: Card[]): Promise<Card[]> {
  if (directus) {
    try {
      const rows = await directus.request(
        readItems('cards', {
          filter: { status: { _eq: 'published' }, section: { _eq: section } },
          sort: ['sort'],
          fields: ['title', 'note', 'body', 'image', 'image_right'],
          limit: -1,
        }),
      );
      if (rows.length) {
        return rows.map((r) => ({
          title: r.title,
          note: r.note ?? undefined,
          body: r.body ?? '',
          imageRight: Boolean(r.image_right),
          image: { kind: 'directus', id: r.image, alt: r.title },
        }));
      }
    } catch (e) {
      console.warn(`[cards:${section}] Directus no disponible, usando semilla local:`, (e as Error).message);
    }
  }
  return seed;
}

/**
 * Imagen que puede venir del CMS o del repo. `local` la optimiza astro:assets en el
 * build; `directus` la sirve el CMS con transformación on-the-fly (?format=webp&width=).
 */
export type Media =
  | { kind: 'local'; asset: ImageMetadata; alt: string }
  | { kind: 'directus'; id: string; alt: string; width?: number; height?: number };

/** Foto de una galería/carrusel. */
export interface Photo {
  image: Media;
}

/** Slide del carrusel del hero. */
export interface Slide {
  image: Media;
  title: string;
  /** Si existe, el título se muestra como gráfico (con `title` de alt). */
  titleImage?: Media;
  text: string;
  cta: { label: string; href: string; newTab?: boolean };
}

/**
 * Helper: arma un Media desde la relación `image` de un item de Directus.
 * `file` puede llegar nulo aunque el tipo diga que no (un item guardado sin imagen).
 */
function fileMedia(
  file: { id: string; width: number | null; height: number | null } | null | undefined,
  alt: string,
): Media | null {
  if (!file?.id) return null;
  return { kind: 'directus', id: file.id, alt, width: file.width ?? undefined, height: file.height ?? undefined };
}

/**
 * Fotos de una galería (Directus; fallback a la semilla local).
 * Colección `gallery`, agrupada por `section` (home-galeria, empresas-coaching…).
 */
export async function getGallery(section: string, seed: Photo[]): Promise<Photo[]> {
  if (directus) {
    try {
      const rows = await directus.request(
        readItems('gallery', {
          filter: { status: { _eq: 'published' }, section: { _eq: section } },
          sort: ['sort'],
          fields: ['alt', { image: ['id', 'width', 'height'] }],
          limit: -1,
        }),
      );
      const photos = rows
        .map((r) => {
          const image = fileMedia(r.image, r.alt ?? '');
          return image ? { image } : null;
        })
        .filter((p): p is Photo => p !== null);
      if (photos.length) return photos;
    } catch (e) {
      console.warn(`[gallery:${section}] Directus no disponible, usando semilla local:`, (e as Error).message);
    }
  }
  return seed;
}

/**
 * Slides de un carrusel de hero (Directus; fallback a la semilla local).
 * Colección `slides`, agrupada por `section` (home-hero).
 */
export async function getSlides(section: string, seed: Slide[]): Promise<Slide[]> {
  if (directus) {
    try {
      const rows = await directus.request(
        readItems('slides', {
          filter: { status: { _eq: 'published' }, section: { _eq: section } },
          sort: ['sort'],
          fields: [
            'alt', 'title', 'text', 'title_image', 'cta_label', 'cta_href', 'cta_new_tab',
            { image: ['id', 'width', 'height'] },
          ],
          limit: -1,
        }),
      );
      const slides = rows
        .map((r): Slide | null => {
          const image = fileMedia(r.image, r.alt ?? r.title ?? '');
          // Un slide sin imagen o sin CTA rompería el hero: se descarta y sigue el resto.
          if (!image || !r.cta_label || !r.cta_href) return null;
          return {
            image,
            title: r.title,
            titleImage: r.title_image
              ? { kind: 'directus', id: r.title_image, alt: r.title }
              : undefined,
            text: r.text ?? '',
            cta: { label: r.cta_label, href: r.cta_href, newTab: Boolean(r.cta_new_tab) },
          };
        })
        .filter((s): s is Slide => s !== null);
      if (slides.length) return slides;
    } catch (e) {
      console.warn(`[slides:${section}] Directus no disponible, usando semilla local:`, (e as Error).message);
    }
  }
  return seed;
}
