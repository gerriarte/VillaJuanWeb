// Carruseles y galerías editables desde el CMS. Crea las colecciones `gallery`
// (galerías de fotos) y `slides` (carrusel del hero), habilita lectura pública,
// sube las fotos que hoy están en el repo y siembra los items en el mismo orden.
// Idempotente: se puede correr varias veces sin duplicar nada.
//
//   node --env-file=.env cms/galleries.mjs
//
// Variables: DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD.
// Sin `--seed=false` sube también las imágenes (~40 archivos).
import { readFile } from 'node:fs/promises';

const URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;
const SEED = !process.argv.includes('--seed=false');

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

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' };
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

// ── Secciones (deben coincidir con las que pide el sitio en src/lib/content.ts) ──
const GALLERY_SECTIONS = [
  { text: 'Home · Galería', value: 'home-galeria' },
  { text: 'Empresas · Coaching', value: 'empresas-coaching' },
  { text: 'Villa Planes · Platos', value: 'villaplanes-comida' },
];
const SLIDE_SECTIONS = [{ text: 'Home · Carrusel del hero', value: 'home-hero' }];

const statusField = {
  field: 'status', type: 'string', schema: { default_value: 'published' },
  meta: { interface: 'select-dropdown', width: 'half', display: 'labels',
    options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } },
};

async function createGallery() {
  console.log('· creando colección gallery…');
  await api('/collections', { method: 'POST', body: {
    collection: 'gallery',
    meta: { icon: 'photo_library', note: 'Fotos de las galerías y carruseles del sitio', sort_field: 'sort' },
    schema: {},
    fields: [{ field: 'id', type: 'integer', meta: { hidden: true, readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true } }],
  } });
  const fields = [
    statusField,
    { field: 'section', type: 'string',
      meta: { interface: 'select-dropdown', width: 'half', required: true,
        note: 'En qué galería del sitio aparece', options: { choices: GALLERY_SECTIONS } } },
    { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } },
    { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full', required: true } },
    { field: 'alt', type: 'string',
      meta: { interface: 'input', width: 'full', required: true,
        note: 'Descripción de la foto (accesibilidad y SEO). Ej: "Familia disfrutando un día de campo"' } },
  ];
  for (const f of fields) {
    console.log(`  · campo ${f.field}`);
    await api('/fields/gallery', { method: 'POST', body: f });
  }
  await api('/relations', { method: 'POST', body: { collection: 'gallery', field: 'image', related_collection: 'directus_files' } });
}

async function createSlides() {
  console.log('· creando colección slides…');
  await api('/collections', { method: 'POST', body: {
    collection: 'slides',
    meta: { icon: 'view_carousel', note: 'Slides del carrusel del hero (imagen + título + copy + botón)', sort_field: 'sort' },
    schema: {},
    fields: [{ field: 'id', type: 'integer', meta: { hidden: true, readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true } }],
  } });
  const fields = [
    statusField,
    { field: 'section', type: 'string', schema: { default_value: 'home-hero' },
      meta: { interface: 'select-dropdown', width: 'half', required: true, options: { choices: SLIDE_SECTIONS } } },
    { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } },
    { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full', required: true } },
    { field: 'alt', type: 'string', meta: { interface: 'input', width: 'full', required: true, note: 'Descripción de la foto de fondo (accesibilidad)' } },
    { field: 'title', type: 'string', meta: { interface: 'input', width: 'full', required: true, note: 'Título del slide. Si cargás un gráfico abajo, este texto se usa como alt.' } },
    { field: 'title_image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full', note: 'Opcional: título como gráfico (SVG/PNG) en vez de texto' } },
    { field: 'text', type: 'text', meta: { interface: 'input-multiline', width: 'full' } },
    { field: 'cta_label', type: 'string', meta: { interface: 'input', width: 'half', required: true, note: 'Texto del botón. Ej: "Planear mi visita"' } },
    { field: 'cta_href', type: 'string', meta: { interface: 'input', width: 'half', required: true, note: 'A dónde lleva: ruta interna (/empresas) o URL completa (WhatsApp, PDF…)' } },
    { field: 'cta_new_tab', type: 'boolean', schema: { default_value: false }, meta: { interface: 'boolean', width: 'half', note: 'Abrir en pestaña nueva (usar para links externos)' } },
  ];
  for (const f of fields) {
    console.log(`  · campo ${f.field}`);
    await api('/fields/slides', { method: 'POST', body: f });
  }
  for (const field of ['image', 'title_image']) {
    await api('/relations', { method: 'POST', body: { collection: 'slides', field, related_collection: 'directus_files' } });
  }
}

