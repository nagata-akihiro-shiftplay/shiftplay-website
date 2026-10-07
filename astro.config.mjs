// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://shiftplay.jp',
  integrations: [sitemap()],
  // Old URLs of pages archived as src/pages/_*.astro (2026-10-07). Remove the matching
  // entry when restoring an archived page, or the redirect will shadow it.
  redirects: {
    '/service': '/#services',
    '/service/training': '/#services',
    '/company': '/#company',
    '/download': '/contact',
    '/news': '/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
