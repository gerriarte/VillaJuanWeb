# CLAUDE.md — Ecogranja Villa Juan (sitio web)

Fuente única de verdad del proyecto. Toda contribución (humana o IA) respeta esto.

## Qué es
Sitio **lead-gen** de una ecogranja de experiencias y eventos en Tenjo, Cundinamarca.
NO es restaurante, NO hay ecommerce. Conversión = **cotización de eventos** (formularios por
vertical + WhatsApp). Verticales: Villa Planes (paseos/pasadías), Celebraciones, Empresas,
Colegios, Gastronomía. Museo del Caballo = "próximamente".

## Stack (CERRADO — no proponer alternativas)
- **Astro (SSG) + Tailwind v4** (config CSS-first `@theme`, NO `tailwind.config.js`).
- TypeScript strict.
- Fonts: **Astro Fonts API** estable (`fontProviders.local()`), Sunrise self-hosted.
- Fase posterior (NO ahora): GSAP + ScrollTrigger, CMS Directus headless.
- Deploy futuro: Coolify (VPS) + imágenes en R2/B2 + Cloudflare CDN.
- Diseño fuente: `VillaJuan.fig` (import XD→Figma) vía Pencil MCP. NUNCA leer `.fig`/`.pen`
  con Read/Grep, solo Pencil MCP. Es referencia VISUAL: el export sale div-soup absoluto,
  se re-autoriza semántico, no se copia.

## Invariantes (obligatorios en todo componente)
1. **Mobile-first real.** El diseño es desktop 1920; se genera responsive, no se copia.
2. **Contraste WCAG AA.** Si el diseño falla (texto claro sobre verde/lima), se CORRIGE.
   Regla activa: texto sobre `scene-green` va oscuro (`ink`), nunca blanco.
3. **HTML semántico.** Cero div-soup, cero posición absoluta como layout.
4. **Cero JS por defecto.** Astro islands solo donde sea imprescindible.
5. **Imágenes** AVIF/WebP, responsive, lazy (`astro:assets` `<Image>`). Nada de raster pesado crudo.
6. **CWV: LCP < 2.5s.** No romperlo.
7. **Estilo solo vía tokens** (`src/styles/tokens.css`). Nunca hex sueltos en componentes.

## Tokens (única fuente de estilo)
`src/styles/tokens.css`, importado desde `src/styles/global.css`.
- **Marca:** `brand` / `brand-strong` (verde), `cta` / `cta-strong` (naranja), `accent` (lima).
- **Neutrales:** `ink`, `surface`, `bg`, `line`.
- **Escena** (gradientes full-bleed, clases `.scene-green|.scene-dark|.scene-orange`): verde→oscuro→naranja.
- Uso en clases Tailwind: `text-cta`, `bg-cta-strong`, `border-line`, `font-display`, `font-body`.
- Descartado como ruido (NO es token): el borde `#707070` de la plantilla MTM.

## Tipografía
- `font-display` (Sunrise Villa Juan): SOLO display/headings grandes/acentos y labels de CTA.
  **NUNCA** en body (mata legibilidad + CWV).
- `font-body` (stack de sistema, 0 descarga): todo el texto corrido y UI.

## Navegación y rutas
- Nav unificado en `src/lib/site.ts` (única fuente). Vertical de paseos = **"Villa Planes"**
  (nombre de marca), NO "Pasadías" (keyword SEO, va en `<title>`/H1 de esa página).
- CTAs de conversión → cotización por vertical / WhatsApp, con `// TODO` de destino real.
  NUNCA apuntan a páginas internas.

## Animación e interacciones (SOLO al implementar la fase de animación, post-scaffold)
- GSAP/ScrollTrigger SOLO en islands con `client:media="(min-width:768px)"`. Nunca `client:load`.
  El JS de animación NO se descarga en mobile.
- Doble candado con `gsap.matchMedia("(min-width:768px)")` dentro del island.
- `prefers-reduced-motion: reduce` respetado siempre, en cualquier viewport.
- Mobile NO es "sin animación": micro-interacciones en CSS puro (hover/focus/tap),
  reveals con IntersectionObserver liviano, cero GSAP.
- Micro-interacciones SIEMPRE en CSS, nunca JS.
- Con View Transitions (`<ClientRouter />`): re-inicializar ScrollTrigger en `astro:page-load`
  (bug clásico Astro+GSAP).

## Notas de verificación (Astro 7)
- **Fonts API**: estable, sin flag. Local vía `fontProviders.local()` con `options.variants`
  (`weight`, `style`, `src`). Fuente en `src/assets/fonts` (fuera de `public/`). Render con
  `<Font cssVariable="--font-sunrise" preload />` en `<head>`.
- **astro:assets**: `<Image>`/`<Picture>` para responsive AVIF/WebP. Verificar `widths`/`sizes`.
- **View Transitions**: `<ClientRouter />` de `astro:transitions` (post-scaffold).
- `site` debe estar seteado en `astro.config.mjs` (lo exige `@astrojs/sitemap`).

## Comandos
- `pnpm dev` · `pnpm build` · `pnpm preview` · `pnpm check`.
- `pnpm build` = `astro check && astro build`: el build de Astro NO tipa los `.astro`,
  el check sí. Un error de tipos frena el despliegue (esa es la intención).
- **TypeScript fijado en 6.x**: `astro check` usa la API programática de `tsc` que el
  compilador nativo (TS 7+) todavía no expone. No subir a 7 hasta que la soporte.
- Dev en background: `astro dev --background` (`astro dev stop|status|logs`).

## Estructura
```
src/
  assets/fonts/        Sunrise (.ttf)
  components/{ui,sections,layout}/
  layouts/Base.astro   html + head + Header/Footer + <Font>
  lib/site.ts          nav, verticales, contacto
  pages/               index + 1 por vertical + blog/
  styles/{global,tokens}.css
design/                fuentes de diseño (.fig, export de referencia) — gitignoreadas
```
