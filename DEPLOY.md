# Despliegue en Coolify — Ecogranja Villa Juan

Arquitectura: **sitio Astro estático (SSG)** + **Directus (CMS)** + **Postgres**.
El sitio lee el CMS **en build-time** y se sirve como archivos estáticos; al publicar
contenido hay que **reconstruirlo** (webhook). Si el CMS no responde, el sitio compila
igual con el contenido semilla local (`src/lib/blog.ts`, `src/lib/content.ts`).

Son **3 recursos** en Coolify + dominios + 1 webhook de rebuild.

---

## 0. Requisitos previos

- VPS con Coolify. Recomendado **≥ 4 GB RAM** (Directus + Postgres + los builds con `sharp`).
- DNS apuntando al VPS (`13.140.179.23`), registros A:
  - `villa-juan.com` (apex, dominio principal) + `www` → redirect al apex → **sitio**
  - `admin.villa-juan.com` → **Directus**
- Los secretos de producción (genéralos nuevos, no reutilices los de dev):
  ```
  node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"   # DIRECTUS_SECRET
  ```
  Necesitas: `DB_PASSWORD`, `DIRECTUS_SECRET`, `DIRECTUS_ADMIN_PASSWORD`.

---

## 1. Postgres

`New Resource → Database → PostgreSQL 16`.
- Guarda usuario / password / nombre de base. Coolify le da volumen persistente.
- Si en su lugar usas `docker-compose.prod.yml` (incluye su propio Postgres), sáltate este paso.

## 2. Directus (CMS)

Opción recomendada: `New Resource → Docker Compose` y usa **`docker-compose.prod.yml`** del repo.

Variables de entorno del recurso (en la UI de Coolify):

| Variable | Valor |
|---|---|
| `SERVICE_FQDN_DIRECTUS` | `admin.villa-juan.com` |
| `DIRECTUS_SECRET` | *(hex nuevo)* |
| `DB_USER` | `directus` |
| `DB_PASSWORD` | *(clave nueva)* |
| `DB_DATABASE` | `villajuan` |
| `DIRECTUS_ADMIN_EMAIL` | `admin@villa-juan.com` |
| `DIRECTUS_ADMIN_PASSWORD` | *(clave nueva)* |
| `SITE_ORIGIN` | `https://villa-juan.com` |

Coolify configura dominio + SSL automáticamente. Verifica que arranca en `https://admin.villa-juan.com`.

### 2.1 Sembrar esquema + contenido (una sola vez)

`cms/bootstrap.mjs` es idempotente: crea colecciones (`posts`, `cards`), permisos públicos
de lectura, bookmarks por sección y siembra el contenido inicial. Ejecútalo apuntando a prod:

```bash
DIRECTUS_URL=https://admin.villa-juan.com \
DIRECTUS_ADMIN_EMAIL=admin@villa-juan.com \
DIRECTUS_ADMIN_PASSWORD='<clave-admin-prod>' \
node cms/bootstrap.mjs
```

> Alternativa (si ya cargaste contenido a mano en el CMS local): migrar el esquema con
> `npx directus schema snapshot` / `apply` y mover ítems + archivos. El bootstrap es más simple.

## 3. Sitio Astro (estático)

`New Resource → Application → Public Repository` → `https://github.com/gerriarte/VillaJuanWeb` (rama `main`).

- **Build Pack:** `Nixpacks` (o *Static Site*).
- **Install:** `pnpm install --frozen-lockfile`
- **Build:** `pnpm build`
- **Output / Publish directory:** `dist`
- **Variable de entorno (build-time):** `DIRECTUS_URL = https://admin.villa-juan.com`
- **Dominio:** `villa-juan.com` (agrega también `www.villa-juan.com` con redirect al apex).

El primer deploy generará el sitio leyendo el CMS de prod. Si el CMS aún no está sembrado,
el build cae a la semilla local y funciona igual (luego se reconstruye).

## 4. Rebuild automático al publicar (webhook)

Como es SSG, el sitio queda estático hasta que se reconstruya. Automatízalo:

1. En Coolify, en el recurso del **sitio** → copia su **Deploy Webhook URL** (y token si aplica).
2. En Directus → **Settings → Flows → Create Flow**:
   - **Trigger:** *Event Hook* → `items.create` **e** `items.update` en las colecciones `posts` y `cards`.
   - **Operation:** *Webhook / Request URL* → `POST` a la Deploy Webhook URL de Coolify.
3. Publicar/editar contenido dispara un rebuild del sitio.

---

## Notas

- **Secretos:** viven solo en la UI de Coolify. `.env` está gitignoreado; nunca se commitea.
- **Volúmenes persistentes:** Postgres (`db_data`) y uploads de Directus (`directus_uploads`)
  ya están declarados; verifícalos en Coolify para no perder datos entre deploys.
- **Lectura pública:** el CMS expone `posts`, `cards` y `directus_files` en solo-lectura
  (sitio y navegador leen sin token). Para cerrarlo, crea un token de solo-lectura y setéalo
  como `DIRECTUS_TOKEN` en el recurso del sitio.
- **CDN (opcional):** Cloudflare delante de `villa-juan.com` (contemplado en CLAUDE.md).
- **`docker-compose.yml`** (raíz) es solo para **dev local**; en prod se usa `docker-compose.prod.yml`.
