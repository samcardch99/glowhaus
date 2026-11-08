// Utilidades de las pistas horizontales de la portada (carrusel de tratamientos
// y testimonios): arrastre con ratón e inercia como en el diseño (v *= .94),
// el clic se anula tras un arrastre y un aviso cuando el desplazamiento termina.

export interface DragScroll {
  /** true mientras el ratón arrastra o dura la inercia */
  busy: () => boolean
}

export function dragScroll(track: HTMLElement): DragScroll {
  let st: { x: number; sl: number; lx: number; v: number; moved: number } | null = null
  let raf = 0
  let gliding = false
  let suppress = false

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    cancelAnimationFrame(raf)
    gliding = false
    st = { x: e.clientX, sl: track.scrollLeft, lx: e.clientX, v: 0, moved: 0 }
  })
  window.addEventListener('pointermove', (e) => {
    if (!st) return
    const dx = e.clientX - st.x
    st.moved = Math.max(st.moved, Math.abs(dx))
    st.v = e.clientX - st.lx
    st.lx = e.clientX
    if (st.moved > 4) {
      track.style.cursor = 'grabbing'
      track.scrollLeft = st.sl - dx
    }
  })
  const up = () => {
    if (!st) return
    const d = st
    st = null
    track.style.cursor = ''
    suppress = d.moved > 6
    let v = -d.v * 1.6
    gliding = true
    const step = () => {
      if (Math.abs(v) < 0.4) {
        gliding = false
        // Un último aviso para que la pista se recoloque
        track.dispatchEvent(new Event('scroll'))
        return
      }
      track.scrollLeft += v
      v *= 0.94
      raf = requestAnimationFrame(step)
    }
    step()
  }
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  track.addEventListener(
    'click',
    (e) => {
      if (suppress) {
        e.preventDefault()
        e.stopPropagation()
      }
      suppress = false
    },
    true,
  )
  track.addEventListener('dragstart', (e) => e.preventDefault())
  return { busy: () => st !== null || gliding }
}

/** Llama a `fn` cuando la pista lleva `ms` sin desplazarse */
export function onScrollEnd(el: HTMLElement, fn: () => void, ms = 180) {
  let t = 0
  el.addEventListener(
    'scroll',
    () => {
      window.clearTimeout(t)
      t = window.setTimeout(fn, ms)
    },
    { passive: true },
  )
}

/** Índice del hijo cuyo centro queda más cerca del centro de la pista */
export function nearestIndex(track: HTMLElement, centers: number[]) {
  const mid = track.scrollLeft + track.clientWidth / 2
  let best = 0
  let bd = Infinity
  centers.forEach((c, i) => {
    const d = Math.abs(c - mid)
    if (d < bd) {
      bd = d
      best = i
    }
  })
  return { index: best, distance: bd }
}
