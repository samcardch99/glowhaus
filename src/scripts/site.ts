import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
  isDesktopPointer,
  scrollToY,
} from './gsap'
import { introDone } from './intro-state'

// Sistema de movimiento común, fiel al diseño v3 (Claude Design):
// cabecera que se esconde al bajar y toma el color de la sección de debajo,
// apariciones por grupos, titulares letra a letra, tarjetas apiladas con
// «snap», contadores, barrido, destello dorado, texto que se escribe y vídeos
// diferidos. Todo respeta «reducir movimiento» y funciona sin JS.

const reduce = prefersReducedMotion()
;(window as unknown as { __ghMotion?: boolean }).__ghMotion = true
const root = document.documentElement

// ---------- Cabecera ----------
const header = document.getElementById('gh-header')
const menu = document.getElementById('gh-menu') as HTMLDialogElement | null
let lastY = window.scrollY

/** Color opaco real de un elemento (sube por los padres si es transparente) */
function opaqueBg(el: Element | null): string | null {
  for (let n = el; n && n !== root; n = n.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g)
    if (m && (m.length < 4 || Number(m[3]) > 0.5)) return `${m[0]} ${m[1]} ${m[2]}`
  }
  return null
}

function updateHeader() {
  if (!header) return
  const y = window.scrollY
  const dy = y - lastY
  lastY = y
  header.toggleAttribute('data-scrolled', y > 40)
  // Se esconde al bajar y vuelve al subir (como en el diseño)
  if (!menu?.open) {
    if (y <= 20 || dy < -4) header.removeAttribute('data-hidden')
    else if (dy > 4) header.setAttribute('data-hidden', '')
  }
  const probeY = Math.min(header.offsetHeight * 0.55, 60)
  const below = document
    .elementsFromPoint(window.innerWidth / 2, probeY)
    .filter((el) => !header.contains(el))
  const host = below.find((el) => el.closest('[data-theme]'))?.closest<HTMLElement>('[data-theme]')
  if (!host) return
  const theme = host.dataset.theme ?? 'light'
  if (header.dataset.theme !== theme) header.dataset.theme = theme
  // El color es el de la sección (no el de una foto o tarjeta que pase por debajo)
  const bg = opaqueBg(host)
  if (bg) header.style.setProperty('--hdr-bg', bg)
}

let headerRaf = 0
const queueHeader = () => {
  if (!headerRaf)
    headerRaf = requestAnimationFrame(() => {
      headerRaf = 0
      updateHeader()
    })
}
window.addEventListener('scroll', queueHeader, { passive: true })
window.addEventListener('resize', queueHeader)
updateHeader()
// Algunas secciones cambian debajo sin scroll: repaso periódico barato
window.setInterval(() => {
  if (!document.hidden) updateHeader()
}, 700)

// ---------- Menú ----------
const openers = document.querySelectorAll<HTMLButtonElement>('[data-menu-open]')
let menuTl: gsap.core.Timeline | null = null

function openMenu() {
  if (!menu || menu.open) return
  menu.showModal()
  header?.removeAttribute('data-hidden')
  openers.forEach((b) => b.setAttribute('aria-expanded', 'true'))
  root.style.overflow = 'hidden'
  menuTl?.kill()
  menuTl = gsap
    .timeline()
    .fromTo(
      menu,
      { opacity: 0, clipPath: reduce ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' },
      { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: reduce ? 0 : 0.7, ease: 'swift' },
    )
    .from(
      menu.querySelectorAll('[data-menu-item]'),
      { y: reduce ? 0 : 16, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'glow' },
      0.25,
    )
}

function closeMenu(): Promise<void> {
  return new Promise((resolve) => {
    if (!menu?.open) return resolve()
    menuTl?.kill()
    gsap.to(menu, {
      opacity: 0,
      duration: reduce ? 0 : 0.4,
      ease: 'power2.in',
      onComplete: () => {
        menu.close()
        root.style.overflow = ''
        openers.forEach((b) => b.setAttribute('aria-expanded', 'false'))
        resolve()
      },
    })
  })
}

openers.forEach((b) => b.addEventListener('click', openMenu))
menu
  ?.querySelectorAll('[data-menu-close]')
  .forEach((b) => b.addEventListener('click', () => void closeMenu()))
menu?.addEventListener('cancel', (e) => {
  e.preventDefault()
  void closeMenu()
})
menu?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('a,button,input,select,textarea,label,img')) void closeMenu()
})

