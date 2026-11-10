// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://teologiaenaccion.org',
  output: 'static',
  integrations: [vue(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
