# ESTADO — Ecogranja Villa Juan (sitio web)
_actualizado: 2026-08-08_

## Funcionando
- Dominios con cert Let's Encrypt propio y `http` → `https` 302:
  - `https://villa-juan.com` (apex, principal) — vence 2026-11-03.
  - `https://www.villa-juan.com` — vence 2026-11-03. Mismo contenido; el `canonical` apunta al apex.
  - `https://admin.villa-juan.com` — CMS (Directus 11), panel en `/admin`.
- Auto-deploy: push a `origin/main` dispara el build en Coolify (~5-6 min). Último desplegado: `cb4f68b`.
- Repo y producción SINCRONIZADOS. Árbol limpio.
- 15 URLs del sitemap en 200. Imágenes del CMS servidas por `admin.villa-juan.com`, sin mixed content.
- Contenido publicado en esta sesión:
  - Hero del home: 4 fotos de un evento real, una por slide.
  - Empresas: cards de fin de año con foto propia cada una; galería "Así se vive un día de familia"
    (6 fotos, section `empresas-eventos`); crónica del barril con la foto del puesto de parrilla.
  - Colegios: galería "Así se vive una salida" (4 fotos, section `colegios-galeria`).
  - Footer: en mobile menú y bloque de marca (logo + contacto) en la misma fila, redes debajo.
- Flujo de sesión versionado: `.claude/commands/{retomar,cierre}.md` + hook `SessionStart`.

## Herramientas del CMS
- `cms/replace-image.mjs <fileId> <ruta> [título]` — reemplaza el binario conservando el id. Como el
  HTML publicado ya pide esa URL, el cambio se ve SIN rebuildear. Sirve para cambiar una foto ya
  publicada sin tocar relaciones.
- `cms/galleries.mjs` y `replace-image.mjs` aceptan `DIRECTUS_ADMIN_TOKEN` además de email/clave.
- Contra prod: `$env:DIRECTUS_URL = "https://admin.villa-juan.com"` antes de correrlos.

## Roto / a medias
- **Sin acceso al panel de Directus.** La clave de `admin@villa-juan.com` no se conoce. Está en las
  Environment Variables del recurso de Directus en Coolify (`DIRECTUS_ADMIN_PASSWORD`), pero solo
  sirve si nunca se cambió desde el panel. Si no, resetear desde la terminal del contenedor:
  `npx directus users passwd --email admin@villa-juan.com --password '<nueva>'`.
- **Token estático de admin activo y comprometido**: se pegó en un chat. Borrarlo en cuanto haya
  acceso al panel (Usuarios → admin → Admin Options → vaciar Token → guardar).
- Los temp URLs `sslip.io` (sitio y Directus) quedaron en 503. Es esperado — no usarlos.
- `www` sirve contenido en vez de redirigir al apex. No afecta SEO (el `canonical` apunta al apex);
  si se prefiere el 301, se activa en Coolify.

## Trampas conocidas (no revertir sin leer)
- `src/assets/images/home/bienvenida_globo.svg` lleva `preserveAspectRatio="none"`. Sin ese atributo
  el globo ignora el `background-size:100% 100%` y en mobile el texto se sale. **Si se re-exporta el
  SVG desde el diseño, hay que volver a agregarlo.**
- `villa-planes.astro:203` — el `div` de la tabla comparativa lleva `relative` y no es decorativo:
  los `<span class="sr-only">` de las celdas son `position:absolute` y sin ancestro posicionado se
  escapan del `overflow-x-auto`, estirando el scroll de toda la página (145px en mobile).
- Los `hero_home_{01,restaurante,coaching,empresariales}.jpg` siguen en uso como portadas de blog y
  miniaturas de Crónicas. El hero del carrusel usa archivos aparte (`hero_home_evento_*.jpg`).

## Decisiones pendientes (no bloquean)
- El slide "Coaching con Caballos" del hero muestra carpas de refrigerio: en el lote de fotos de
  eventos no hay ninguna con caballos. Conseguir una, o devolverle su foto original.
- La foto del puesto de parrilla aparece dos veces en `/empresas` (galería de eventos + crónica del
  barril) y es además el slide 2 del hero.
- El hero bajó de 2200 a 1872 px de ancho (resolución nativa de las fotos nuevas). Se nota en
  monitores grandes.
- La dirección aparece dos veces en el home: tarjetas Horarios/Ubicación de "¡A un pequeño galope de
  la ciudad!" (`index.astro`) y la franja del bloque del mapa. Definir si se recorta una.

## Próximo paso (uno solo)
- Recuperar el acceso al panel de Directus (leer `DIRECTUS_ADMIN_PASSWORD` en Coolify y, si no
  sirve, resetear con `npx directus users passwd`) y, ya adentro, borrar el token estático de admin.
