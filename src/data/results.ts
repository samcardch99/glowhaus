import type { ImageMetadata } from 'astro'

// Fotos de antes y después (src/assets/ba), agrupadas por pestaña como en el diseño.
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/ba/*.{png,jpg}', {
  eager: true,
})
const img = (n: string) => {
  const m = all[`../assets/ba/${n}.png`] ?? all[`../assets/ba/${n}.jpg`]
  if (!m) throw new Error(`Falta la foto ${n}`)
  return m.default
}
export interface BAPair {
  before: ImageMetadata
  after: ImageMetadata
  /** Foto tomada de fotona.com: se muestra el crédito sobre la foto */
  credit?: boolean
}
export interface BASet {
  tab: string
  pairs: BAPair[]
}
const pair = (before: string, after: string, credit = false): BAPair => ({
  before: img(before),
  after: img(after),
  ...(credit ? { credit } : {}),
})
const pairs = (k: string, ns: number[]): BAPair[] => ns.map((n) => pair(`${k}-${n}a`, `${k}-${n}d`))

const fotona4d: BAPair[] = [
  pair('f4d-1a', 'f4d-1d', true),
  pair('f4d-2a-up', 'f4d-2d', true),
  pair('f4d-3a', 'f4d-3d', true),
]

export const baSets: BASet[] = [
  { tab: 'Botox', pairs: pairs('botox', [1, 2, 3, 4, 5, 6]) },
  { tab: 'LipLase', pairs: pairs('liplase', [1, 3, 4, 5, 6]) },
  {
    tab: 'Relleno de labios',
    pairs: [...pairs('relleno', [1, 2]), pair('liplase-2a', 'liplase-2d')],
  },
  { tab: 'Fotona – Acné activo', pairs: [pair('fotona-antes-al', 'fotona-despues-al')] },
  { tab: 'Fotona 4D', pairs: fotona4d },
]
