import { treatments, fromLabel, needsConsult, type Treatment } from '../../data/treatments'
import { baSets, type BASet } from '../../data/results'
import { site } from '../../data/site'
import { pathFor, treatmentPath, tr, type Lang } from '../../i18n'

// Utilidades de las páginas de tratamientos (lista y ficha).

/** Póster del vídeo: mismo nombre en public/media, en .jpg */
export const posterFor = (video: string) => video.replace(/\.mp4$/, '.jpg')

/** Número de categoría con dos cifras: «01» */
export const catNumber = (i: number) => String(i + 1).padStart(2, '0')

/** Columnas de la lista «INCLUYE» como en el diseño (escritorio y móvil) */
export function itemCols(n: number) {
  const desktop =
    n > 10
      ? 'min-[760px]:grid-cols-3'
      : n > 4
        ? 'min-[760px]:grid-cols-2'
        : 'min-[760px]:grid-cols-1'
  const maxW =
    n > 10 ? 'max-w-[960px]' : n > 4 ? 'max-w-[640px]' : 'max-w-[320px] max-[759px]:max-w-none'
  const mobile = n > 6 ? 'grid-cols-2' : 'grid-cols-1'
  return [mobile, desktop, maxW].join(' ')
}

/** Fotos de antes y después más relevantes para cada ficha */
const BA_BY_SLUG: Record<string, string[]> = {
  'fotona-4d': ['Fotona', 'LipLase'],
  inyectables: ['Botox'],
  'rellenos-dermicos': ['Relleno de labios'],
}
export function baSetsFor(t: Treatment): BASet[] {
  const tabs = BA_BY_SLUG[t.slug.es]
  if (!tabs) return baSets
  return tabs.map((tab) => baSets.find((s) => s.tab === tab)).filter((s): s is BASet => !!s)
}

/** Importes de un texto de precio: «$1,999» → 1999; «$299 / mes» → 299 */
const amount = (p: string) => {
  const m = p.match(/\$([\d,]+)/)
  return m ? Number(m[1]!.replace(/,/g, '')) : undefined
}

export function priceRange(t: Treatment) {
  const nums = t.items.map((it) => amount(it.p)).filter((n): n is number => n !== undefined)
  if (!nums.length) return undefined
  return { low: Math.min(...nums), high: Math.max(...nums), count: nums.length }
}

const abs = (path: string) => new URL(path, site.url).href

/** JSON-LD de la ficha: Service con ofertas, migas de pan y preguntas frecuentes */
export function detailJsonLd(lang: Lang, t: Treatment) {
  const tt = (s: string) => tr(lang, s)
  const url = abs(treatmentPath(lang, t.slug[lang]))
  const range = priceRange(t)
  const service: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    additionalType: 'https://schema.org/MedicalProcedure',
    '@id': `${url}#service`,
    name: tt(t.title),
    serviceType: tt(t.name),
    description: tt(t.what),
    url,
    inLanguage: lang,
    provider: { '@id': `${site.url}/#clinic` },
    areaServed: { '@type': 'City', name: 'Miami' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tt(t.name),
      itemListElement: t.items.map((it) => {
        const price = amount(it.p)
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: tt(it.n) },
          ...(price !== undefined && !needsConsult(t) ? { price, priceCurrency: 'USD' } : {}),
        }
      }),
    },
  }
  if (range && !needsConsult(t)) {
    service.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: range.low,
      highPrice: range.high,
      offerCount: range.count,
      url,
    }
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tt('Inicio'), item: abs(pathFor(lang, 'home')) },
      {
        '@type': 'ListItem',
        position: 2,
        name: tt('Tratamientos'),
        item: abs(pathFor(lang, 'treatments')),
      },
      { '@type': 'ListItem', position: 3, name: tt(t.name), item: url },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((f) => ({
      '@type': 'Question',
      name: tt(f.q),
      acceptedAnswer: { '@type': 'Answer', text: tt(f.a) },
    })),
  }
  return [service, breadcrumb, faq]
}

/** JSON-LD de la lista: migas de pan y lista de categorías */
export function listJsonLd(lang: Lang) {
  const tt = (s: string) => tr(lang, s)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: tt('Inicio'), item: abs(pathFor(lang, 'home')) },
        {
          '@type': 'ListItem',
          position: 2,
          name: tt('Tratamientos'),
          item: abs(pathFor(lang, 'treatments')),
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: tt('Tratamientos'),
      itemListElement: treatments.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tt(t.name),
        url: abs(treatmentPath(lang, t.slug[lang])),
      })),
    },
  ]
}

/** Título y descripción SEO de la ficha */
export function detailMeta(lang: Lang, t: Treatment) {
  const tt = (s: string) => tr(lang, s)
  const name = tt(t.title)
  const price = needsConsult(t) ? tt('Precio con consulta') : tt('Desde ' + t.from)
  if (lang === 'en') {
    return {
      title: `${name} in Miami · Prices | GlowHaus Aesthetics`,
      description: `${tt(t.short)} ${price}. Per-session prices, FAQs and WhatsApp booking at GlowHaus Aesthetics, Miami.`,
    }
  }
  return {
    title: `${name} en Miami · Precios | GlowHaus Aesthetics`,
    description: `${t.short} ${price}. Precios por sesión, preguntas frecuentes y reserva por WhatsApp en GlowHaus Aesthetics, Miami.`,
  }
}

export { fromLabel, needsConsult }
