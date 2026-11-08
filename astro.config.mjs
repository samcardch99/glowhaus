import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

// Mientras el dominio no esté conectado, SITE_URL permite generar URLs absolutas
// (canonical, sitemap, Open Graph) para el sitio temporal de Hostinger.
const site = process.env.SITE_URL ?? 'https://glowhausaesthetics.net'

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'es', locales: { es: 'es-US', en: 'en-US' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
})
