// Fuente de artículos del blog (scaffold). Alimenta el listado y el detalle.
// TODO(post-scaffold): migrar a Directus / content collections. Las vistas leen de
// aquí, así que el cambio de fuente no debería tocar los .astro.
import type { ImageMetadata } from 'astro';

// Imágenes reutilizadas del sitio. Las fotos propias de cada post (en Drive) van luego
// en src/assets/images/blog/ con drop-and-go:
//   · "Caballos en Colombia.jpg"  → post caballos-en-colombia
//   · "Taller_de_caballos.jpg"    → post taller-de-caballos-team-building
import imgBarril from '../assets/images/villa-planes/barril1.webp';
import imgTaller from '../assets/images/villa-planes/taller.webp';
import imgCoaching from '../assets/images/home/hero_home_coaching.jpg';
import imgFuente from '../assets/images/home/fuente_caballos.jpg';
import imgVpHero from '../assets/images/villa-planes/hero.webp';

export const categories = [
  'Maestría al Barril',
  'Bienestar y Naturaleza',
  'Mundo Equino',
  'Eventos',
  'Cultura',
] as const;

export type Category = (typeof categories)[number];

/** Bloques del cuerpo del artículo (soporta subtítulos y listas). */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** Una o varias categorías (la 1.ª es la principal para el eyebrow). */
  categories: Category[];
  /** ISO (YYYY-MM-DD). Se formatea con fmtDate(). */
  date: string;
  image: ImageMetadata;
  imageAlt: string;
  body: Block[];
}

