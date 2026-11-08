import base from './en-dict.json'

export type Lang = 'es' | 'en'
export const LANGS: Lang[] = ['es', 'en']

// Diccionario ES → EN. Parte del que usa el diseño (en-dict.json, sacado de
// design/gh-i18n.js) y se amplía con los JSON de src/i18n/extra/.
const extras = import.meta.glob<{ default: Record<string, string> }>('./extra/*.json', {
  eager: true,
})
const DICT: Record<string, string> = Object.assign(
  {},
  base as Record<string, string>,
  ...Object.values(extras).map((m) => m.default),
)

// Reglas del diseño para textos con números (precios, recuentos, fechas relativas)
const RULES: [RegExp, (s: string) => string][] = [
  [/^desde \$/, (s) => s.replace(/^desde/, 'from')],
  [/^Desde \$/, (s) => s.replace(/^Desde/, 'From')],
  [
    /^(\d+) tratamientos?$/,
    (s) => s.replace(/tratamientos?/, (m) => (m === 'tratamiento' ? 'treatment' : 'treatments')),
  ],
  [/^Categoría (\d+)$/, (s) => s.replace('Categoría', 'Category')],
  [/^CATEGORÍA /, (s) => s.replace('CATEGORÍA', 'CATEGORY')],
  [/ · hace un mes$/, (s) => s.replace('hace un mes', 'a month ago')],
  [/ · hace (\d+) meses$/, (s) => s.replace(/hace (\d+) meses/, '$1 months ago')],
  [/^y (\d+) más$/, (s) => s.replace(/^y (\d+) más$/, 'and $1 more')],
  [/ sesiones?$/, (s) => s.replace(/sesiones?$/, (m) => (m === 'sesión' ? 'session' : 'sessions'))],
  [/ días?$/, (s) => s.replace(/días?$/, (m) => (m === 'día' ? 'day' : 'days'))],
]

const missing = new Set<string>()

/** Traduce un texto escrito en español al idioma pedido. */
export function tr(lang: Lang, es: string): string {
  if (lang === 'es') return es
  const key = es.trim()
  if (!key) return es
  const hit = DICT[key]
  if (hit !== undefined) return es.replace(key, hit)
  if (key.startsWith('· ')) return '· ' + tr(lang, key.slice(2))
  for (const [re, fn] of RULES) {
    if (re.test(key)) {
      const out = fn(key)
      if (out !== key) return es.replace(key, out)
    }
  }
  // Precios, números y nombres propios no se traducen
  if (!/[a-záéíóúñ]{3,}/i.test(key) || /^[\d$.,/ ()+–-]+$/.test(key)) return es
  if (import.meta.env.DEV && !missing.has(key)) {
    missing.add(key)
    console.warn(`[i18n] sin traducción: "${key}"`)
  }
  return es
}

/** Atajo para usar en los componentes: const t = useT(lang) */
export const useT = (lang: Lang) => (es: string) => tr(lang, es)

// ---------- Rutas ----------

export type PageKey = 'home' | 'about' | 'treatments' | 'visit' | 'contact' | 'privacy' | 'terms'

const PATHS: Record<PageKey, Record<Lang, string>> = {
  home: { es: '/', en: '/en/' },
  about: { es: '/nosotros/', en: '/en/about/' },
  treatments: { es: '/tratamientos/', en: '/en/treatments/' },
  visit: { es: '/primera-visita/', en: '/en/first-visit/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  terms: { es: '/terminos/', en: '/en/terms/' },
}

export const pathFor = (lang: Lang, page: PageKey) => PATHS[page][lang]

/** Ruta de la ficha de un tratamiento */
export const treatmentPath = (lang: Lang, slug: string) => `${PATHS.treatments[lang]}${slug}/`

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es')
