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
  vite: {
    plugins: [tailwindcss()],
    // Safari anterior a la 18 necesita -webkit-backdrop-filter: con estos objetivos el
    // compilador de CSS escribe las dos variantes del desenfoque de cristal
    build: { cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4', 'ios16.4'] },
  },
})
