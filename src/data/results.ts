import type { ImageMetadata } from 'astro'

// Fotos de antes y después (src/assets/ba), agrupadas por pestaña como en el diseño.
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/ba/*.png', { eager: true })
const img = (n: string) => {
  const m = all[`../assets/ba/${n}.png`]
  if (!m) throw new Error(`Falta la foto ${n}`)
  return m.default
}
export interface BAPair {
  before: ImageMetadata
  after: ImageMetadata
}
export interface BASet {
  tab: string
  pairs: BAPair[]
}
const pairs = (k: string, n: number): BAPair[] =>
  Array.from({ length: n }, (_, i) => ({
    before: img(`${k}-${i + 1}a`),
    after: img(`${k}-${i + 1}d`),
  }))

export const baSets: BASet[] = [
  { tab: 'Botox', pairs: pairs('botox', 6) },
  { tab: 'LipLase', pairs: pairs('liplase', 6) },
  { tab: 'Relleno de labios', pairs: pairs('relleno', 2) },
  { tab: 'Fotona', pairs: [{ before: img('fotona-antes-al'), after: img('fotona-despues-al') }] },
]