// ---------- Anclas de esta misma página: desplazamiento suave ----------
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a')
  if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return
  const url = new URL(a.href, location.href)
  if (url.pathname !== location.pathname || !url.hash) return
  const dest = document.getElementById(decodeURIComponent(url.hash.slice(1)))
  if (!dest) return
  e.preventDefault()
  void closeMenu().then(() => {
    const y = dest.getBoundingClientRect().top + window.scrollY
    void scrollToY(y, 900).then(() => {
      history.replaceState(null, '', url.hash)
      if (!dest.hasAttribute('tabindex')) dest.setAttribute('tabindex', '-1')
      dest.focus({ preventScroll: true })
    })
  })
})

// ---------- Apariciones por grupos ----------
// [data-reveal] se funde subiendo 20px al entrar, en grupo con sus hermanos
// (100ms entre uno y otro). data-delay suma ms; data-reveal="solo" aparece por
// su cuenta. Movimiento contenido a propósito: el diseño original era más
// enfático y la clínica lo pidió más sobrio.
const revealEls = gsap.utils.toArray<HTMLElement>('[data-reveal]')

function playReveal(group: HTMLElement[]) {
  group.forEach((el, k) => {
    const delay = k * 0.1 + Number(el.dataset.delay ?? 0) / 1000
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, delay, ease: 'glow', clearProps: 'transform' },
    )
  })
}

if (reduce) {
  gsap.set(revealEls, { opacity: 1 })
} else {
  const groups = new Map<Element, HTMLElement[]>()
  revealEls.forEach((el) => {
    const key: Element = el.dataset.reveal === 'solo' ? el : (el.parentElement ?? el)
    const g = groups.get(key) ?? []
    g.push(el)
    groups.set(key, g)
  })
  void introDone.then(() => {
    groups.forEach((group) => {
      // Grupos ocultos (variantes solo móvil o solo escritorio): se muestran sin animar
      if (group.every((el) => el.offsetParent === null)) {
        gsap.set(group, { opacity: 1 })
        return
      }
      ScrollTrigger.create({
        trigger: group[0],
        start: 'top 82%',
        once: true,
        onEnter: () => playReveal(group),
      })
    })
  })
}

// ---------- Titulares palabra a palabra ----------
// [data-words]: las palabras se funden en cascada suave (data-wdelay ms de
// espera). Los lectores de pantalla leen el texto entero.
async function splitWords() {
  const els = gsap.utils.toArray<HTMLElement>('[data-words]')
  if (!els.length || reduce) return
  await document.fonts.ready
  await introDone
  els.forEach((el) => {
    const split = SplitText.create(el, { type: 'words', aria: 'auto' })
    gsap.set(split.words, { opacity: 0, yPercent: 15 })
    el.style.opacity = '1'
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(split.words, {
          opacity: 1,
          yPercent: 0,
          duration: 0.7,
          ease: 'glow',
          stagger: 0.05,
          delay: Number(el.dataset.wdelay ?? 0) / 1000,
        }),
    })
  })
}
void splitWords()

// ---------- Tarjetas apiladas ----------
// [data-stack-wrap] > [data-stack] (sticky, a pantalla completa): la de abajo
// tapa a la de arriba, que se reduce un poco, se oscurece y redondea sus
// esquinas (sin desenfoque). [data-cover] hace lo mismo con una sola sección sticky y la
// siguiente. En escritorio, la rueda salta de una tarjeta a la siguiente.
function stackPair(card: HTMLElement, next: HTMLElement, target: Element = card) {
  ScrollTrigger.create({
    trigger: next,
    start: 'top bottom',
    end: 'top top',
    onUpdate: ({ progress: p }) => {
      gsap.set(target, {
        scale: 1 - 0.03 * p,
        filter: p > 0.001 ? `brightness(${1 - 0.25 * p})` : 'none',
        borderRadius: Math.round(p * 18),
      })
      next.style.boxShadow = p > 0.03 && p < 0.99 ? '0 -24px 48px rgba(0,0,0,.45)' : ''
    },
    onLeaveBack: () => gsap.set(target, { clearProps: 'transform,filter,borderRadius' }),
  })
}

