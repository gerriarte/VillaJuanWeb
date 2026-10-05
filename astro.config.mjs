// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Dominio de producción (lo requiere @astrojs/sitemap). `www` redirige al apex.
  site: 'https://villa-juan.com',

  // Los planes pasaron de 3 (Trote y Galope / Trocha y Galope / Paso Fino) a 4 con slugs
  // nuevos. Las URLs viejas pueden estar indexadas o compartidas: llevan al plan equivalente.
  redirects: {
    '/villa-planes/trote-y-galope': '/villa-planes/trote',
    '/villa-planes/trocha-y-galope': '/villa-planes/trocha',
  },

  // Fonts API estable (Astro 7). Sunrise = SOLO display/headings/acentos.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Sunrise Villa Juan',
      cssVariable: '--font-sunrise',
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/SunriseVillaJuan.ttf'],
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
