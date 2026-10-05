// Videos editables desde el CMS. Crea la colección `videos` (un video por sección:
// YouTube o archivo subido, con portada opcional), habilita lectura pública, agrega
// marcadores en el panel y suma `videos` al Flow de rebuild del sitio.
// Idempotente: se puede correr varias veces sin duplicar nada. Siembra SOLO los videos
// que hoy existen en el sitio (coaching de Empresas y el short de Villa Planes), y solo si
// su sección está vacía. Sin video publicado, la página omite el bloque.
//
//   node --env-file=.env cms/videos.mjs
//
// Variables: DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD
// (o DIRECTUS_ADMIN_TOKEN).
import { readFile } from 'node:fs/promises';

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

// ── Secciones (deben coincidir con las que pide el sitio vía getVideo() en src/lib/content.ts) ──
const SECTIONS = [
  { text: 'Inicio · Video', value: 'home-video' },
  { text: 'Empresas · Video del banner principal', value: 'empresas-video' },
  { text: 'Empresas · Video de coaching (galería)', value: 'empresas-coaching-video' },
  { text: 'Villa Planes · Shorts (verticales)', value: 'villaplanes-short' },
  { text: 'Museo del Caballo · Video', value: 'museo-video' },
];

// Videos que hoy están en el sitio: se cargan al CMS para que el cliente los vea y edite.
const SEED = [
  { section: 'empresas-coaching-video', title: 'Coaching con Caballos para Empresas · Liderazgo y Trabajo en Equipo',
    youtube_url: 'https://www.youtube.com/watch?v=_elpP9hMND8', poster: 'src/assets/images/empresas/coaching/video-poster.jpg' },
  { section: 'villaplanes-short', title: 'Así son los Villa Planes',
    youtube_url: 'https://www.youtube.com/shorts/Y5raiVfRIjs', poster: 'src/assets/images/villa-planes/short-villa-planes.jpg' },
];

const FIELDS = [
  { field: 'status', type: 'string', schema: { default_value: 'published' },
    meta: { interface: 'select-dropdown', width: 'half', display: 'labels',
      note: 'Borrador = el video no se muestra en el sitio',
      options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } } },
  { field: 'section', type: 'string',
    meta: { interface: 'select-dropdown', width: 'half', required: true,
      note: 'En qué página aparece. Si hay varios publicados en la misma sección, se muestra el más reciente.',
      options: { choices: SECTIONS } } },
  { field: 'title', type: 'string',
    meta: { interface: 'input', width: 'full', required: true,
      note: 'Título del video (lo leen los lectores de pantalla y Google). Ej: "Un día en la Ecogranja Villa Juan"' } },
  { field: 'youtube_url', type: 'string',
    meta: { interface: 'input', width: 'full',
      note: 'Enlace de YouTube (pegá la URL completa). Recomendado: carga más rápido que subir el archivo.' } },
  { field: 'video_file', type: 'uuid',
    meta: { interface: 'file', special: ['file'], width: 'full',
      note: 'O subí el archivo de video (MP4). Solo se usa si no hay enlace de YouTube.' } },
  { field: 'poster', type: 'uuid',
    meta: { interface: 'file-image', special: ['file'], width: 'full',
      note: 'Portada (opcional). Si no subís una, se usa la miniatura de YouTube.' } },
];

async function ensureCollection() {
  const exists = await api('/collections/videos').then(() => true, () => false);
  if (!exists) {
    console.log('· creando colección videos…');
    await api('/collections', { method: 'POST', body: {
      collection: 'videos',
      meta: { icon: 'smart_display', note: 'Videos de las páginas (YouTube o archivo). Sin video publicado, el bloque no aparece.' },
      schema: {},
      fields: [{ field: 'id', type: 'integer', meta: { hidden: true, readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true } }],
    } });
  }
  const have = new Set(((await api('/fields/videos')) || []).map((f) => f.field));
  for (const f of FIELDS) {
    if (have.has(f.field)) continue;
    console.log(`  · campo ${f.field}`);
    await api('/fields/videos', { method: 'POST', body: f });
  }
  // Mantiene el dropdown al día si se agregan secciones.
  await api('/fields/videos/section', { method: 'PATCH', body: { meta: { options: { choices: SECTIONS } } } });
  const rels = (await api('/relations/videos').catch(() => [])) || [];
  for (const field of ['video_file', 'poster']) {
    if (rels.some((r) => r.field === field)) continue;
    console.log(`  · relación ${field} → directus_files`);
    await api('/relations', { method: 'POST', body: { collection: 'videos', field, related_collection: 'directus_files' } });
  }
}

