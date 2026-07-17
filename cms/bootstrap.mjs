// Bootstrap del CMS: crea la colección `posts`, habilita lectura pública, sube las
// portadas y siembra los artículos reales. Idempotente (no duplica).
//   docker compose up -d   &&   node --env-file=.env cms/bootstrap.mjs
import { readFile } from 'node:fs/promises';

const URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

let token = '';
async function api(path, { method = 'GET', body, form } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  let payload = form;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${URL}${path}`, { method, headers, body: payload });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return json.data;
}

async function login() {
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error('login falló: ' + (await res.text()));
  token = (await res.json()).data.access_token;
}

async function collectionExists(name) {
  try {
    await api(`/collections/${name}`);
    return true;
  } catch {
    return false;
  }
}

async function createSchema() {
  console.log('· creando colección posts…');
  await api('/collections', {
    method: 'POST',
    body: {
      collection: 'posts',
      meta: { icon: 'article', note: 'Artículos del blog', sort_field: 'sort' },
      schema: {},
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: { hidden: true, interface: 'input', readonly: true },
          schema: { is_primary_key: true, has_auto_increment: true },
        },
      ],
    },
  });

  const fields = [
    { field: 'status', type: 'string', schema: { default_value: 'published' },
      meta: { interface: 'select-dropdown', width: 'half', display: 'labels',
        options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } } },
    { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } },
    { field: 'title', type: 'string', meta: { interface: 'input', width: 'full', required: true } },
    { field: 'slug', type: 'string', schema: { is_unique: true },
      meta: { interface: 'input', width: 'half', options: { slug: true }, note: 'URL: /blog/<slug>' } },
    { field: 'date', type: 'date', meta: { interface: 'datetime', width: 'half' } },
    { field: 'categories', type: 'json',
      meta: { interface: 'tags', width: 'full', special: ['cast-json'],
        options: { presets: ['Maestría al Barril', 'Bienestar y Naturaleza', 'Mundo Equino', 'Eventos', 'Cultura'] } } },
    { field: 'excerpt', type: 'text', meta: { interface: 'input-multiline', width: 'full', note: 'Resumen para las tarjetas' } },
    { field: 'cover', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full', note: 'Portada' } },
    { field: 'body', type: 'text', meta: { interface: 'input-rich-text-md', width: 'full', note: 'Cuerpo en Markdown' } },
  ];
  for (const f of fields) {
    console.log(`  · campo ${f.field}`);
    await api('/fields/posts', { method: 'POST', body: f });
  }

  console.log('· relación cover → directus_files');
  await api('/relations', {
    method: 'POST',
    body: { collection: 'posts', field: 'cover', related_collection: 'directus_files' },
  });
}

async function publicRead() {
  const policies = await api('/policies?fields[]=id&fields[]=name');
  const pub = policies.find((p) => p.name === '$t:public_label');
  if (!pub) throw new Error('no encontré la policy pública');
  const existing = await api(`/permissions?filter[policy][_eq]=${pub.id}`).catch(() => []);
  const has = (coll) => existing.some?.((p) => p.collection === coll && p.action === 'read');
  if (!has('posts')) {
    console.log('· lectura pública: posts (publicados)');
    await api('/permissions', { method: 'POST', body: {
      policy: pub.id, collection: 'posts', action: 'read', fields: ['*'], permissions: { status: { _eq: 'published' } } } });
  }
  if (!has('directus_files')) {
    console.log('· lectura pública: directus_files (assets)');
    await api('/permissions', { method: 'POST', body: {
      policy: pub.id, collection: 'directus_files', action: 'read', fields: ['*'], permissions: {} } });
  }
  if (!has('cards')) {
    console.log('· lectura pública: cards (publicadas)');
    await api('/permissions', { method: 'POST', body: {
      policy: pub.id, collection: 'cards', action: 'read', fields: ['*'], permissions: { status: { _eq: 'published' } } } });
  }
}

async function createCardsSchema() {
  console.log('· creando colección cards…');
  await api('/collections', {
    method: 'POST',
    body: {
      collection: 'cards',
      meta: { icon: 'dashboard', note: 'Tarjetas editables de las verticales', sort_field: 'sort' },
      schema: {},
      fields: [
        { field: 'id', type: 'integer', meta: { hidden: true, readonly: true },
          schema: { is_primary_key: true, has_auto_increment: true } },
      ],
    },
  });
  const fields = [
    { field: 'status', type: 'string', schema: { default_value: 'published' },
      meta: { interface: 'select-dropdown', width: 'half', display: 'labels',
        options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } } },
    { field: 'section', type: 'string',
      meta: { interface: 'select-dropdown', width: 'half', note: 'A qué página/bloque pertenece',
        options: { choices: SECTION_CHOICES } } },
    { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } },
    { field: 'title', type: 'string', meta: { interface: 'input', width: 'full', required: true } },
    { field: 'note', type: 'string', meta: { interface: 'input', width: 'full', note: 'Aclaración opcional (ej. "Para grupos de 10…")' } },
    { field: 'body', type: 'text', meta: { interface: 'input-multiline', width: 'full' } },
    { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full' } },
    { field: 'image_right', type: 'boolean', schema: { default_value: false },
      meta: { interface: 'boolean', width: 'half', note: 'Imagen a la derecha (layout alternado)' } },
  ];
  for (const f of fields) {
    console.log(`  · campo ${f.field}`);
    await api('/fields/cards', { method: 'POST', body: f });
  }
  console.log('· relación image → directus_files');
  await api('/relations', { method: 'POST', body: { collection: 'cards', field: 'image', related_collection: 'directus_files' } });
}

const SECTION_CHOICES = [
  { text: 'Celebraciones', value: 'celebraciones' },
  { text: 'Colegios · talleres', value: 'colegios-talleres' },
  { text: 'Empresas · celebraciones', value: 'empresas-celebraciones' },
  { text: 'Empresas · experiencias', value: 'empresas-experiencias' },
  { text: 'Empresas · beneficios', value: 'empresas-beneficios' },
  { text: 'Empresas · bienestar', value: 'empresas-bienestar' },
  { text: 'Villa Planes · barril', value: 'villaplanes-barril' },
];

// Mantiene actualizadas las opciones del dropdown `section` (para instancias ya creadas).
async function ensureSectionChoices() {
  await api('/fields/cards/section', { method: 'PATCH', body: {
    meta: { options: { choices: SECTION_CHOICES } } } }).catch(() => {});
}

async function seedCards() {
  const existing = await api('/items/cards?fields[]=section&fields[]=title&limit=-1').catch(() => []);
  const have = new Set((existing || []).map((c) => `${c.section}|${c.title}`));
  for (const [i, c] of CARDS.entries()) {
    if (have.has(`${c.section}|${c.title}`)) continue;
    console.log(`· card: ${c.section} / ${c.title}`);
    const imgId = await uploadImage(c.image, c.title);
    await api('/items/cards', { method: 'POST', body: {
      status: 'published', section: c.section, sort: i + 1, title: c.title,
      note: c.note ?? null, body: c.body, image: imgId, image_right: !!c.imageRight } });
  }
}

const CARDS = [
  // ── Celebraciones ──
  { section: 'celebraciones', title: 'Cumpleaños', note: 'Para grupos de 10 personas en adelante*', imageRight: true,
    image: 'src/assets/images/celebraciones/Cumpleaños_Villa_Juan.jpg',
    body: 'Celebra tu cumpleaños en Ecogranja Villa Juan y vive una experiencia única rodeada de naturaleza, diversión y momentos inolvidables. Disfruta de amplios espacios al aire libre, ideales para compartir con familiares y amigos, y aprovecha nuestras promociones especiales: recibe la torta para todo el grupo y la decoración del espacio completamente gratis, o elige el pasadía gratuito para el cumpleañero. Todo en un entorno campestre perfecto para celebrar, disfrutar y crear recuerdos especiales.' },
  { section: 'celebraciones', title: 'XV Años y Grados', imageRight: false,
    image: 'src/assets/images/celebraciones/xvanos_image.png',
    body: 'El lugar perfecto para una celebración vibrante y llena de estilo. Espacios abiertos para fotos increíbles y zonas de fiesta seguras y amplias.' },
  { section: 'celebraciones', title: 'Bodas Campestres', imageRight: true,
    image: 'src/assets/images/celebraciones/boda_campestre_image.png',
    body: "Un 'Sí, acepto' rodeado de atardeceres mágicos y el encanto del campo. Ofrecemos escenarios instagrameables y una logística impecable para el día más importante de tu vida." },
  { section: 'celebraciones', title: 'Reencuentros Familiares', imageRight: false,
    image: 'src/assets/images/celebraciones/Reencuentros_Familiares.jpg',
    body: 'Celebramos la unión. Disfruta de un día de campo con actividades para todas las edades, desde los más pequeños hasta los abuelos.' },
  { section: 'celebraciones', title: 'Primeras Comuniones y Bautizos', imageRight: true,
    image: 'src/assets/images/celebraciones/Primeras_comuniones.jpg',
    body: 'Ambientes tranquilos y acogedores para compartir la fe y la alegría en familia, con menús que encantan a todos.' },
  // ── Colegios · talleres ──
  { section: 'colegios-talleres', title: 'Granjeritos por un Día', imageRight: false,
    image: 'src/assets/images/colegios/Granjeritos_por_un_dia.jpg',
    body: 'Una aventura para que los más pequeños descubran los secretos de la naturaleza y el respeto ambiental. Con retos, observación de fauna y expediciones, los niños despiertan su curiosidad y se convierten en guardianes del ecosistema. La experiencia perfecta para fomentar el liderazgo, el trabajo en equipo y el amor por la vida rural en un entorno seguro y emocionante.' },
  { section: 'colegios-talleres', title: 'Exploradores por un Día', imageRight: false,
    image: 'src/assets/images/colegios/Exploradores_por_un_dia.jpg',
    body: 'Expediciones por la granja donde niños y jóvenes exploran, observan y aprenden. A través de divertidos retos y observación de fauna, despiertan su curiosidad y desarrollan el trabajo en equipo, el liderazgo y el amor por la vida rural en un entorno seguro.' },
  { section: 'colegios-talleres', title: 'Agricultor por un Día', imageRight: false,
    image: 'src/assets/images/colegios/Agricultor_por_un_dia.jpg',
    body: 'Vive la experiencia de cultivar la tierra y descubre el origen de tus alimentos. Niños y adultos siembran, cosechan y conocen los ciclos naturales de nuestra huerta orgánica. La oportunidad perfecta para valorar el trabajo del campo y conectar con la alimentación saludable bajo el sol de Tenjo.' },
  { section: 'colegios-talleres', title: 'Ecologistas por un Día', imageRight: false,
    image: 'src/assets/images/colegios/Ecologista_por_un_dia.jpg',
    body: 'Los estudiantes se convierten en guardianes del medio ambiente descubriendo acciones concretas para proteger los recursos naturales: reciclaje, conservación, biodiversidad y prácticas sostenibles que pueden aplicar en su vida cotidiana. Un taller que inspira una nueva generación comprometida con el planeta.' },

  // ── Empresas · celebraciones ──
  { section: 'empresas-celebraciones', title: 'Día de la Familia Empresarial', imageRight: false,
    image: 'src/assets/images/empresas/dia_de_la_familia.jpg',
    body: 'Fortalece el salario emocional de tus colaboradores con una jornada campestre única. Diseñamos actividades de integración dinámicas para todas las edades, dinámicas con animales de la granja y espacios de esparcimiento para que los equipos disfruten junto a sus seres queridos.' },
  { section: 'empresas-celebraciones', title: 'Fiestas de Fin de Año Corporativas', imageRight: false,
    image: 'src/assets/images/empresas/Fiestas_de_fin.jpg',
    body: 'Despide el año laboral con una celebración memorable. Ofrecemos banquetes campestres, zonas para eventos musicales, integración de equipos y un ambiente natural exclusivo para celebrar los logros alcanzados por tu empresa.' },
  { section: 'empresas-celebraciones', title: 'Fiestas de Halloween Empresariales', imageRight: false,
    image: 'src/assets/images/empresas/Fiestas_de_Halloween.jpg',
    body: 'Una jornada diferente y divertida adaptada para los hijos de los colaboradores o para el mismo equipo de trabajo. Organizamos concursos de disfraces, decoración temática, senderos recreativos y actividades especiales en un entorno seguro y al aire libre.' },
  { section: 'empresas-celebraciones', title: 'Festival de Cometas Corporativo', imageRight: false,
    image: 'src/assets/images/empresas/Festival_de_cometas.jpg',
    body: 'Aprovecha las mejores temporadas de viento para una dinámica de team building de alto impacto. Una actividad perfecta para fomentar el trabajo en equipo, la creatividad en el diseño de cometas y la sana competencia en un amplio espacio verde sin interferencias.' },

  // ── Empresas · experiencias ──
  { section: 'empresas-experiencias', title: 'Bicipaseos Villa Juan', imageRight: false,
    image: 'src/assets/images/empresas/Bicipaseos_Villa_Juan.png',
    body: 'Recorre senderos diseñados para disfrutar de la brisa y el paisaje de la granja. Una actividad ideal para fomentar la actividad física y el compañerismo mientras exploramos cada rincón de nuestra infraestructura natural.' },
  { section: 'empresas-experiencias', title: 'Despedidas Fin de Año', imageRight: false,
    image: 'src/assets/images/empresas/Fiestas_de_fin.jpg',
    body: 'Cierra el año junto a tu equipo en un entorno campestre exclusivo. Brindis, integración y espacios al aire libre para celebrar juntos los logros y despedir el año a lo grande.' },
  { section: 'empresas-experiencias', title: 'Caminatas de Observación', imageRight: false,
    image: 'src/assets/images/empresas/Caminatas_de_observación.png',
    body: 'Más que caminar, se trata de ver. Acompañados de guías, los participantes recorren nuestras zonas de reserva para identificar flora local y fauna, fomentando la curiosidad y el respeto por el ecosistema.' },
  { section: 'empresas-experiencias', title: 'Talleres de Siembra y Huerta', imageRight: false,
    image: 'src/assets/images/empresas/Talleres_de_siembra.png',
    body: "Una experiencia de 'manos en la tierra'. Aprende los ciclos de la vida vegetal, la importancia de la seguridad alimentaria y llévate la satisfacción de haber plantado vida. Un retorno a nuestras raíces campesinas." },

  // ── Empresas · beneficios ──
  { section: 'empresas-beneficios', title: 'Liderazgo y Confianza', imageRight: false,
    image: 'src/assets/images/empresas/Liderazgo_y_confianza.webp',
    body: 'Actividades diseñadas para identificar y potenciar líderes.' },
  { section: 'empresas-beneficios', title: 'Productividad', imageRight: false,
    image: 'src/assets/images/empresas/Productividad.webp',
    body: 'Reducción del estrés laboral mediante el contacto directo con la naturaleza.' },
  { section: 'empresas-beneficios', title: 'Sentido de Pertenencia', imageRight: false,
    image: 'src/assets/images/empresas/Sentido_de_pertenencia.webp',
    body: 'Dinámicas que alinean los objetivos del colaborador con los de la empresa.' },

  // ── Empresas · bienestar ──
  { section: 'empresas-bienestar', title: 'Formación Asistida Con Caballos', imageRight: true,
    image: 'src/assets/images/empresas/Formacion_asistida.jpg',
    body: 'Una experiencia transformadora donde el caballo actúa como espejo de nuestras emociones. Ideal para quienes buscan fortalecer su liderazgo, mejorar la comunicación asertiva o simplemente vivir un momento de bienestar y reflexión personal.' },
  { section: 'empresas-bienestar', title: 'Jornada de Siembra', imageRight: false,
    image: 'src/assets/images/empresas/Jornada_siembra.jpg',
    body: 'Deja una huella positiva en el planeta y conecta con la tierra en nuestras jornadas de reforestación guiada. Esta actividad te permite ser parte activa del equilibrio ecológico de Tenjo, aprendiendo sobre especies nativas mientras siembras vida con tus propias manos. Es el plan ideal para familias, empresas y grupos que buscan una experiencia con propósito, transformando el paisaje y contribuyendo a un futuro más verde y sostenible para todos.' },
  { section: 'empresas-bienestar', title: 'Bici-Paseos', imageRight: true,
    image: 'src/assets/images/empresas/Bicipaseos_Villa_Juan.png',
    body: 'Recorre los paisajes de Tenjo sobre dos ruedas en una ruta diseñada para desconectarte y respirar aire puro. Es la actividad ideal para quienes buscan combinar deporte, aventura y naturaleza, explorando senderos rurales de forma dinámica y divertida en familia o con amigos. Atrévete a pedalear por caminos inolvidables mientras descubres la biodiversidad local y disfrutas del mejor turismo activo cerca de la ciudad.' },

  // ── Villa Planes · barril (pasos) ──
  { section: 'villaplanes-barril', title: 'Selección y Maduración', imageRight: false,
    image: 'src/assets/images/villa-planes/Seleccion_y_Maduracion.png',
    body: 'Elegimos cortes de alta calidad con una maduración controlada. Este proceso natural intensifica el sabor y garantiza una textura excepcionalmente tierna antes de tocar el fuego.' },
  { section: 'villaplanes-barril', title: 'Sazonado Artesanal', imageRight: false,
    image: 'src/assets/images/villa-planes/Sazonado_Artesanal.jpg',
    body: 'Aplicamos una mezcla de especias seleccionadas que realzan el perfil cárnico sin opacarlo, preparando la pieza para su transformación en el ahumador.' },
  { section: 'villaplanes-barril', title: 'Cocción al Barril', imageRight: false,
    image: 'src/assets/images/villa-planes/Cocción_al_barril.jpg',
    body: 'Usamos calor indirecto con carbón vegetal. Al no haber llama directa, la carne se cocina uniformemente por horas, conservando todos sus jugos y logrando un dorado exterior perfecto.' },
  { section: 'villaplanes-barril', title: 'Espectáculo en Vivo', imageRight: false,
    image: 'src/assets/images/villa-planes/Espectaculo_en_vivo.jpg',
    body: 'La preparación final se realiza frente a tus ojos. Más que una cena, es un show gastronómico donde la suavidad y el aroma del ahumado son los protagonistas de tu evento.' },
];

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' };
async function uploadImage(relPath, title) {
  const buf = await readFile(relPath);
  const name = relPath.split(/[/\\]/).pop();
  const ext = name.split('.').pop().toLowerCase();
  const form = new FormData();
  form.append('title', title);
  // El MIME correcto es lo que habilita las transformaciones (?width/format) en Directus.
  form.append('file', new Blob([buf], { type: MIME[ext] || 'application/octet-stream' }), name);
  const data = await api('/files', { method: 'POST', form });
  return data.id;
}

const POSTS = [
  {
    slug: 'taller-de-caballos-team-building',
    title: 'Por qué un taller con caballos es el mejor team building para tu equipo',
    excerpt: '¿Por qué conformarse con una sala de eventos? La formación asistida con caballos redefine la cohesión de equipos: comunicación genuina, liderazgo y adaptabilidad.',
    categories: ['Mundo Equino', 'Eventos', 'Bienestar y Naturaleza'],
    date: '2026-07-16',
    cover: 'src/assets/images/home/hero_home_coaching.jpg',
    body: `Sacar a un equipo de su entorno habitual es el primer paso para la innovación. Pero ¿por qué conformarse con una sala de eventos tradicional cuando puedes tener un escenario natural? La formación asistida con caballos está redefiniendo cómo las empresas abordan la cohesión grupal.

## Aprendizaje experiencial inolvidable

Transformamos el aprendizaje en una experiencia inolvidable. Al igual que en nuestras salidas pedagógicas, los adultos también aprenden haciendo, explorando y conectándose con la naturaleza. Interactuar con un animal de 400 kilos que responde a tu lenguaje corporal exige una comunicación genuina.

## De la naturaleza a la oficina

Las dinámicas con caballos obligan a los equipos a trabajar unidos bajo condiciones inusuales. Esto fomenta:

- Resolución rápida de conflictos.
- Adaptabilidad ante el cambio.
- Liderazgo instintivo.

## Complementa el trabajo con gastronomía de origen

Después de una jornada de formación, no hay mejor cierre que nuestra gastronomía de origen. Comparte almuerzos corporativos con nuestro sello al barril para coronar un día de retos y trabajo en equipo.`,
  },
  {
    slug: 'caballos-en-colombia',
    title: 'Caballos en Colombia: descubre el Paso Fino, la Trocha y el Trote',
    excerpt: 'Colombia es reconocida por su cultura ecuestre. Conoce las diferencias entre los tres andares más populares antes de vivir tu aventura campestre.',
    categories: ['Mundo Equino', 'Cultura'],
    date: '2026-07-15',
    cover: 'src/assets/images/villa-planes/hero.webp',
    body: `Colombia es reconocida mundialmente por su cultura ecuestre. Para los amantes de la vida de campo y las experiencias auténticas, entender las diferencias entre los andares de los caballos es fundamental antes de vivir una aventura campestre.

## Los 3 andares más populares en Colombia

En nuestros Villa Planes ofrecemos experiencias a la medida para que conectes con estos magníficos ejemplares:

1. **Paso Fino:** considerado el andar más suave del mundo. El caballo se desplaza moviendo sus patas laterales en cuatro tiempos sucesivos, creando un movimiento rápido, armónico y sin rebote para el jinete.
2. **Trocha y Galope:** un andar por diagonales en cuatro tiempos. Es un movimiento más enérgico y sonoro, ideal para quienes buscan sentir la fuerza y la tradición del campo colombiano.
3. **Trote y Galope:** un movimiento por diagonales en dos tiempos. Es un andar clásico, que requiere mayor compenetración entre el jinete y el animal.

## Vive el mundo equino en Tenjo

Ya sea que busques un plan romántico o un día de retos, a solo unos minutos de Bogotá puedes experimentar la conexión con estos nobles animales.`,
  },
];

async function seed() {
  const existing = await api('/items/posts?fields[]=slug&limit=-1').catch(() => []);
  const have = new Set((existing || []).map((p) => p.slug));
  for (const [i, p] of POSTS.entries()) {
    if (have.has(p.slug)) { console.log(`· post ${p.slug} ya existe, salto`); continue; }
    console.log(`· subiendo portada de ${p.slug}…`);
    const coverId = await uploadImage(p.cover, p.title);
    console.log(`· creando post ${p.slug}`);
    await api('/items/posts', { method: 'POST', body: {
      status: 'published', sort: i + 1, title: p.title, slug: p.slug,
      date: p.date, categories: p.categories, excerpt: p.excerpt, cover: coverId, body: p.body } });
  }
}

(async () => {
  console.log(`→ Directus en ${URL}`);
  await login();
  console.log('· login admin OK');
  if (await collectionExists('posts')) console.log('· colección posts ya existe');
  else await createSchema();
  if (await collectionExists('cards')) console.log('· colección cards ya existe');
  else await createCardsSchema();
  await publicRead();
  await ensureSectionChoices();
  await seed();
  await seedCards();
  const posts = await api('/items/posts?fields[]=slug&limit=-1');
  const cards = await api('/items/cards?fields[]=section&limit=-1');
  console.log(`\n✓ listo. posts: ${posts.length} · cards: ${cards.length}`);
  console.log('\nAdmin:  http://localhost:8055   (login con DIRECTUS_ADMIN_EMAIL/PASSWORD del .env)');
})().catch((e) => { console.error('\n✗ error:', e.message); process.exit(1); });
