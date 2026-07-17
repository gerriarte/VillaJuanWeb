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
}

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
  if (await collectionExists('posts')) {
    console.log('· la colección posts ya existe, salto esquema');
  } else {
    await createSchema();
  }
  await publicRead();
  await seed();
  const posts = await api('/items/posts?fields[]=slug&fields[]=title&limit=-1');
  console.log(`\n✓ listo. posts en Directus: ${posts.length}`);
  posts.forEach((p) => console.log(`   · ${p.slug}`));
  console.log('\nAdmin:  http://localhost:8055   (login con DIRECTUS_ADMIN_EMAIL/PASSWORD del .env)');
})().catch((e) => { console.error('\n✗ error:', e.message); process.exit(1); });