async function publicRead() {
  const policies = await api('/policies?filter[name][_eq]=$t:public_label');
  const pub = policies?.[0] ?? (await api('/policies'))?.find((p) => p.name?.includes('public'));
  if (!pub) throw new Error('no encontré la policy pública');
  const existing = (await api(`/permissions?filter[policy][_eq]=${pub.id}&filter[collection][_eq]=videos`).catch(() => [])) || [];
  if (existing.some((p) => p.action === 'read')) return;
  console.log('· lectura pública: videos (solo publicados)');
  await api('/permissions', { method: 'POST', body: {
    policy: pub.id, collection: 'videos', action: 'read', fields: ['*'],
    permissions: { status: { _eq: 'published' } } } });
}

async function ensureBookmarks() {
  const existing = (await api('/presets?fields[]=id&fields[]=bookmark&fields[]=collection&limit=-1').catch(() => [])) || [];
  // Marcadores de videos de secciones que ya no existen (renombradas o retiradas).
  const valid = new Set(SECTIONS.map((s) => s.text));
  for (const p of existing) {
    if (p.collection === 'videos' && p.bookmark && !valid.has(p.bookmark)) {
      console.log(`· bookmark obsoleto: ${p.bookmark}`);
      await api(`/presets/${p.id}`, { method: 'DELETE' });
    }
  }
  const have = new Set(existing.map((p) => p.bookmark).filter(Boolean));
  for (const s of SECTIONS) {
    if (have.has(s.text)) continue;
    console.log(`· bookmark: ${s.text}`);
    await api('/presets', { method: 'POST', body: {
      bookmark: s.text, collection: 'videos', role: null, user: null, icon: 'smart_display',
      filter: { section: { _eq: s.value } },
      layout: 'tabular',
      layout_query: { tabular: { fields: ['status', 'title', 'youtube_url'], sort: ['-id'] } },
    } });
  }
}

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
async function uploadImage(relPath, title) {
  const buf = await readFile(relPath);
  const name = relPath.split(/[/\\]/).pop();
  const form = new FormData();
  form.append('title', title);
  form.append('file', new Blob([buf], { type: MIME[name.split('.').pop().toLowerCase()] || 'application/octet-stream' }), name);
  const res = await fetch(`${URL}/files`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!res.ok) throw new Error(`upload ${relPath} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).data.id;
}

async function seed() {
  for (const v of SEED) {
    const have = (await api(`/items/videos?filter[section][_eq]=${v.section}&limit=1&fields=id`)) || [];
    if (have.length) continue;
    console.log(`· semilla: ${v.title}`);
    const poster = await uploadImage(v.poster, v.title);
    await api('/items/videos', { method: 'POST', body: {
      status: 'published', section: v.section, title: v.title, youtube_url: v.youtube_url, poster } });
  }
}

// El Flow "Rebuild sitio en Coolify" dispara el build cuando cambian items. Sin
// `videos` en su lista, cargar un video no se vería hasta el próximo deploy.
async function ensureFlowTrigger() {
  const flows = (await api('/flows?filter[trigger][_eq]=event&limit=-1').catch(() => [])) || [];
  const flow = flows.find((f) => /rebuild/i.test(f.name ?? ''));
  if (!flow) {
    console.warn('! no encontré el Flow de rebuild: un video nuevo se verá en el próximo deploy');
    return;
  }
  const collections = flow.options?.collections ?? [];
  if (collections.includes('videos')) return;
  console.log(`· Flow "${flow.name}": + videos`);
  await api(`/flows/${flow.id}`, { method: 'PATCH', body: {
    options: { ...flow.options, collections: [...collections, 'videos'] } } });
}

await login();
await ensureCollection();
await publicRead();
await ensureBookmarks();
await seed();
await ensureFlowTrigger();
console.log('✓ videos listo');
