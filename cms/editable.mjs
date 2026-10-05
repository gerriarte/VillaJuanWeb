// Lo que faltaba para que el cliente edite todo el contenido desde el panel:
//
//   · `banners`        → foto principal de cada página (Celebraciones, Colegios, Villa
//                        Planes, Blog, Empresas) y la foto del Museo del Caballo.
//   · `planes`         → columnas de la tabla de Villa Planes (nombre, horario, precios,
//                        color) + el PDF de cada plan.
//   · `plan_servicios` → filas de esa tabla (qué incluye cada plan).
//   · `documentos`     → PDFs sueltos (hoy: el menú).
//   · `gallery`        → suma la sección `museo-galeria`.
//
// Habilita lectura pública, crea marcadores en el panel, siembra con lo que HOY muestra el
// sitio (solo si la colección/sección está vacía) y suma todas las colecciones de contenido
// al Flow que reconstruye el sitio. Idempotente.
//
//   node --env-file=.env cms/editable.mjs
//
// Variables: DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD (o DIRECTUS_ADMIN_TOKEN).
// Los videos van aparte: cms/videos.mjs.
import { readFile } from 'node:fs/promises';

const URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;
const STATIC_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

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

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' };
async function upload(relPath, title) {
  const buf = await readFile(relPath);
  const name = relPath.split(/[/\\]/).pop();
  const form = new FormData();
  form.append('title', title);
  // El MIME correcto habilita las transformaciones de imagen (?width/format) en Directus.
  form.append('file', new Blob([buf], { type: MIME[name.split('.').pop().toLowerCase()] || 'application/octet-stream' }), name);
  return (await api('/files', { method: 'POST', form })).id;
}

const idField = { field: 'id', type: 'integer', meta: { hidden: true, readonly: true },
  schema: { is_primary_key: true, has_auto_increment: true } };
const statusField = {
  field: 'status', type: 'string', schema: { default_value: 'published' },
  meta: { interface: 'select-dropdown', width: 'half', display: 'labels',
    note: 'Borrador = no se muestra en el sitio',
    options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } },
};
const sortField = { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true } };

/** Crea la colección (si falta), sus campos (los que falten) y relaciones a archivos. */
async function ensureCollection(name, meta, fields, fileFields = []) {
  const exists = await api(`/collections/${name}`).then(() => true, () => false);
  if (!exists) {
    console.log(`· creando colección ${name}…`);
    await api('/collections', { method: 'POST', body: { collection: name, meta, schema: {}, fields: [idField] } });
  }
  const have = new Set(((await api(`/fields/${name}`)) || []).map((f) => f.field));
  for (const f of fields) {
    if (have.has(f.field)) continue;
    console.log(`  · ${name}.${f.field}`);
    await api(`/fields/${name}`, { method: 'POST', body: f });
  }
  const rels = (await api(`/relations/${name}`).catch(() => [])) || [];
  for (const field of fileFields) {
    if (rels.some((r) => r.field === field)) continue;
    await api('/relations', { method: 'POST', body: { collection: name, field, related_collection: 'directus_files' } });
  }
  return !exists;
}

// ── banners ──────────────────────────────────────────────────────────────────
const BANNER_SECTIONS = [
  { text: 'Empresas · Banner principal', value: 'empresas-hero', seed: 'src/assets/images/empresas/hero.webp',
    alt: 'Vista aérea de un evento corporativo bajo carpa en la Ecogranja Villa Juan' },
  { text: 'Celebraciones · Banner principal', value: 'celebraciones-hero', seed: 'src/assets/images/celebraciones/Banner_Celebraciones.jpg',
    alt: 'Vista aérea de un evento campestre en la Ecogranja Villa Juan: carpa blanca, zonas con banderines de colores y praderas verdes' },
  { text: 'Colegios · Banner principal', value: 'colegios-hero', seed: 'src/assets/images/colegios/Banner_Colegios.jpg',
    alt: 'Estudiantes conociendo de cerca una llama en la Ecogranja Villa Juan' },
  { text: 'Villa Planes · Banner principal', value: 'villaplanes-hero', seed: 'src/assets/images/villa-planes/hero_comida_al_barril.webp',
    alt: 'Manos compartiendo una picada de empanadas, patacones, chorizo y salsas en la mesa de madera de la Ecogranja Villa Juan' },
  { text: 'Blog · Banner principal', value: 'blog-hero', seed: 'src/assets/images/blog/Blog.jpg',
    alt: 'Recorriendo la Ecogranja Villa Juan en cuatrimoto' },
  { text: 'Inicio · Foto del Museo del Caballo', value: 'home-museo', seed: 'src/assets/images/home/fuente_caballos.jpg',
    alt: 'Monumento a los caballos en la Ecogranja Villa Juan' },
];

