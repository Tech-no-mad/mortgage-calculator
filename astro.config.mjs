// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://mortgagedash.app',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});