if (!reduce) {
  gsap.utils.toArray<HTMLElement>('[data-stack-wrap]').forEach((wrap) => {
    const cards = gsap.utils.toArray<HTMLElement>(wrap.querySelectorAll(':scope > [data-stack]'))
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (next) stackPair(card, next)
    })
  })
  gsap.utils.toArray<HTMLElement>('[data-cover]').forEach((el) => {
    const next = el.nextElementSibling
    if (next instanceof HTMLElement)
      stackPair(el, next, el.querySelector('[data-cover-target]') ?? el)
  })
}

// «Snap» con la rueda entre tarjetas apiladas (solo escritorio con ratón)
function stackSnaps(): number[][] {
  const out: number[][] = []
  const vh = window.innerHeight
  document.querySelectorAll<HTMLElement>('[data-stack-wrap]').forEach((wrap) => {
    const isCard = (c: Element): c is HTMLElement =>
      c instanceof HTMLElement && c.hasAttribute('data-stack') && c.offsetHeight >= vh * 0.95
    if ([...wrap.children].filter(isCard).length < 2) return
    let acc = wrap.getBoundingClientRect().top + window.scrollY
    const snaps: number[] = []
    for (const c of wrap.children) {
      const cs = getComputedStyle(c)
      acc += parseFloat(cs.marginTop) || 0
      if (isCard(c)) snaps.push(Math.round(acc))
      acc += (c as HTMLElement).offsetHeight + (parseFloat(cs.marginBottom) || 0)
    }
    out.push(snaps)
  })
  return out
}

if (!reduce) {
  let cache: number[][] | null = null
  let cacheT = 0
  let animating = false
  let used = false
  let acc = 0
  let lastWheel = 0
  window.addEventListener('resize', () => (cache = null))
  window.addEventListener(
    'wheel',
    (e) => {
      if (!isDesktopPointer() || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      if (menu?.open || root.classList.contains('gh-intro-on')) return
      const now = Date.now()
      if (!cache || now - cacheT > 1500) {
        cache = stackSnaps()
        cacheT = now
      }
      const y = window.scrollY
      const dir = Math.sign(e.deltaY)
      const stack = cache.find((s) => {
        const first = s[0]!
        const last = s[s.length - 1]!
        if (y < first - 4 || y > last + 4) return false
        if (!animating && dir < 0 && y <= first + 4) return false
        if (!animating && dir > 0 && y >= last - 4) return false
        return true
      })
      if (!stack) {
        acc = 0
        return
      }
      e.preventDefault()
      if (now - lastWheel > 260) {
        used = false
        acc = 0
      }
      lastWheel = now
      if (animating || used || !dir) return
      acc += e.deltaY
      if (Math.abs(acc) < 24) return
      acc = 0
      used = true
      const target =
        dir > 0 ? stack.find((v) => v > y + 4) : [...stack].reverse().find((v) => v < y - 4)
      if (target === undefined) return
      animating = true
      void scrollToY(target, 620).then(() => (animating = false))
    },
    { passive: false },
  )
}

// ---------- Contadores, barrido y destello ----------
// data-count="650": cuenta desde 0 conservando prefijo y sufijo ($, +, /mes).
// data-wipe: el texto se descubre de izquierda a derecha.
// data-glow: un destello dorado recorre el texto una vez.
gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count)
  const text = el.textContent ?? ''
  const prefix = text.match(/^[^\d]*/)?.[0] ?? ''
  const suffix = text.match(/[^\d,]*$/)?.[0] ?? ''
  if (!Number.isFinite(target) || reduce) return
  const obj = { v: 0 }
  el.textContent = prefix + '0' + suffix
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () =>
      gsap.to(obj, {
        v: target,
        duration: 1.3,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = prefix + Math.round(obj.v).toLocaleString('en-US') + suffix
        },
      }),
  })
})

