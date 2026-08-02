// Documentos PDF del sitio (Villa Planes + menú) — fuente única.
//
// Regla: un PDF NUNCA se enlaza como archivo suelto. Cada uno tiene su página propia
// (`/villa-planes/<slug>`, `/menu`) que lo muestra EMBEBIDO dentro del layout, con header y
// footer: el visitante lo lee, vuelve con el nav y sigue navegando sin salir del sitio.
// El archivo en crudo queda accesible solo desde los botones "abrir en pestaña nueva" y
// "descargar" de esa página (fallback para móviles que no embeben PDF).
import type { ImageMetadata } from 'astro';
import pdfTrote from '../assets/images/villa-planes/Villa_Plan_Trote_y_Galope.pdf?url';
import pdfTrocha from '../assets/images/villa-planes/Villa_Plan_Trocha_y_Galope.pdf?url';
import pdfPasoFino from '../assets/images/villa-planes/Villa_Plan_Paso_Fino.pdf?url';
import pdfMenu from '../assets/images/villa-planes/Menu_Villa_Juan_Sin_Precios.pdf?url';
import troteGalopeImg from '../assets/images/villa-planes/Trote_Galope.webp';
import trochaGalopeImg from '../assets/images/villa-planes/Trocha_Galope.webp';
import pasoFinoImg from '../assets/images/villa-planes/Paso_Fino.webp';

export interface PdfDoc {
  /** Último segmento de la URL de su página. */
  slug: string;
  title: string;
  /** URL del archivo servido (con hash de build). */
  file: string;
  /** Nombre con el que se descarga (el hash del build no se le muestra al usuario). */
  filename: string;
  /** Página propia donde se ve embebido. */
  href: string;
  /** Copy corto bajo el título + meta description de la página. */
  description: string;
  /** Mensaje prellenado del CTA de WhatsApp de esa página. */
  waText: string;
}

/** Villa Plan: además del PDF, tiene su título como gráfico Sunrise y su degradé de botón. */
export interface PlanPdf extends PdfDoc {
  img: ImageMetadata;
  grad: string;
}

// Orden del mockup: Trote, Trocha, Paso Fino.
export const planPdfs: PlanPdf[] = [
  {
    slug: 'trote-y-galope',
    title: 'Trote y Galope',
    file: pdfTrote,
    filename: 'Villa-Plan-Trote-y-Galope.pdf',
    href: '/villa-planes/trote-y-galope',
    description:
      'El plan base: espacio exclusivo, recorrido por la granja, taller de ordeño, almuerzo a la carta, GranjaFest, feria de juegos tradicionales y Show Villa Juan.',
    waText: 'Quiero cotizar el Villa Plan Trote y Galope',
    img: troteGalopeImg,
    grad: 'linear-gradient(90deg,#4ba82b 0%,#00811e 100%)',
  },
  {
    slug: 'trocha-y-galope',
    title: 'Trocha y Galope',
    file: pdfTrocha,
    filename: 'Villa-Plan-Trocha-y-Galope.pdf',
    href: '/villa-planes/trocha-y-galope',
    description:
      'Todo lo del plan Trote y Galope, más el paseo a caballo o el paseo en cuatrimoto por los senderos de la ecogranja.',
    waText: 'Quiero cotizar el Villa Plan Trocha y Galope',
    img: trochaGalopeImg,
    grad: 'linear-gradient(90deg,#e0431f 0%,#c0360d 100%)',
  },
  {
    slug: 'paso-fino',
    title: 'Paso Fino',
    file: pdfPasoFino,
    filename: 'Villa-Plan-Paso-Fino.pdf',
    href: '/villa-planes/paso-fino',
    description:
      'La experiencia completa: arranca con el desayuno de la granja e incluye todo lo demás, paseo a caballo o cuatrimoto incluido.',
    waText: 'Quiero cotizar el Villa Plan Paso Fino',
    img: pasoFinoImg,
    grad: 'linear-gradient(90deg,#f2c14e 0%,#d99323 100%)',
  },
];

export const menuPdf: PdfDoc = {
  slug: 'menu',
  title: 'Menú del restaurante campestre',
  file: pdfMenu,
  filename: 'Menu-Ecogranja-Villa-Juan.pdf',
  href: '/menu',
  description:
    'Nuestra carta de cocina campestre: carnes al barril, platos tradicionales y productos de la granja.',
  waText: 'Quiero reservar mesa en el restaurante de Villa Juan',
};

/** Busca un Villa Plan por slug (lo usa la ruta dinámica). */
export function getPlanPdf(slug: string): PlanPdf | undefined {
  return planPdfs.find((p) => p.slug === slug);
}
