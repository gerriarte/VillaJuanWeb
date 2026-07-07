// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: confirmar dominio de producción real (lo requiere @astrojs/sitemap).
  site: 'https://www.villa-juan.com',

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