if (!reduce) {
  gsap.utils.toArray<HTMLElement>('[data-wipe]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 1,
        ease: 'wipe',
        clearProps: 'clipPath',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      },
    )
  })
  gsap.utils.toArray<HTMLElement>('[data-glow]').forEach((el) => {
    gsap.to(el, {
      keyframes: [
        {
          textShadow: '0 0 14px rgba(232,196,130,.45)',
          duration: 0.8,
        },
        { textShadow: '0 0 0px rgba(232,196,130,0)', duration: 1 },
      ],
      delay: 0.9,
      ease: 'sine.inOut',
      clearProps: 'textShadow',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })
  })
}

// ---------- Texto que se escribe ----------
// Un contenedor con filas [data-typerow] (cada una con [data-dot] y [data-type])
// se escribe fila a fila: el punto aparece con un rebote y después el texto,
// 12ms por letra. Un [data-type] suelto se escribe solo.
function typeInto(el: HTMLElement, full: string, at: number) {
  const obj = { n: 0 }
  gsap.to(obj, {
    n: full.length,
    duration: full.length * 0.012,
    delay: at,
    ease: 'none',
    onUpdate: () => {
      el.textContent = full.slice(0, Math.round(obj.n)) || ' '
    },
  })
}

if (!reduce) {
  const boxes = new Set<HTMLElement>()
  document.querySelectorAll<HTMLElement>('[data-typerow]').forEach((r) => {
    if (r.parentElement) boxes.add(r.parentElement)
  })
  boxes.forEach((box) => {
    const items = [...box.querySelectorAll<HTMLElement>(':scope > [data-typerow]')].flatMap(
      (row) => {
        const tx = row.querySelector<HTMLElement>('[data-type]')
        if (!tx) return []
        const dot = row.querySelector<HTMLElement>('[data-dot]')
        const full = tx.textContent?.trim() ?? ''
        tx.setAttribute('aria-label', full)
        tx.textContent = ' '
        if (dot) gsap.set(dot, { opacity: 0, scale: 0 })
        return [{ tx, dot, full }]
      },
    )
    ScrollTrigger.create({
      trigger: box,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        let t = 0.15
        items.forEach(({ tx, dot, full }) => {
          if (dot)
            gsap.to(dot, {
              keyframes: [
                { opacity: 1, scale: 1.1, duration: 0.2 },
                { scale: 1, duration: 0.15 },
              ],
              delay: t,
              ease: 'power2.out',
            })
          typeInto(tx, full, t + 0.2)
          t += 0.15 + full.length * 0.012 + 0.1
        })
      },
    })
  })
  gsap.utils.toArray<HTMLElement>('[data-type]').forEach((el) => {
    if (el.closest('[data-typerow]')) return
    const full = el.textContent?.trim() ?? ''
    el.setAttribute('aria-label', full)
    el.textContent = ' '
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => typeInto(el, full, 0),
    })
  })
}

// ---------- Vídeos: cargan cerca de la pantalla y se pausan fuera de ella ----------
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]')
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const v = target as HTMLVideoElement
      if (isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src
        if (!reduce && !v.dataset.userPaused) v.play().catch(() => {})
      } else if (!v.paused) {
        v.pause()
      }
    })
  },
  { rootMargin: '200px 0px' },
)
videos.forEach((v) => {
  v.muted = true
  io.observe(v)
})

// Botones de pausa de los vídeos en bucle (WCAG 2.2.2)
document.querySelectorAll<HTMLButtonElement>('[data-video-toggle]').forEach((btn) => {
  const v = document.getElementById(btn.getAttribute('aria-controls') ?? '')
  if (!(v instanceof HTMLVideoElement)) return
  const sync = () => btn.setAttribute('aria-pressed', String(v.paused))
  btn.addEventListener('click', () => {
    if (v.paused) {
      delete v.dataset.userPaused
      v.play().catch(() => {})
    } else {
      v.dataset.userPaused = '1'
      v.pause()
    }
  })
  v.addEventListener('play', sync)
  v.addEventListener('pause', sync)
  sync()
})

// Recalcular posiciones cuando terminan de cargar fuentes e imágenes
window.addEventListener('load', () => ScrollTrigger.refresh())
void document.fonts.ready.then(() => ScrollTrigger.refresh())