// Mantiene las opciones del dropdown al día en instancias ya creadas.
async function ensureChoices() {
  await api('/fields/gallery/section', { method: 'PATCH', body: { meta: { options: { choices: GALLERY_SECTIONS } } } }).catch(() => {});
  await api('/fields/slides/section', { method: 'PATCH', body: { meta: { options: { choices: SLIDE_SECTIONS } } } }).catch(() => {});
}

async function publicRead() {
  const policies = await api('/policies?filter[name][_eq]=$t:public_label');
  const pub = policies?.[0] ?? (await api('/policies'))?.find((p) => p.name?.includes('public'));
  if (!pub) throw new Error('no encontré la policy pública');
  const existing = (await api(`/permissions?filter[policy][_eq]=${pub.id}`).catch(() => [])) || [];
  for (const collection of ['gallery', 'slides']) {
    if (existing.some((p) => p.collection === collection && p.action === 'read')) continue;
    console.log(`· lectura pública: ${collection}`);
    await api('/permissions', { method: 'POST', body: {
      policy: pub.id, collection, action: 'read', fields: ['*'],
      permissions: { status: { _eq: 'published' } } } });
  }
}

const BOOKMARKS = [
  { name: 'Home · Carrusel', collection: 'slides', icon: 'view_carousel', section: 'home-hero' },
  { name: 'Home · Galería', collection: 'gallery', icon: 'photo_library', section: 'home-galeria' },
  { name: 'Empresas · Galería coaching', collection: 'gallery', icon: 'groups', section: 'empresas-coaching' },
  { name: 'Villa Planes · Platos', collection: 'gallery', icon: 'restaurant', section: 'villaplanes-comida' },
];

async function ensureBookmarks() {
  const existing = (await api('/presets?fields[]=bookmark&limit=-1').catch(() => [])) || [];
  const have = new Set(existing.map((p) => p.bookmark).filter(Boolean));
  for (const b of BOOKMARKS) {
    if (have.has(b.name)) continue;
    console.log(`· bookmark: ${b.name}`);
    await api('/presets', { method: 'POST', body: {
      bookmark: b.name, collection: b.collection, role: null, user: null, icon: b.icon,
      filter: { section: { _eq: b.section } },
      layout: 'cards',
      layout_query: { cards: { sort: ['sort'] } },
      layout_options: { cards: { icon: 'image', title: '{{alt}}', subtitle: '{{status}}', size: 4, imageFit: 'crop', src: 'image' } },
    } });
  }
}

// ── Semilla: exactamente las fotos que hoy están en el código, en el mismo orden ──
const H = 'src/assets/images/home';
const E = 'src/assets/images/empresas/coaching';
const V = 'src/assets/images/villa-planes/comida';

