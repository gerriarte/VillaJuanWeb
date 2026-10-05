// Documentos PDF del sitio — metadatos de sus páginas.
//
// Regla: un PDF NUNCA se enlaza como archivo suelto. Cada uno tiene su página propia
// (`/villa-planes/<slug>`, `/menu`) que lo muestra EMBEBIDO dentro del layout, con header y
// footer: el visitante lo lee, vuelve con el nav y sigue navegando sin salir del sitio.
// El archivo en crudo queda accesible solo desde los botones "abrir en pestaña nueva" y
// "descargar" de esa página (fallback para móviles que no embeben PDF).
//
// Los archivos (y los planes) son editables en Directus: ver src/lib/planes.ts.

export interface PdfPage {
  title: string;
  /** Página propia donde se ve embebido. */
  href: string;
  /** Copy corto bajo el título + meta description de la página. */
  description: string;
  /** Mensaje prellenado del CTA de WhatsApp de esa página. */
  waText: string;
}

export const menuPdf: PdfPage = {
  title: 'Menú del restaurante campestre',
  href: '/menu',
  description:
    'Nuestra carta de cocina campestre: carnes al barril, platos tradicionales y productos de la granja.',
  waText: 'Quiero reservar mesa en el restaurante de Villa Juan',
};

/** Degradé del botón de un plan a partir de su color (más claro → color del plan). */
export function planGradient(color: string): string {
  return `linear-gradient(90deg, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 100%)`;
}
