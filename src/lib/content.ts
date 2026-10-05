// Tarjetas editables de las verticales (celebraciones, colegios, empresas…).
// Colección única `cards` en Directus, agrupada por `section`. Cada página pasa su
// semilla local como fallback, así el sitio compila aunque el CMS no responda.
import type { ImageMetadata } from 'astro';
import { directus, readItems, assetRaw } from './directus';

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

/** Video de una sección. Si el CMS no tiene uno publicado, la sección no se muestra. */
export interface Video {
  title: string;
  /** ID de YouTube (se reproduce con fachada: el player carga recién al hacer clic). */
  youtubeId?: string;
  /** Archivo subido al CMS (se reproduce con <video> nativo). */
  fileUrl?: string;
  /** Portada. Sin portada: miniatura de YouTube, o el primer frame del archivo. */
  poster: Media | null;
}

/**
 * ID de YouTube desde lo que pegue el cliente: el ID suelto o cualquier URL
 * (watch?v=, youtu.be/, shorts/, embed/, live/). Devuelve undefined si no se reconoce.
 */
export function youtubeId(input: string | null | undefined): string | undefined {
  const v = input?.trim();
  if (!v) return undefined;
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m?.[1];
}

type VideoRow = {
  title: string;
  youtube_url: string | null;
  video_file: string | null;
  poster: { id: string; width: number | null; height: number | null } | null;
};

function toVideo(r: VideoRow): Video | null {
  const yt = youtubeId(r.youtube_url);
  const fileUrl = r.video_file ? assetRaw(r.video_file) : undefined;
  // Un item sin video válido no se muestra (mejor nada que un reproductor roto).
  if (!yt && !fileUrl) return null;
  return { title: r.title, youtubeId: yt, fileUrl, poster: fileMedia(r.poster, '') };
}

/**
 * Videos de una sección (colección `videos`, agrupada por `section`), del más reciente
 * al más viejo. Si el CMS responde, manda el CMS: sin videos publicados devuelve [] y la
 * página omite el bloque. `seed` solo se usa si el CMS no está disponible.
 */
export async function getVideos(section: string, seed: Video[] = []): Promise<Video[]> {
  if (!directus) return seed;
  try {
    const rows = await directus.request(
      readItems('videos', {
        filter: { status: { _eq: 'published' }, section: { _eq: section } },
        sort: ['-id'],
        fields: ['title', 'youtube_url', 'video_file', { poster: ['id', 'width', 'height'] }],
        limit: -1,
      }),
    );
    return rows.map(toVideo).filter((v): v is Video => v !== null);
  } catch (e) {
    console.warn(`[videos:${section}] Directus no disponible, usando semilla local:`, (e as Error).message);
    return seed;
  }
}

/** El video más reciente de una sección, o null (la página omite el bloque). */
export async function getVideo(section: string, seed: Video | null = null): Promise<Video | null> {
  const list = await getVideos(section, seed ? [seed] : []);
  return list[0] ?? null;
}

/**
 * Banner (foto principal) de una página. Colección `banners`, una por `section`.
 * Sin banner publicado (o sin CMS) se usa la foto del repo: un hero nunca queda vacío.
 */
export async function getBanner(section: string, seed: Media): Promise<Media> {
  if (directus) {
    try {
      const rows = await directus.request(
        readItems('banners', {
          filter: { status: { _eq: 'published' }, section: { _eq: section } },
          sort: ['-id'],
          fields: ['alt', { image: ['id', 'width', 'height'] }],
          limit: 1,
        }),
      );
      const media = rows[0] ? fileMedia(rows[0].image, rows[0].alt || seed.alt) : null;
      if (media) return media;
    } catch (e) {
      console.warn(`[banners:${section}] Directus no disponible, usando semilla local:`, (e as Error).message);
    }
  }
  return seed;
}
