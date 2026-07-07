// Fuente única de navegación, verticales, contacto y helpers. Header/Footer/páginas la consumen.

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Vertical extends NavItem {
  blurb: string;
}

// Nav principal. "Villa Planes" (marca), NO "Pasadías" (queda como keyword SEO).
// Empresas es un menú con submenú: Corporativo (/empresas) y Colegios (/colegios).
export const nav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Villa Planes', href: '/villa-planes' },
  { label: 'Celebraciones', href: '/celebraciones' },
  {
    label: 'Empresas',
    href: '/empresas',
    children: [
      { label: 'Corporativo', href: '/empresas' },
      { label: 'Colegios', href: '/colegios' },
    ],
  },
  { label: 'Gastronomía', href: '/gastronomia' },
  { label: 'Blog', href: '/blog' },
];

// Nav plano para el footer (sin submenús).
export const footerNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Villa Planes', href: '/villa-planes' },
  { label: 'Celebraciones', href: '/celebraciones' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Colegios', href: '/colegios' },
  { label: 'Gastronomía', href: '/gastronomia' },
  { label: 'Blog', href: '/blog' },
];

export const verticals: Vertical[] = [
  { label: 'Villa Planes', href: '/villa-planes', blurb: 'Pasadías y ecoturismo a caballo en la Sabana de Bogotá.' },
  { label: 'Celebraciones', href: '/celebraciones', blurb: 'XV, bodas, cumpleaños y reencuentros al aire libre.' },
  { label: 'Empresas', href: '/empresas', blurb: 'Integración corporativa y coaching asistido con caballos.' },
  { label: 'Colegios', href: '/colegios', blurb: 'Salidas pedagógicas que enseñan explorando la naturaleza.' },
  { label: 'Gastronomía', href: '/gastronomia', blurb: 'El arte del asado al barril y la cocina de origen.' },
];

const WA_PHONE = '573208689681';

/** Construye un enlace de WhatsApp con mensaje prellenado. */
export function wa(text = 'Quiero reservar'): string {
  return `https://api.whatsapp.com/send?phone=+${WA_PHONE}&text=${encodeURIComponent(text)}`;
}

export const contact = {
  email: 'gerencia@villa-juan.com',
  phone: '+57 320 868 9681',
  phoneHref: 'tel:+573208689681',
  whatsapp: wa('Quiero reservar'),
  location: 'Tenjo, Cundinamarca',
};

export const social = {
  facebook: 'https://www.facebook.com/ecogranjavillajuan',
  instagram: 'https://www.instagram.com/ecogranjavillajuan/',
  tiktok: 'https://www.tiktok.com/@ecogranjavillajuan',
  // LinkedIn pendiente en el doc de contenido.
};

export const visit = {
  hoursLabel: 'Sábados, domingos y festivos',
  hours: '9:30 a. m. – 6:00 p. m.',
  address: 'Vereda Guangatá, Finca Ecogranja Villa Juan',
  city: 'Tenjo, Cundinamarca',
  note: 'A 30 minutos de Bogotá',
  maps: 'https://maps.app.goo.gl/crJs98Qo8znSkXNf9',
};
