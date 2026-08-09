// Reemplaza el contenido de un archivo ya existente en Directus, conservando su id
// (y por tanto las relaciones de las cards/galerías que lo apuntan).
//   node --env-file=.env cms/replace-image.mjs <fileId> <rutaLocal> [título]
// Con DIRECTUS_URL apuntando al CMS destino (local o https://admin.villa-juan.com).
// Auth: DIRECTUS_ADMIN_TOKEN (token estático) si está; si no, email/password del .env.
import { readFile } from 'node:fs/promises';

const URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;
const STATIC_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' };

async function login() {
  if (STATIC_TOKEN) return STATIC_TOKEN;
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error('login falló: ' + (await res.text()));
  return (await res.json()).data.access_token;
}

const [fileId, relPath, title] = process.argv.slice(2);
if (!fileId || !relPath) {
  console.error('uso: node --env-file=.env cms/replace-image.mjs <fileId> <rutaLocal> [título]');
  process.exit(1);
}

const token = await login();
const buf = await readFile(relPath);
const name = relPath.split(/[/\\]/).pop();
const ext = name.split('.').pop().toLowerCase();

const form = new FormData();
if (title) form.append('title', title);
// El MIME correcto es lo que habilita las transformaciones (?width/format) en Directus.
form.append('file', new Blob([buf], { type: MIME[ext] || 'application/octet-stream' }), name);

// PATCH multipart sobre /files/<id> sustituye el binario y regenera dimensiones y caché.
const res = await fetch(`${URL}/files/${fileId}`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
const text = await res.text();
if (!res.ok) throw new Error(`PATCH /files/${fileId} → ${res.status}: ${text.slice(0, 300)}`);
const d = JSON.parse(text).data;
console.log(`✓ ${fileId} ← ${name}  (${d.width}×${d.height}, ${Math.round(d.filesize / 1024)} KB)`);