async function banners() {
  await ensureCollection('banners',
    { icon: 'panorama', note: 'Foto principal (banner) de cada página. Una por sección; si hay varias publicadas, gana la más reciente.' },
    [
      statusField,
      { field: 'section', type: 'string', meta: { interface: 'select-dropdown', width: 'half', required: true,
        note: 'En qué página aparece', options: { choices: BANNER_SECTIONS.map(({ text, value }) => ({ text, value })) } } },
      { field: 'image', type: 'uuid', meta: { interface: 'file-image', special: ['file'], width: 'full', required: true,
        note: 'Foto horizontal grande (mínimo 1920 px de ancho). Se optimiza sola.' } },
      { field: 'alt', type: 'string', meta: { interface: 'input', width: 'full', required: true,
        note: 'Descripción de la foto (accesibilidad y SEO). Ej: "Vista aérea de un evento bajo carpa"' } },
    ],
    ['image']);
  await api('/fields/banners/section', { method: 'PATCH', body: { meta: { options: {
    choices: BANNER_SECTIONS.map(({ text, value }) => ({ text, value })) } } } });
  for (const b of BANNER_SECTIONS) {
    const have = (await api(`/items/banners?filter[section][_eq]=${b.value}&limit=1&fields=id`)) || [];
    if (have.length) continue;
    console.log(`  · semilla banner: ${b.value}`);
    const image = await upload(b.seed, b.text);
    await api('/items/banners', { method: 'POST', body: { status: 'published', section: b.value, image, alt: b.alt } });
  }
}