export const posts: Post[] = [
  // ── Texto real del cliente ──────────────────────────────────────────────
  {
    slug: 'taller-de-caballos-team-building',
    title: 'Por qué un taller con caballos es el mejor team building para tu equipo',
    excerpt:
      '¿Por qué conformarse con una sala de eventos? La formación asistida con caballos redefine la cohesión de equipos: comunicación genuina, liderazgo y adaptabilidad.',
    categories: ['Mundo Equino', 'Eventos', 'Bienestar y Naturaleza'],
    date: '2026-07-16',
    image: imgCoaching,
    imageAlt: 'Formación asistida con caballos para equipos en Villa Juan',
    body: [
      {
        type: 'p',
        text: 'Sacar a un equipo de su entorno habitual es el primer paso para la innovación. Pero ¿por qué conformarse con una sala de eventos tradicional cuando puedes tener un escenario natural? La formación asistida con caballos está redefiniendo cómo las empresas abordan la cohesión grupal.',
      },
      { type: 'h2', text: 'Aprendizaje experiencial inolvidable' },
      {
        type: 'p',
        text: 'Transformamos el aprendizaje en una experiencia inolvidable. Al igual que en nuestras salidas pedagógicas, los adultos también aprenden haciendo, explorando y conectándose con la naturaleza. Interactuar con un animal de 400 kilos que responde a tu lenguaje corporal exige una comunicación genuina.',
      },
      { type: 'h2', text: 'De la naturaleza a la oficina' },
      {
        type: 'p',
        text: 'Las dinámicas con caballos obligan a los equipos a trabajar unidos bajo condiciones inusuales. Esto fomenta:',
      },
      {
        type: 'ul',
        items: [
          'Resolución rápida de conflictos.',
          'Adaptabilidad ante el cambio.',
          'Liderazgo instintivo.',
        ],
      },
      { type: 'h2', text: 'Complementa el trabajo con gastronomía de origen' },
      {
        type: 'p',
        text: 'Después de una jornada de formación, no hay mejor cierre que nuestra gastronomía de origen. Comparte almuerzos corporativos con nuestro sello al barril para coronar un día de retos y trabajo en equipo.',
      },
    ],
  },
  {
    slug: 'caballos-en-colombia',
    title: 'Caballos en Colombia: descubre el Paso Fino, la Trocha y el Trote',
    excerpt:
      'Colombia es reconocida por su cultura ecuestre. Conoce las diferencias entre los tres andares más populares antes de vivir tu aventura campestre.',
    categories: ['Mundo Equino', 'Cultura'],
    date: '2026-07-15',
    image: imgVpHero,
    imageAlt: 'Caballos de paso en los senderos de la Ecogranja Villa Juan',
    body: [
      {
        type: 'p',
        text: 'Colombia es reconocida mundialmente por su cultura ecuestre. Para los amantes de la vida de campo y las experiencias auténticas, entender las diferencias entre los andares de los caballos es fundamental antes de vivir una aventura campestre.',
      },
      { type: 'h2', text: 'Los 3 andares más populares en Colombia' },
      {
        type: 'p',
        text: 'En nuestros Villa Planes ofrecemos experiencias a la medida para que conectes con estos magníficos ejemplares:',
      },
      {
        type: 'ol',
        items: [
          'Paso Fino: considerado el andar más suave del mundo. El caballo se desplaza moviendo sus patas laterales en cuatro tiempos sucesivos, creando un movimiento rápido, armónico y sin rebote para el jinete.',
          'Trocha y Galope: un andar por diagonales en cuatro tiempos. Es un movimiento más enérgico y sonoro, ideal para quienes buscan sentir la fuerza y la tradición del campo colombiano.',
          'Trote y Galope: un movimiento por diagonales en dos tiempos. Es un andar clásico, que requiere mayor compenetración entre el jinete y el animal.',
        ],
      },
      { type: 'h2', text: 'Vive el mundo equino en Tenjo' },
      {
        type: 'p',
        text: 'Ya sea que busques un plan romántico o un día de retos, a solo unos minutos de Bogotá puedes experimentar la conexión con estos nobles animales.',
      },
    ],
  },

  // ── Placeholders (marketing de muestra hasta tener más texto real) ───────
  {
    slug: 'secretos-coccion-al-barril',
    title: 'Secretos de la cocción al barril: técnica artesanal',
    excerpt:
      'Descubre por qué el barril peruano logra una jugosidad imposible en una parrilla convencional, y cómo el calor indirecto transforma cada corte.',
    categories: ['Maestría al Barril'],
    date: '2026-06-28',
    image: imgBarril,
    imageAlt: 'Costillas asándose dentro del barril en Villa Juan',
    body: [
      {
        type: 'p',
        text: 'En Ecogranja Villa Juan la cocción al barril no es una moda: es un ritual. El barril funciona como un horno vertical donde el calor del carbón vegetal envuelve la carne de forma indirecta, cocinándola lentamente durante horas.',
      },
      {
        type: 'p',
        text: 'Ese proceso pausado es el secreto. Al no exponer el corte a la llama directa, la grasa se funde poco a poco, sella los jugos en el interior y desarrolla un ahumado suave que se siente en cada bocado.',
      },
      {
        type: 'p',
        text: 'Seleccionamos cortes de alta calidad con maduración controlada para intensificar el sabor antes de que toquen el fuego. El resultado: una textura tierna y una jugosidad que difícilmente se logra en una parrilla tradicional.',
      },
    ],
  },
  {
    slug: 'el-poder-de-desconectar',
    title: 'El poder de desconectar: bienestar en la naturaleza',
    excerpt:
      'Cambiar el ruido de la ciudad por el aire fresco de la sabana no es un lujo: es una necesidad para la salud física y mental.',
    categories: ['Bienestar y Naturaleza'],
    date: '2026-06-04',
    image: imgFuente,
    imageAlt: 'Caballos junto a la fuente en la Ecogranja Villa Juan',
    body: [
      {
        type: 'p',
        text: 'Estamos en Tenjo, a 30 minutos de Bogotá, pero lo suficientemente lejos para cambiar el ruido por el aire fresco. Esa distancia justa es parte de la experiencia.',
      },
      {
        type: 'p',
        text: 'El contacto con la naturaleza reduce el estrés, mejora el ánimo y ayuda a reconectar con lo esencial. Caminar entre zonas verdes, escuchar los animales y respirar sin prisa tiene un efecto reparador comprobado.',
      },
      {
        type: 'p',
        text: 'Por eso diseñamos espacios pensados para el bienestar: lugares para pausar, compartir en familia y recordar que el descanso también es productividad.',
      },
    ],
  },
  {
    slug: 'tradiciones-campesinas-de-la-sabana',
    title: 'Tradiciones campesinas de la sabana de Bogotá',
    excerpt:
      'La vida de campo guarda saberes que vale la pena preservar: la huerta, los oficios de la granja y el sabor de lo hecho a mano.',
    categories: ['Cultura'],
    date: '2026-05-18',
    image: imgTaller,
    imageAlt: 'Taller campesino en la Ecogranja Villa Juan',
    body: [
      {
        type: 'p',
        text: 'La sabana de Bogotá tiene una herencia campesina viva: la siembra por temporadas, el cuidado de los animales y los oficios que pasan de generación en generación.',
      },
      {
        type: 'p',
        text: 'En Villa Juan rescatamos esos saberes en talleres donde niños y adultos vuelven a lo esencial: sembrar con las manos, entender los ciclos de la tierra y valorar el origen de los alimentos.',
      },
      {
        type: 'p',
        text: 'Preservar estas tradiciones no es mirar al pasado, sino darle raíces al futuro. Cada visita es una forma de mantenerlas vivas.',
      },
    ],
  },
];

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** Formatea "2026-06-28" → "28 de junio de 2026" (UTC, sin depender de ICU). */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
