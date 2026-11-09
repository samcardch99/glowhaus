import type { APIRoute } from 'astro'

// En el dominio temporal de Hostinger no se indexa nada; en el definitivo, todo.
export const GET: APIRoute = ({ site }) => {
  const staging =
    process.env.NOINDEX === '1' || !site || site.hostname.endsWith('hostingersite.com')
  const body = staging
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
