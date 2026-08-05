# ESTADO — Ecogranja Villa Juan (sitio web)
_actualizado: 2026-08-05_

## Funcionando
- Producción en `https://villa-juan.com` (apex) con cert Let's Encrypt propio, vence 2026-11-03. `http` → `https` 302.
- CMS en `https://admin.villa-juan.com` (Directus 11), cert propio. Panel en `/admin`.
- Auto-deploy: push a `origin/main` dispara el build en Coolify. Verificado con `407aa6e`.
- Live de esta sesión: menú PDF nuevo (2,7 MB), video del home `rUnbtav3Nlo`, 2 shorts en la galería de Empresas, mapa de ubicación bajo el FAQ.
- 15 URLs del sitemap en 200. Imágenes del CMS servidas por `admin.villa-juan.com`, sin mixed content.

## Roto / a medias
- **`www.villa-juan.com` no está asignado en Coolify.** Presenta `CN=TRAEFIK DEFAULT CERT` (untrusted) y devuelve 404 por http / 503 por https. El DNS ya está bien (CNAME → apex); falta solo agregar el dominio al recurso del sitio. Quien tenga guardado el `www` viejo recibe error de certificado.
- Los temp URLs `sslip.io` (sitio y Directus) quedaron en 503 al asignar los dominios reales. Es esperado — no usarlos más en scripts ni chequeos.

## Decisión pendiente que bloquea
- Los 2 shorts agregados a la "Galería de Coaching" de Empresas (`xHZjVMr5sNg`, `Y5raiVfRIjs`) **no son del taller**: muestran juegos infantiles y gastronomía, en una página cuyo objetivo es cotización corporativa. Definir si se quedan ahí, si se separan con un subtítulo propio ("Más de la Ecogranja") o si se mueven a Villa Planes / home.

## Próximo paso (uno solo)
- En Coolify, recurso del **sitio** → Domains: agregar `https://www.villa-juan.com` con redirect al apex. El cert se emite solo.
