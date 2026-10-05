// Ordena el panel para el cliente: carpetas en el menú, nombres en español, íconos y
// etiquetas de campos legibles ("Precio adulto" en vez de "price_adult"). No toca datos
// ni el esquema de las tablas: solo metadatos de presentación. Idempotente.
//
//   node --env-file=.env cms/navegacion.mjs
//
// Variables: DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD (o DIRECTUS_ADMIN_TOKEN).

const URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;
const STATIC_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

let token = '';
async function api(path, { method = 'GET', body } = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${URL}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return json.data;
}

async function login() {
  if (STATIC_TOKEN) {
    token = STATIC_TOKEN;
    return;
  }
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error('login falló: ' + (await res.text()));
  token = (await res.json()).data.access_token;
}

// El panel está en es-419; se agrega es-ES por si algún usuario lo usa.
const LANGS = ['es-419', 'es-ES'];
const tr = (translation, singular = translation, plural = translation) =>
  LANGS.map((language) => ({ language, translation, singular, plural }));

// ── Carpetas del menú (colecciones sin tabla) ──
const FOLDERS = [
  { collection: 'carpeta_inicio', name: 'Inicio', icon: 'home', sort: 1,
    note: 'Carrusel principal de la página de inicio' },
  { collection: 'carpeta_secciones', name: 'Contenido por página', icon: 'web', sort: 2,
    note: 'Banners, tarjetas, galerías y videos de todas las páginas. Dentro de cada uno, los marcadores separan por página.' },
  { collection: 'carpeta_villa_planes', name: 'Villa Planes y menú', icon: 'payments', sort: 3,
    note: 'Precios, horarios, servicios, PDFs de los planes y menú' },
  { collection: 'carpeta_blog', name: 'Blog', icon: 'article', sort: 4, note: 'Artículos del blog' },
];

// ── Cada colección: carpeta, orden, nombre visible e ícono ──
const COLLECTIONS = [
  { collection: 'slides', group: 'carpeta_inicio', sort: 1, icon: 'view_carousel',
    name: ['Carrusel del inicio', 'Slide', 'Slides del carrusel'] },
  { collection: 'banners', group: 'carpeta_secciones', sort: 1, icon: 'panorama',
    name: ['Banners (foto principal)', 'Banner', 'Banners'] },
  { collection: 'cards', group: 'carpeta_secciones', sort: 2, icon: 'dashboard',
    name: ['Tarjetas', 'Tarjeta', 'Tarjetas'] },
  { collection: 'gallery', group: 'carpeta_secciones', sort: 3, icon: 'photo_library',
    name: ['Galerías de fotos', 'Foto', 'Fotos'] },
  { collection: 'videos', group: 'carpeta_secciones', sort: 4, icon: 'smart_display',
    name: ['Videos', 'Video', 'Videos'] },
  { collection: 'planes', group: 'carpeta_villa_planes', sort: 1, icon: 'payments',
    name: ['Planes: precios, horarios y PDF', 'Plan', 'Planes'] },
  { collection: 'plan_servicios', group: 'carpeta_villa_planes', sort: 2, icon: 'checklist',
    name: ['Qué incluye cada plan', 'Servicio', 'Servicios'] },
  { collection: 'documentos', group: 'carpeta_villa_planes', sort: 3, icon: 'picture_as_pdf',
    name: ['Menú y documentos (PDF)', 'Documento', 'Documentos'] },
  { collection: 'posts', group: 'carpeta_blog', sort: 1, icon: 'article',
    name: ['Artículos del blog', 'Artículo', 'Artículos'] },
];

// ── Etiquetas de campos (las comunes valen para todas las colecciones que los tengan) ──
const FIELDS = {
  '*': {
    status: 'Estado', section: 'Página / sección', image: 'Foto', alt: 'Descripción de la foto',
    title: 'Título', note: 'Nota', body: 'Texto', text: 'Texto', name: 'Nombre', slug: 'Identificador (URL)',
    description: 'Descripción', file: 'Archivo', poster: 'Portada', pdf: 'PDF',
  },
  cards: { image_right: 'Foto a la derecha' },
  slides: { title_image: 'Título como imagen (opcional)', cta_label: 'Texto del botón',
    cta_href: 'Enlace del botón', cta_new_tab: 'Abrir en pestaña nueva' },
  videos: { youtube_url: 'Enlace de YouTube', video_file: 'Archivo de video (MP4)' },
  planes: { hours: 'Horario', color: 'Color del plan', price_adult: 'Precio adulto', price_child: 'Precio niño' },
  plan_servicios: { name: 'Servicio', note: 'Aclaración', planes: 'Incluido en' },
  documentos: { key: 'Documento' },
  posts: { date: 'Fecha', categories: 'Categorías', excerpt: 'Resumen', cover: 'Portada', body: 'Contenido' },
};

async function ensureFolders() {
  const existing = new Set(((await api('/collections')) || []).map((c) => c.collection));
  for (const f of FOLDERS) {
    const meta = { icon: f.icon, sort: f.sort, note: f.note, collapse: 'open', translations: tr(f.name) };
    if (existing.has(f.collection)) {
      await api(`/collections/${f.collection}`, { method: 'PATCH', body: { meta } });
    } else {
      console.log(`· carpeta: ${f.name}`);
      // schema: null → carpeta del menú (no crea tabla).
      await api('/collections', { method: 'POST', body: { collection: f.collection, schema: null, meta } });
    }
  }
}

async function organizeCollections() {
  const existing = new Set(((await api('/collections')) || []).map((c) => c.collection));
  for (const c of COLLECTIONS) {
    if (!existing.has(c.collection)) {
      console.warn(`! no existe ${c.collection}, se omite`);
      continue;
    }
    const [translation, singular, plural] = c.name;
    console.log(`· ${c.collection} → ${translation}`);
    await api(`/collections/${c.collection}`, { method: 'PATCH', body: { meta: {
      group: c.group, sort: c.sort, icon: c.icon, translations: tr(translation, singular, plural) } } });
  }
}

async function labelFields() {
  for (const { collection } of COLLECTIONS) {
    const fields = (await api(`/fields/${collection}`).catch(() => [])) || [];
    for (const f of fields) {
      const label = FIELDS[collection]?.[f.field] ?? FIELDS['*'][f.field];
      if (!label) continue;
      await api(`/fields/${collection}/${f.field}`, { method: 'PATCH', body: { meta: {
        translations: LANGS.map((language) => ({ language, translation: label })) } } });
    }
  }
  console.log('· etiquetas de campos en español');
}

await login();
await ensureFolders();
await organizeCollections();
await labelFields();
console.log('✓ panel ordenado');
