# CMS — Directus (headless)

El blog se sirve desde **Directus** en build-time. Si Directus no está corriendo,
el sitio usa el **contenido semilla local** (`src/lib/blog.ts`) y compila igual.

## Primer arranque

```bash
cp .env.example .env      # y completa/ajusta los valores
docker compose up -d      # Directus + Postgres (http://localhost:8055)
node --env-file=.env cms/bootstrap.mjs   # crea esquema, permisos y siembra
pnpm build                # el sitio ya lee de Directus
```

- **Admin:** http://localhost:8055 (login con `DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD`).
- El bootstrap es **idempotente**: si la colección o los posts ya existen, no los duplica.

## Cómo funciona

- `src/lib/directus.ts` — cliente del SDK. Si `DIRECTUS_URL` no está seteada → `directus = null`.
- `src/lib/blog.ts` — `getPosts()` / `getPost()` consultan Directus y **caen a la semilla** ante cualquier fallo.
- Lectura **pública** de `posts` (publicados) y `directus_files`, así el navegador carga las
  imágenes de `/assets` sin token. Las portadas se sirven optimizadas: `?width=…&format=webp`.
- Cuerpo del artículo en **Markdown** (`marked` → HTML, estilado con `.post-body` en `global.css`).

## Colección `posts`

`status` · `title` · `slug` · `date` · `categories` (tags) · `excerpt` · `cover` (imagen) · `body` (Markdown).

## Colección `cards`

Tarjetas de las verticales, agrupadas por `section`: `celebraciones`, `colegios-talleres`,
`empresas-celebraciones`, `empresas-experiencias`, `empresas-beneficios`, `empresas-bienestar`,
`villaplanes-barril`. Campos: `status` · `section` · `sort` · `title` · `note` · `body` ·
`image` · `image_right`.

## Carruseles y galerías — `gallery` y `slides`

Se crean con un script aparte (idempotente, igual que el bootstrap):

```bash
node --env-file=.env cms/galleries.mjs              # crea, permisos, bookmarks y siembra
node --env-file=.env cms/galleries.mjs --seed=false # solo esquema, sin subir fotos
```

- **`gallery`** — fotos sueltas de cada galería. `status` · `section` · `sort` · `image` · `alt`.
  Secciones: `home-galeria` (carrusel giratorio del home), `empresas-coaching` (galería del
  taller, con lightbox) y `villaplanes-comida` (tira de platos).
- **`slides`** — carrusel del hero del home (`section: home-hero`). Además de `image` y `alt`:
  `title`, `title_image` (opcional, el título como gráfico), `text` y el botón
  (`cta_label`, `cta_href`, `cta_new_tab`). Un slide sin imagen o sin botón se ignora.

Para **agregar** una foto se crea un item; para **quitarla**, se borra o se pasa a borrador;
para **reordenar**, se arrastra (campo `sort`). Si una sección queda **vacía**, el sitio vuelve
a las fotos del repo (la semilla de cada página), así nunca se rompe.

## Producción (futuro)

En el VPS (Coolify) se levanta el mismo `docker-compose`, se apunta `DIRECTUS_URL` a la
instancia real y se dispara un **rebuild del sitio por webhook** al publicar. Para cerrar la
API, crear un token de solo-lectura y setearlo en `DIRECTUS_TOKEN`.

## Comandos útiles

```bash
docker compose logs -f directus   # logs
docker compose down               # apagar (conserva datos en volúmenes)
docker compose down -v            # apagar y BORRAR datos
```