// ── planes + plan_servicios ──────────────────────────────────────────────────
const PLANES = [
  { slug: 'trote', name: 'Trote', hours: '11:00 a.m. – 6:00 p.m.', price_adult: 100000, price_child: 90000, color: '#00811e',
    description: 'Espacio exclusivo, recorrido por la granja, taller de ordeño, almuerzo a la carta, feria de juegos tradicionales, Show Villa Juan y Rodeo 360.',
    pdf: 'src/assets/images/villa-planes/Villa_Plan_Trote_y_Galope.pdf' },
  { slug: 'trocha', name: 'Trocha', hours: '11:00 a.m. – 6:00 p.m.', price_adult: 120000, price_child: 110000, color: '#c0360d',
    description: 'Todo lo del plan Trote, más el paseo a caballo.',
    pdf: 'src/assets/images/villa-planes/Villa_Plan_Trocha_y_Galope.pdf' },
  { slug: 'galope', name: 'Galope', hours: '9:30 a.m. – 6:00 p.m.', price_adult: 130000, price_child: 120000, color: '#1d5fa8',
    description: 'Llegas desde temprano: refrigerio incluido, paseo a caballo y todo lo del plan Trocha.' },
  { slug: 'paso-fino', name: 'Paso Fino', hours: '9:30 a.m. – 6:00 p.m.', price_adult: 150000, price_child: 140000, color: '#9a6a0e',
    description: 'La experiencia completa: arranca con el desayuno de la granja e incluye todo lo demás.',
    pdf: 'src/assets/images/villa-planes/Villa_Plan_Paso_Fino.pdf' },
];
const TODOS = PLANES.map((p) => p.slug);
const SERVICIOS = [
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

async function planes() {
  await ensureCollection('planes',
    { icon: 'payments', sort_field: 'sort', note: 'Villa Planes: columnas de la tabla comparativa (precios y horarios) y el PDF de cada plan. Arrastrá para cambiar el orden.' },
    [
      statusField, sortField,
      { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', required: true, note: 'Nombre del plan. Ej: "Paso Fino"' } },
      { field: 'slug', type: 'string', schema: { is_unique: true }, meta: { interface: 'input', width: 'half', required: true,
        note: 'Identificador para la URL (/villa-planes/<slug>), sin espacios ni tildes. NO cambiarlo una vez publicado.',
        options: { slug: true } } },
      { field: 'hours', type: 'string', meta: { interface: 'input', width: 'half', note: 'Horario. Ej: "9:30 a.m. – 6:00 p.m."' } },
      { field: 'color', type: 'string', meta: { interface: 'select-color', width: 'half',
        note: 'Color del plan en la tabla y en su botón. Usar tonos OSCUROS (el texto va sobre fondo claro).' } },
      { field: 'price_adult', type: 'integer', meta: { interface: 'input', width: 'half', note: 'Precio adulto en pesos, sin puntos. Ej: 150000' } },
      { field: 'price_child', type: 'integer', meta: { interface: 'input', width: 'half', note: 'Precio niño en pesos, sin puntos. Ej: 140000' } },
      { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full', note: 'Resumen del plan (aparece en su página y en Google).' } },
      { field: 'pdf', type: 'uuid', meta: { interface: 'file', special: ['file'], width: 'full',
        note: 'PDF del plan. Sin PDF, el plan aparece en la tabla pero no tiene botón ni página propia.' } },
    ],
    ['pdf']);

  await ensureCollection('plan_servicios',
    { icon: 'checklist', sort_field: 'sort', note: 'Villa Planes: filas de la tabla comparativa. Marcá en qué planes está incluido cada servicio.' },
    [
      statusField, sortField,
      { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', required: true, note: 'Servicio. Ej: "Taller de ordeño"' } },
      { field: 'note', type: 'string', meta: { interface: 'input', width: 'half', note: 'Aclaración opcional, va entre paréntesis. Ej: "1 hora con guía"' } },
      { field: 'planes', type: 'json', meta: { interface: 'select-multiple-checkbox', special: ['cast-json'], width: 'full',
        note: 'Planes que lo incluyen (✓). Los que no se marquen muestran ✗.', options: { choices: [] } } },
    ]);

  const existentes = (await api('/items/planes?limit=-1&fields=id,slug')) || [];
  if (!existentes.length) {
    for (const [i, p] of PLANES.entries()) {
      console.log(`  · semilla plan: ${p.name}`);
      const pdf = p.pdf ? await upload(p.pdf, `Villa Plan ${p.name}`) : null;
      const { pdf: _ruta, ...datos } = p;
      await api('/items/planes', { method: 'POST', body: { ...datos, status: 'published', sort: i + 1, pdf } });
    }
  }
  if (!((await api('/items/plan_servicios?limit=1&fields=id')) || []).length) {
    console.log('  · semilla servicios');
    await api('/items/plan_servicios', { method: 'POST',
      body: SERVICIOS.map((s, i) => ({ status: 'published', sort: i + 1, name: s.name, note: s.note ?? null, planes: s.planes })) });
  }
  // Las casillas de "planes" se arman con los planes que existan en el CMS.
  const todos = (await api('/items/planes?limit=-1&sort=sort&fields=slug,name')) || [];
  await api('/fields/plan_servicios/planes', { method: 'PATCH', body: { meta: { options: {
    choices: todos.map((p) => ({ text: p.name, value: p.slug })) } } } });
}

// ── documentos ───────────────────────────────────────────────────────────────
async function documentos() {
  await ensureCollection('documentos',
    { icon: 'picture_as_pdf', note: 'PDFs sueltos del sitio. Para cambiar uno, reemplazá el archivo (no cambies la clave).' },
    [
      { field: 'key', type: 'string', schema: { is_unique: true }, meta: { interface: 'select-dropdown', width: 'half', required: true,
        note: 'Qué documento es', options: { choices: [{ text: 'Menú del restaurante', value: 'menu' }] } } },
      { field: 'title', type: 'string', meta: { interface: 'input', width: 'half' } },
      { field: 'file', type: 'uuid', meta: { interface: 'file', special: ['file'], width: 'full', required: true, note: 'El PDF' } },
    ],
    ['file']);
  if (!((await api('/items/documentos?filter[key][_eq]=menu&limit=1&fields=id')) || []).length) {
    console.log('  · semilla menú');
    const file = await upload('src/assets/images/villa-planes/Menu_Villa_Juan_Sin_Precios.pdf', 'Menú Ecogranja Villa Juan');
    await api('/items/documentos', { method: 'POST', body: { key: 'menu', title: 'Menú del restaurante', file } });
  }
}

// ── galería del museo ────────────────────────────────────────────────────────
async function galeriaMuseo() {
  const field = await api('/fields/gallery/section').catch(() => null);
  if (!field) {
    console.warn('! no existe la colección gallery (correr cms/galleries.mjs primero)');
    return;
  }
  const choices = field.meta?.options?.choices ?? [];
  if (choices.some((c) => c.value === 'museo-galeria')) return;
  console.log('· gallery: + Museo del Caballo · Galería');
  await api('/fields/gallery/section', { method: 'PATCH', body: { meta: { options: {
    choices: [...choices, { text: 'Museo del Caballo · Galería', value: 'museo-galeria' }] } } } });
}

// ── permisos, marcadores y Flow ──────────────────────────────────────────────
async function publicRead() {
  const policies = await api('/policies?filter[name][_eq]=$t:public_label');
  const pub = policies?.[0] ?? (await api('/policies'))?.find((p) => p.name?.includes('public'));
  if (!pub) throw new Error('no encontré la policy pública');
  const existing = (await api(`/permissions?filter[policy][_eq]=${pub.id}&limit=-1`).catch(() => [])) || [];
  const rules = [
    ['banners', { status: { _eq: 'published' } }],
    ['planes', { status: { _eq: 'published' } }],
    ['plan_servicios', { status: { _eq: 'published' } }],
    ['documentos', {}],
  ];
  for (const [collection, permissions] of rules) {
    if (existing.some((p) => p.collection === collection && p.action === 'read')) continue;
    console.log(`· lectura pública: ${collection}`);
    await api('/permissions', { method: 'POST', body: { policy: pub.id, collection, action: 'read', fields: ['*'], permissions } });
  }
}

async function bookmarks() {
  const existing = (await api('/presets?fields[]=bookmark&limit=-1').catch(() => [])) || [];
  const have = new Set(existing.map((p) => p.bookmark).filter(Boolean));
  const list = [
    ...BANNER_SECTIONS.map((b) => ({ bookmark: b.text, collection: 'banners', icon: 'panorama',
      filter: { section: { _eq: b.value } }, layout: 'cards',
      layout_options: { cards: { icon: 'panorama', title: '{{alt}}', subtitle: '{{status}}', size: 4, imageFit: 'crop', src: 'image' } } })),
    { bookmark: 'Museo del Caballo · Galería', collection: 'gallery', icon: 'museum',
      filter: { section: { _eq: 'museo-galeria' } }, layout: 'cards', layout_query: { cards: { sort: ['sort'] } },
      layout_options: { cards: { icon: 'image', title: '{{alt}}', subtitle: '{{status}}', size: 4, imageFit: 'crop', src: 'image' } } },
    { bookmark: 'Villa Planes · Precios y horarios', collection: 'planes', icon: 'payments', layout: 'tabular',
      layout_query: { tabular: { fields: ['status', 'name', 'hours', 'price_adult', 'price_child', 'pdf'], sort: ['sort'] } } },
    { bookmark: 'Villa Planes · Qué incluye cada plan', collection: 'plan_servicios', icon: 'checklist', layout: 'tabular',
      layout_query: { tabular: { fields: ['status', 'name', 'note', 'planes'], sort: ['sort'] } } },
    { bookmark: 'Menú (PDF)', collection: 'documentos', icon: 'picture_as_pdf', layout: 'tabular',
      filter: { key: { _eq: 'menu' } } },
  ];
  for (const b of list) {
    if (have.has(b.bookmark)) continue;
    console.log(`· bookmark: ${b.bookmark}`);
    await api('/presets', { method: 'POST', body: { role: null, user: null, ...b } });
  }
}

// Todo lo que el sitio lee en el build: si cambia, el sitio se reconstruye solo.
const CONTENIDO = ['posts', 'cards', 'gallery', 'slides', 'videos', 'banners', 'planes', 'plan_servicios', 'documentos'];
async function flow() {
  const flows = (await api('/flows?filter[trigger][_eq]=event&limit=-1').catch(() => [])) || [];
  const f = flows.find((x) => /rebuild/i.test(x.name ?? ''));
  if (!f) {
    console.warn('! no encontré el Flow de rebuild: los cambios se verán en el próximo deploy');
    return;
  }
  const actuales = f.options?.collections ?? [];
  const faltan = CONTENIDO.filter((c) => !actuales.includes(c));
  const scope = f.options?.scope ?? [];
  // `items.delete` también: borrar una foto o un banner tiene que reflejarse.
  const scopeFinal = [...new Set([...scope, 'items.create', 'items.update', 'items.delete'])];
  if (!faltan.length && scopeFinal.length === scope.length) return;
  console.log(`· Flow "${f.name}": + ${[...faltan, ...scopeFinal.filter((s) => !scope.includes(s))].join(', ')}`);
  await api(`/flows/${f.id}`, { method: 'PATCH', body: { options: { ...f.options, collections: [...actuales, ...faltan], scope: scopeFinal } } });
}

await login();
await banners();
await planes();
await documentos();
await galeriaMuseo();
await publicRead();
await bookmarks();
await flow();
console.log('✓ contenido editable listo');
