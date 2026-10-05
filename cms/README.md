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

## Videos — `videos`

```bash
node --env-file=.env cms/videos.mjs   # crea colección, permisos, bookmarks, siembra y suma `videos` al Flow
```

`status` · `section` · `title` · `youtube_url` (cualquier URL de YouTube o el ID suelto) ·
`video_file` (MP4 subido, solo si no hay YouTube) · `poster` (opcional; sin portada se usa la
miniatura de YouTube). Secciones:

| Sección | Dónde | Sin video publicado |
|---|---|---|
| `home-video` | bloque de video del home | no se muestra |
| `empresas-video` | loop de fondo del banner de Empresas | solo la foto, sin botón |
| `empresas-coaching-video` | video destacado de la galería de coaching | no se muestra |
| `villaplanes-short` | shorts verticales junto a los platos (varios) | no se muestran |
| `museo-video` | Museo del Caballo, en el home | no se muestra |

Si hay varios publicados en una sección de un solo video, gana el más reciente. La semilla
local del código solo se usa si el CMS **no responde**: si el cliente borra o despublica un
video, desaparece del sitio. YouTube se muestra con fachada (el player carga al hacer clic).

## Banners, planes y documentos — `cms/editable.mjs`

```bash
node --env-file=.env cms/editable.mjs  # crea colecciones, permisos, bookmarks, siembra y actualiza el Flow
```

- **`banners`** — foto principal de cada página (`empresas-hero`, `celebraciones-hero`,
  `colegios-hero`, `villaplanes-hero`, `blog-hero`) y la foto del Museo (`home-museo`).
  `status` · `section` · `image` · `alt`. Sin banner publicado, la página usa la foto del repo.
  Son el LCP de cada página: el sitio hace `preconnect` al CMS y las pide `eager` + `fetchpriority=high`.
- **`planes`** — columnas de la tabla de Villa Planes: `name` · `slug` (URL `/villa-planes/<slug>`;
  no cambiarlo una vez publicado) · `hours` · `price_adult` / `price_child` (enteros, en pesos) ·
  `color` (oscuro: contraste AA) · `description` · `pdf`. Sin PDF, el plan sale en la tabla pero
  sin botón ni página. Orden = arrastrar (`sort`).
- **`plan_servicios`** — filas de la tabla: `name` · `note` · `planes` (casillas con los slugs
  que lo incluyen). Las casillas se arman con los planes del CMS: si se agrega un plan, volver a
  correr el script para que aparezca como opción.
- **`documentos`** — PDFs sueltos por `key` (hoy `menu`).
- **`gallery`** — suma la sección `museo-galeria` (Museo del Caballo; vacía = no se muestra).

Los PDF del CMS se copian al sitio en el build (`src/pages/pdf/[name].ts` → `/pdf/*.pdf`), así el
visor los embebe desde el mismo origen. El script también deja el Flow de rebuild escuchando
todas las colecciones de contenido (`create`, `update` y `delete`).

## Panel ordenado para el cliente — `cms/navegacion.mjs`

```bash
node --env-file=.env cms/navegacion.mjs  # carpetas del menú, nombres en español, íconos y etiquetas de campos
```

Solo metadatos de presentación (no toca datos). Menú resultante: **Inicio** (carrusel) ·
**Contenido por página** (banners, tarjetas, galerías, videos — dentro de cada uno, un marcador
por página) · **Villa Planes y menú** (planes, servicios, PDFs) · **Blog**. Los marcadores usan
el prefijo de la página ("Inicio · Galería", "Empresas · Banner principal"…).

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
