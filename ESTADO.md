# ESTADO — Ecogranja Villa Juan (sitio web)
_actualizado: 2026-10-05_

## Funcionando
- Dominios con cert Let's Encrypt propio y `http` → `https` 302:
  - `https://villa-juan.com` (apex, principal) — vence 2026-11-03.
  - `https://www.villa-juan.com` — vence 2026-11-03. Mismo contenido; el `canonical` apunta al apex.
  - `https://admin.villa-juan.com` — CMS (Directus 11.17), panel en `/admin`.
- Repo y producción SINCRONIZADOS en `04f80e4`. Árbol limpio.
- **Deploy de código**: GitHub Actions `.github/workflows/deploy.yml` (push a `main` → `pnpm build` →
  API de Coolify con `force=true`). NO es webhook de Coolify. Si "no sale": `gh run list`.
- **Deploy de contenido**: Flow de Directus "Rebuild sitio en Coolify" — activo, con token real,
  `force=true`, escucha posts, cards, gallery, slides, videos, banners, planes, plan_servicios,
  documentos (create/update/delete). Probado: cambio en panel → build nuevo en ~5 min.
- **Todo el contenido es editable en Directus** (fallback a la semilla del código si el CMS no responde):
  banners de cada página + foto del Museo (`banners`), videos (`videos`: home, hero y coaching de
  Empresas, shorts de Villa Planes, Museo), galería y video del Museo del Caballo (vacíos = no se
  muestran), tabla de Villa Planes (`planes`, `plan_servicios`), PDFs de planes y menú (`documentos`;
  se copian al sitio en build vía `src/pages/pdf/[name].ts`). Redirects de slugs viejos de planes en
  `astro.config.mjs`.
- Panel ordenado por carpetas y en español (`cms/navegacion.mjs`).
- Accesos: `cm@mtmmarcatumarca.com` (Administrator, ya ingresó) y `admin@villa-juan.com` (Administrator).
  El token estático comprometido fue borrado.
- Plane (VJW): 22 subtareas en Hecho; tareas madre [1]–[6] en "Esperando cliente"; VJW-28 (guía de
  uso de Directus + pendientes) en Backlog asignada a CM.

## Herramientas del CMS (todas idempotentes; contra prod con `DIRECTUS_URL=https://admin.villa-juan.com`)
- `cms/editable.mjs` — banners, planes, plan_servicios, documentos, sección museo-galeria, permisos,
  marcadores, Flow. Correrlo de nuevo si se agrega un plan (arma las casillas de servicios).
- `cms/videos.mjs` — colección `videos`, secciones, semillas, limpia marcadores obsoletos.
- `cms/navegacion.mjs` — carpetas, nombres y etiquetas en español.
- `cms/replace-image.mjs <fileId> <ruta>` — reemplaza una foto conservando su id (se ve sin deploy;
  ojo: Directus cachea `/assets` 30 días en el navegador).
- Documentación de todas las colecciones: `cms/README.md`.

## Roto / a medias
- Nada roto en el sitio.
- PDFs de los planes son la versión vieja (portada "Trote y Galope"/"Trocha y Galope"); Galope no tiene
  PDF → sin botón ni página `/villa-planes/galope`. Lo carga CM desde el panel.
- VJW-17 sigue titulada "Villa Planes: habilitar galería…" (es Museo del Caballo); el renombre por API
  quedó bloqueado. Está en la lista de CM.
- Directus no tiene email configurado: sin invitaciones ni "olvidé mi contraseña".

## Trampas conocidas (no revertir sin leer)
- `src/assets/images/home/bienvenida_globo.svg` lleva `preserveAspectRatio="none"`. Si se re-exporta el
  SVG desde el diseño, hay que volver a agregarlo.
- `villa-planes.astro`, tabla comparativa: el `div` con `relative overflow-x-auto` no es decorativo
  (los `sr-only` de las celdas se escapan del scroll sin ancestro posicionado).
- Guardar el Flow desde el panel con una pestaña vieja pisa cambios hechos por API (pasó: volvió a
  `force=false` y quedó `Bearer8|…` sin espacio). Tras tocarlo, verificar URL y header por API.
- La animación de ingreso (`global.css`) anima la imagen `fetchpriority="high"` SOLO con `transform`
  (nunca opacidad) para no retrasar el LCP; `fill-mode: backwards` para no dejar transform en el header.
- Las páginas de planes salen de `getPlanes()` (solo planes con PDF); cambiar un `slug` en el CMS cambia
  la URL.

## Decisiones pendientes (no bloquean)
- Crear para el cliente final un usuario con permisos solo de contenido (hoy solo hay admins).
- El slide "Coaching con Caballos" del hero muestra carpas: falta una foto con caballos.

## Próximo paso (uno solo)
- Cambiar la clave de `admin@villa-juan.com` (circuló en conversaciones y está en notas) desde el panel
  de Directus → User Directory → admin → Password, y guardarla solo en el gestor de contraseñas.
