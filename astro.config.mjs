// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: confirm final production domain before launch (placeholder based on info@shiftplay.jp).
  site: 'https://shiftplay.jp',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
