## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Animación e interacciones (aplica cuando se implemente la fase de animación)

- GSAP/ScrollTrigger SOLO en islands con `client:media="(min-width:768px)"`.
  Nunca `client:load`. El JS de animación NO debe descargarse en mobile.
- Doble candado con `gsap.matchMedia("(min-width:768px)")` dentro del island.
- `prefers-reduced-motion: reduce` respetado siempre, en cualquier viewport.
- Mobile NO es "sin animación": micro-interacciones en CSS puro (hover, tap,
  transiciones). Reveals mobile con CSS/IntersectionObserver liviano, cero GSAP.
- Micro-interacciones (hover/focus/tap) SIEMPRE en CSS, nunca JS.
- Si se usan View Transitions (<ClientRouter />): re-inicializar ScrollTrigger
  en cada navegación (evento astro:page-load). Es el bug clásico Astro+GSAP.
- NADA de esto se implementa antes de terminar la maqueta estática (post-scaffold).