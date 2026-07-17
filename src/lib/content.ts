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
