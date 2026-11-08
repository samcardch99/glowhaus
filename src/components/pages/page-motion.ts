import { gsap, prefersReducedMotion } from '../../scripts/gsap'
import { introDone } from '../../scripts/intro-state'

// Piezas de movimiento de las páginas interiores (Nosotros, Primera visita):
// fotos que se descubren desde abajo y paralaje suave. Sin JS o con movimiento
// reducido no hacen nada y todo se ve completo.

const reduce = prefersReducedMotion()

/**
 * Foto que se descubre de abajo arriba (clip-path) mientras la imagen se asienta
 * (escala 1.08 → 1). `frame` es el contenedor con esquinas redondeadas.
 */
export function revealImage(frame: HTMLElement, img: HTMLElement | null, start = 'top 85%') {
  if (reduce) return
  // Cadenas completas en origen y destino: el navegador abrevia «inset()» al
  // leerlo y GSAP no podría casar los números.
  const hidden = 'inset(100% 0% 0% 0% round 14px)'
  const shown = 'inset(0% 0% 0% 0% round 14px)'
  gsap.set(frame, { clipPath: hidden })
  if (img) gsap.set(img, { scale: 1.08 })
  void introDone.then(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start, once: true },
    })
    tl.fromTo(
      frame,
      { clipPath: hidden },
      { clipPath: shown, duration: 1.3, ease: 'wipe', clearProps: 'clipPath' },
    )
    if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: 'glow' }, 0)
  })
}

/**
 * Paralaje: el elemento se desplaza `amount` % de su alto mientras su
 * contenedor cruza la pantalla. Solo en escritorio (`query`).
 */
export function parallax(
  el: HTMLElement,
  trigger: HTMLElement,
  amount = 6,
  query = '(min-width: 1024px)',
) {
  if (reduce) return
  const mm = gsap.matchMedia()
  mm.add(query, () => {
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    )
  })
}