const PHOTOS = [
  ['home-galeria', `${H}/carrusel/05-naturaleza.jpg`, 'Vista panorámica de las zonas verdes de la Ecogranja Villa Juan en Tenjo, con montañas de fondo'],
  ['home-galeria', `${H}/carrusel/08-planes-familiares.jpg`, 'Visitante riendo junto a una llama en la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/02-carrusel.jpg`, 'El equipo de la Ecogranja Villa Juan celebrando el Granja Fest junto al jeep Willys'],
  ['home-galeria', `${H}/carrusel/06-planes-familiares.jpg`, 'Familia disfrutando un día de campo con sus mascotas en la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/09-planes-familiares.jpg`, 'Visitante disfrutando un paseo a caballo entre las carpas de camping de Villa Juan'],
  ['home-galeria', `${H}/carrusel/07-planes-familiares.jpg`, 'Visitante abrazando a un burro en las praderas de la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/11-restaurante.jpg`, 'Caballos ensillados listos para la cabalgata en la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/01-carrusel.jpg`, 'Mesa y bancas campestres bajo un cenador circular en las zonas verdes de Villa Juan'],
  ['home-galeria', `${H}/carrusel/04-carrusel.jpg`, 'Gallina de la granja asomándose en el gallinero de la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/10-planes-familiares.jpg`, 'Perro con arnés de colores paseando por las zonas verdes de la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/12-restaurante.jpg`, 'Dos caballos ensillados en las praderas verdes de la Ecogranja Villa Juan al atardecer'],
  ['home-galeria', `${H}/carrusel/13-granja.jpg`, 'Visitante en cuatrimoto frente a la sede de la Ecogranja Villa Juan'],
  ['home-galeria', `${H}/carrusel/03-carrusel.jpg`, 'Anfitriones de Villa Juan dando la bienvenida en la entrada del Granja Fest'],

  ['empresas-coaching', `${E}/taller-01-circulo-inicial.jpg`, 'Equipo en círculo durante la charla inicial del taller'],
  ['empresas-coaching', `${E}/taller-02-facilitador-escultura.jpg`, 'El facilitador explica la dinámica junto a la escultura de caballo'],
  ['empresas-coaching', `${E}/taller-03-escultura-herraduras.jpg`, 'Participante sobre la escultura de caballo hecha con herraduras'],
  ['empresas-coaching', `${E}/taller-04-primer-encuentro.jpg`, 'Primer acercamiento del grupo al caballo en el picadero'],
  ['empresas-coaching', `${E}/taller-05-equipo-caballo.jpg`, 'Equipo acariciando al caballo durante la dinámica'],
  ['empresas-coaching', `${E}/taller-06-manos-confianza.jpg`, 'Manos de los participantes sobre el caballo en un ejercicio de confianza'],
  ['empresas-coaching', `${E}/taller-07-contacto-grupo.jpg`, 'Varios participantes en contacto con el caballo'],
  ['empresas-coaching', `${E}/taller-08-conduciendo.jpg`, 'Participantes conduciendo al caballo por el picadero'],
  ['empresas-coaching', `${E}/taller-09-liderando-cuerda.jpg`, 'Participante liderando al caballo con la cuerda'],
  ['empresas-coaching', `${E}/taller-10-dinamica-antifaz.jpg`, 'Dinámica de confianza con los ojos vendados junto al caballo'],
  ['empresas-coaching', `${E}/taller-11-facilitador-cierre.jpg`, 'El facilitador con el caballo al cierre del taller'],
  ['empresas-coaching', `${E}/taller-12-retrato-caballo.jpg`, 'Retrato de uno de los caballos de Villa Juan'],

  ['villaplanes-comida', `${V}/churrasco.webp`, 'Churrasco con papas a la francesa servido en tabla de madera'],
  ['villaplanes-comida', `${V}/empanaditas.webp`, 'Canasta de empanaditas con ají picado'],
  ['villaplanes-comida', `${V}/chicharroncitos.webp`, 'Chicharroncitos crocantes con guacamole'],
  ['villaplanes-comida', `${V}/patacon-ahogado-2.webp`, 'Patacones con salsa de ahogado'],
  ['villaplanes-comida', `${V}/patacon-ahogado.webp`, 'Patacón con ahogado servido en la mesa campestre'],
  ['villaplanes-comida', `${V}/fiambre.webp`, 'Fiambre campesino servido sobre hoja de plátano'],
];

// El WhatsApp sale de src/lib/site.ts (WA_PHONE). Se repite acá para no importar TS.
const WA = (text) => `https://api.whatsapp.com/send?phone=+573208689681&text=${encodeURIComponent(text)}`;

const SLIDES = [
  { image: `${H}/hero_home01.jpg`, titleImage: `${H}/Titulo_hero1.svg`,
    alt: 'Familia disfrutando un día de campo en la Ecogranja Villa Juan',
    title: 'Ecogranja Villa Juan · Tu escape natural en la Sabana de Bogotá',
    text: 'Un espacio campestre único donde la naturaleza, la diversión y los negocios se encuentran. El lugar perfecto para conectar con lo que realmente importa.',
    ctaLabel: 'Planear mi visita', ctaHref: WA('Quiero planear mi visita Villa Juan'), newTab: false },
  { image: `${H}/hero_home_restaurante.jpg`,
    alt: 'Restaurante campestre de Villa Juan',
    title: 'Restaurante Campestre',
    text: 'La mejor gastronomía local en un entorno natural único. Fusionamos ingredientes orgánicos de la granja con platos tradicionales perfectos para compartir.',
    ctaLabel: 'Ver menú', ctaHref: '/menu', newTab: false },
  { image: `${H}/hero_home_coaching.jpg`,
    alt: 'Sesión de coaching asistido con caballos',
    title: 'Coaching con Caballos',
    text: 'Impulsa el liderazgo empresarial con sesiones de coaching asistido con caballos cerca de Bogotá. Una experiencia transformadora para conectar equipos.',
    ctaLabel: 'Descubrir coaching', ctaHref: '/empresas', newTab: false },
  { image: `${H}/hero_home_empresariales.jpg`,
    alt: 'Evento empresarial al aire libre en la ecogranja',
    title: 'Eventos Empresariales',
    text: 'El escenario ideal para el Día de la Familia, fiestas de fin de año y team building. Un espacio campestre exclusivo con logística integral.',
    ctaLabel: 'Cotizar evento corporativo', ctaHref: WA('Quiero cotizar un evento corporativo en Villa Juan'), newTab: false },
];

async function seedGallery() {
  const existing = (await api('/items/gallery?fields[]=section&fields[]=alt&limit=-1').catch(() => [])) || [];
  const have = new Set(existing.map((p) => `${p.section}|${p.alt}`));
  // `sort` va 1..n DENTRO de cada sección: así el orden que se ve en el CMS es el de
  // la galería, y arrastrar una foto no reordena las de otra página.
  const n = {};
  for (const [section, path, alt] of PHOTOS) {
    n[section] = (n[section] ?? 0) + 1;
    if (have.has(`${section}|${alt}`)) continue;
    console.log(`· foto: ${section} / ${path.split('/').pop()}`);
    const image = await uploadImage(path, alt);
    await api('/items/gallery', { method: 'POST', body: { status: 'published', section, sort: n[section], image, alt } });
  }
}

async function seedSlides() {
  const existing = (await api('/items/slides?fields[]=title&limit=-1').catch(() => [])) || [];
  const have = new Set(existing.map((s) => s.title));
  for (const [i, s] of SLIDES.entries()) {
    if (have.has(s.title)) continue;
    console.log(`· slide: ${s.title}`);
    const image = await uploadImage(s.image, s.alt);
    const titleImage = s.titleImage ? await uploadImage(s.titleImage, s.title) : null;
    await api('/items/slides', { method: 'POST', body: {
      status: 'published', section: 'home-hero', sort: i + 1, image, alt: s.alt,
      title: s.title, title_image: titleImage, text: s.text,
      cta_label: s.ctaLabel, cta_href: s.ctaHref, cta_new_tab: s.newTab } });
  }
}

(async () => {
  console.log(`→ Directus en ${URL}`);
  await login();
  console.log('· login admin OK');
  if (await collectionExists('gallery')) console.log('· colección gallery ya existe');
  else await createGallery();
  if (await collectionExists('slides')) console.log('· colección slides ya existe');
  else await createSlides();
  await ensureChoices();
  await publicRead();
  await ensureBookmarks();
  if (SEED) {
    await seedGallery();
    await seedSlides();
  } else {
    console.log('· semilla omitida (--seed=false): las colecciones quedan vacías y el sitio usa las fotos del repo');
  }
  const photos = await api('/items/gallery?fields[]=section&limit=-1');
  const slides = await api('/items/slides?fields[]=id&limit=-1');
  console.log(`\n✓ listo. fotos: ${photos.length} · slides: ${slides.length}`);
  console.log('Recordá: el sitio es estático → hay que rebuildear (sin caché) para ver los cambios.');
})().catch((e) => { console.error('\n✗ error:', e.message); process.exit(1); });
