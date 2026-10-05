// Villa Planes y documentos PDF — editables en Directus, con semilla local.
//
// · `planes`         → columnas de la tabla (nombre, horario, precios, color) + PDF del plan.
// · `plan_servicios` → filas de la tabla: servicio + en qué planes está incluido.
// · `documentos`     → PDFs sueltos del sitio (hoy: `menu`).
//
// Los PDF del CMS NO se enlazan a admin.villa-juan.com: el endpoint src/pages/pdf/[name].ts
// los copia al sitio en el build (mismo origen → el <object> del visor los embebe sin
// problemas de CORS/frame-ancestors, y la URL es nuestra: /pdf/villa-plan-trote.pdf).
import { directus, readItems } from './directus';
import pdfTroteLocal from '../assets/images/villa-planes/Villa_Plan_Trote_y_Galope.pdf?url';
import pdfTrochaLocal from '../assets/images/villa-planes/Villa_Plan_Trocha_y_Galope.pdf?url';
import pdfPasoFinoLocal from '../assets/images/villa-planes/Villa_Plan_Paso_Fino.pdf?url';
import pdfMenuLocal from '../assets/images/villa-planes/Menu_Villa_Juan_Sin_Precios.pdf?url';

export interface PdfRef {
  /** URL servida por el sitio (mismo origen). */
  url: string;
  /** Nombre con el que se descarga. */
  filename: string;
  /** Si viene del CMS: id del archivo (lo usa el endpoint que lo copia en el build). */
  cmsId?: string;
}

export interface Plan {
  slug: string;
  name: string;
  hours: string;
  priceAdult: number | null;
  priceChild: number | null;
  /** Color del plan (título de columna, ✓/✗ y botón). Oscuro: contraste AA sobre claro. */
  color: string;
  description: string;
  pdf?: PdfRef;
  /** Página propia con el PDF embebido (solo si hay PDF). */
  href?: string;
  waText: string;
}

export interface Servicio {
  name: string;
  note?: string;
  /** Slugs de los planes que lo incluyen. */
  planes: string[];
}

const pdfFilename = (name: string) =>
  `Villa-Plan-${name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}.pdf`;

function finishPlan(p: Omit<Plan, 'href' | 'waText'>): Plan {
  return {
    ...p,
    href: p.pdf ? `/villa-planes/${p.slug}` : undefined,
    waText: `Quiero cotizar el Villa Plan ${p.name}`,
  };
}

// ── Semilla: lo que había en el código (se usa si el CMS no responde) ──
// Los PDF locales son los de la versión anterior de los planes (Trote y Galope / Trocha
// y Galope / Paso Fino); Galope no tiene PDF todavía.
const planesSeed: Plan[] = [
  { slug: 'trote', name: 'Trote', hours: '11:00 a.m. – 6:00 p.m.', priceAdult: 100000, priceChild: 90000, color: '#00811e',
    description: 'Espacio exclusivo, recorrido por la granja, taller de ordeño, almuerzo a la carta, feria de juegos tradicionales, Show Villa Juan y Rodeo 360.',
    pdf: { url: pdfTroteLocal, filename: pdfFilename('Trote') } },
  { slug: 'trocha', name: 'Trocha', hours: '11:00 a.m. – 6:00 p.m.', priceAdult: 120000, priceChild: 110000, color: '#c0360d',
    description: 'Todo lo del plan Trote, más el paseo a caballo.',
    pdf: { url: pdfTrochaLocal, filename: pdfFilename('Trocha') } },
  { slug: 'galope', name: 'Galope', hours: '9:30 a.m. – 6:00 p.m.', priceAdult: 130000, priceChild: 120000, color: '#1d5fa8',
    description: 'Llegas desde temprano: refrigerio incluido, paseo a caballo y todo lo del plan Trocha.' },
  { slug: 'paso-fino', name: 'Paso Fino', hours: '9:30 a.m. – 6:00 p.m.', priceAdult: 150000, priceChild: 140000, color: '#9a6a0e',
    description: 'La experiencia completa: arranca con el desayuno de la granja e incluye todo lo demás.',
    pdf: { url: pdfPasoFinoLocal, filename: pdfFilename('Paso Fino') } },
].map(finishPlan);

