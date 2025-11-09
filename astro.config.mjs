// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://github.com/Emerson147',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
  // Puedes agregar sitemap cuando instales @astrojs/sitemap
  // integrations: [sitemap()],
});
