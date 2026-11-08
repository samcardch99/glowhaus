import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// Curvas del diseño: «glow» es la salida suave de todas las apariciones y
// «swift» la de los movimientos de ida y vuelta (rellenos, cambios de paso).
CustomEase.create('glow', '0.2,0.7,0.2,1')
CustomEase.create('swift', '0.65,0,0.35,1')
CustomEase.create('wipe', '0.6,0.1,0.2,1')

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Escritorio con ratón: los efectos de hover y el «snap» con rueda solo van aquí */
export const isDesktopPointer = () =>
  window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)').matches

/** easeInOutCubic, la curva de los desplazamientos automáticos del diseño */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Desplazamiento animado de la ventana (para «snap» y anclas) */
export function scrollToY(target: number, duration = 560): Promise<void> {
  return new Promise((resolve) => {
    const y0 = window.scrollY
    const d = target - y0
    if (Math.abs(d) < 1 || prefersReducedMotion()) {
      window.scrollTo(0, target)
      resolve()
      return
    }
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      window.scrollTo(0, y0 + d * easeInOutCubic(k))
      if (k < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export { gsap, ScrollTrigger, SplitText, CustomEase }