const TODOS = ['trote', 'trocha', 'galope', 'paso-fino'];
const serviciosSeed: Servicio[] = [
  { name: 'Desayuno de la granja', planes: ['paso-fino'] },
  { name: 'Refrigerio incluido', planes: ['galope', 'paso-fino'] },
  { name: 'Espacio exclusivo', planes: TODOS },
  { name: 'Recorrido granja', note: '1 hora con guía', planes: TODOS },
  { name: 'Taller de ordeño', planes: TODOS },
  { name: 'Almuerzo a la carta', note: 'Puedes elegir el plato que más te guste', planes: TODOS },
  { name: 'Feria de juegos tradicionales', planes: TODOS },
  { name: 'Show Villa Juan', planes: TODOS },
  { name: 'Rodeo 360', note: 'Museo Equino', planes: TODOS },
  { name: 'Paseo a caballo', planes: ['trocha', 'galope', 'paso-fino'] },
];

const menuSeed: PdfRef = { url: pdfMenuLocal, filename: 'Menu-Ecogranja-Villa-Juan.pdf' };

/** Planes publicados, en el orden del CMS (fallback: semilla). Cacheado por build. */
let planesCache: Promise<Plan[]> | undefined;
export function getPlanes(): Promise<Plan[]> {
  planesCache ??= (async () => {
    if (directus) {
      try {
        const rows = await directus.request(
          readItems('planes', {
            filter: { status: { _eq: 'published' } },
            sort: ['sort'],
            fields: ['slug', 'name', 'hours', 'price_adult', 'price_child', 'color', 'description', 'pdf'],
            limit: -1,
          }),
        );
        if (rows.length) {
          return rows.map((r) =>
            finishPlan({
              slug: r.slug,
              name: r.name,
              hours: r.hours ?? '',
              priceAdult: r.price_adult,
              priceChild: r.price_child,
              color: r.color || '#00811e',
              description: r.description ?? '',
              pdf: r.pdf
                ? { url: `/pdf/villa-plan-${r.slug}.pdf`, filename: pdfFilename(r.name), cmsId: r.pdf }
                : undefined,
            }),
          );
        }
      } catch (e) {
        console.warn('[planes] Directus no disponible, usando semilla local:', (e as Error).message);
      }
    }
    return planesSeed;
  })();
  return planesCache;
}

/** Filas de la tabla comparativa (fallback: semilla). */
export async function getServicios(): Promise<Servicio[]> {
  if (directus) {
    try {
      const rows = await directus.request(
        readItems('plan_servicios', {
          filter: { status: { _eq: 'published' } },
          sort: ['sort'],
          fields: ['name', 'note', 'planes'],
          limit: -1,
        }),
      );
      if (rows.length) return rows.map((r) => ({ name: r.name, note: r.note ?? undefined, planes: r.planes ?? [] }));
    } catch (e) {
      console.warn('[plan_servicios] Directus no disponible, usando semilla local:', (e as Error).message);
    }
  }
  return serviciosSeed;
}

/** PDF del menú (documentos.key = "menu"; fallback: el del repo). Cacheado por build. */
let menuCache: Promise<PdfRef> | undefined;
export function getMenuPdf(): Promise<PdfRef> {
  menuCache ??= (async () => {
    if (directus) {
      try {
        const rows = await directus.request(
          readItems('documentos', { filter: { key: { _eq: 'menu' } }, fields: ['file'], limit: 1 }),
        );
        const id = rows[0]?.file;
        if (id) return { url: '/pdf/menu.pdf', filename: menuSeed.filename, cmsId: id };
      } catch (e) {
        console.warn('[documentos] Directus no disponible, usando el menú del repo:', (e as Error).message);
      }
    }
    return menuSeed;
  })();
  return menuCache;
}

/** "$ 100.000" (formato colombiano). */
export function formatPrice(n: number | null): string {
  return n == null ? '—' : `$ ${new Intl.NumberFormat('es-CO').format(n)}`;
}
