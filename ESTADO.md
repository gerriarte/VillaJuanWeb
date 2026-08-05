# ESTADO — Ecogranja Villa Juan (sitio web)
_actualizado: 2026-08-05_

## Funcionando
- Cutover a dominios reales COMPLETO. Los tres con cert Let's Encrypt propio y `http` → `https` 302:
  - `https://villa-juan.com` (apex, principal) — vence 2026-11-03.
  - `https://www.villa-juan.com` — vence 2026-11-03. Sirve el mismo contenido; el `canonical` apunta al apex.
  - `https://admin.villa-juan.com` — CMS (Directus 11), panel en `/admin`.
- Auto-deploy: push a `origin/main` dispara el build en Coolify. Verificado con `407aa6e` y `c2daab9`.
- Live: menú PDF nuevo (2,7 MB), video del home `rUnbtav3Nlo`, 2 shorts en la galería de Empresas, y el mapa de ubicación dentro de la columna del FAQ (empareja altura con el formulario).
- 15 URLs del sitemap en 200. Imágenes del CMS servidas por `admin.villa-juan.com`, sin mixed content.
- Flujo de sesión versionado: `.claude/commands/{retomar,cierre}.md` + hook `SessionStart`.

## Roto / a medias
- Nada bloqueante.
- Los temp URLs `sslip.io` (sitio y Directus) quedaron en 503 al asignar los dominios reales. Es esperado — no usarlos más en scripts ni chequeos.
- `www` sirve contenido en vez de redirigir al apex. No es un problema de SEO porque el `canonical` apunta al apex, pero si se prefiere el redirect 301 hay que activarlo en Coolify.

## Decisión pendiente que bloquea
- Los 2 shorts de la "Galería de Coaching" de Empresas (`xHZjVMr5sNg`, `Y5raiVfRIjs`) **no son del taller**: muestran juegos infantiles y gastronomía, en una página cuyo objetivo es cotización corporativa. Definir si se quedan, si se separan con un subtítulo propio ("Más de la Ecogranja") o si se mueven a Villa Planes / home.
- La dirección aparece DOS veces en el home: tarjetas Horarios/Ubicación de "¡A un pequeño galope de la ciudad!" (`index.astro:496-508`) y la franja del bloque del mapa. Definir si se recorta una.

## Próximo paso (uno solo)
- Resolver la ubicación de los 2 shorts de Empresas (dejarlos con subtítulo propio o moverlos), que es lo único que quedó abierto sobre contenido publicado.
