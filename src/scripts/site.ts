import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

// Comportamiento común a todas las páginas: cabecera, menú, apariciones al hacer
// scroll, secciones apiladas, contadores, texto que se escribe y vídeos diferidos.

const reduce = prefersReducedMotion()

// ---------- Cabecera: colores según la sección que tiene debajo ----------
const header = document.getElementById('gh-header')

function updateHeader() {
  if (!header) return
  header.toggleAttribute('data-scrolled', window.scrollY > 8)
  const y = Math.min(header.offsetHeight * 0.55, 60)
  const stack = document.elementsFromPoint(window.innerWidth / 2, y)
  const host = stack
    .find((el) => !header.contains(el) && el.closest('[data-theme]'))
    ?.closest<HTMLElement>('[data-theme]')
  if (!host || host === header) return
  const theme = host.dataset.theme ?? 'light'
  if (header.dataset.theme !== theme) header.dataset.theme = theme
  if (theme === 'light') {
    const bg = getComputedStyle(host).backgroundColor.match(/\d+(\.\d+)?/g)
    if (bg && (bg.length < 4 || Number(bg[3]) > 0.5)) {
      header.style.setProperty('--hdr-bg', `${bg[0]} ${bg[1]} ${bg[2]}`)
    }
  }
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

// ---------- Menú ----------
const menu = document.getElementById('gh-menu') as HTMLDialogElement | null
const openers = document.querySelectorAll<HTMLButtonElement>('[data-menu-open]')
let menuTl: gsap.core.Timeline | null = null

function openMenu() {
  if (!menu || menu.open) return
  menu.showModal()
  openers.forEach((b) => b.setAttribute('aria-expanded', 'true'))
  document.documentElement.style.overflow = 'hidden'
  menuTl?.kill()
  menuTl = gsap
    .timeline()
    .to(menu, { opacity: 1, duration: reduce ? 0 : 0.45, ease: 'power2.out' })
    .from(
      menu.querySelectorAll('[data-menu-item]'),
      { y: reduce ? 0 : 24, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
      0.05,
    )
}

function closeMenu() {
  if (!menu?.open) return
  menuTl?.kill()
  gsap.to(menu, {
    opacity: 0,
    duration: reduce ? 0 : 0.35,
    ease: 'power2.in',
    onComplete: () => {
      menu.close()
      document.documentElement.style.overflow = ''
      openers.forEach((b) => b.setAttribute('aria-expanded', 'false'))
    },
  })
}

openers.forEach((b) => b.addEventListener('click', openMenu))
menu?.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', closeMenu))
menu?.addEventListener('cancel', (e) => {
  e.preventDefault()
  closeMenu()
})
menu?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  // Clic en el fondo, o en un enlace a una sección de esta misma página
  if (!target.closest('a,button,input,select,textarea,label,img')) closeMenu()
  const link = target.closest('a')
  if (link && link.pathname === location.pathname && link.hash) closeMenu()
})

// ---------- Apariciones al entrar en pantalla ----------
const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
if (reduce) {
  gsap.set(reveals, { opacity: 1 })
} else {
  reveals.forEach((el) => {
    const delay = Number(el.dataset.delay ?? 0) / 1000
    gsap.fromTo(
      el,
      { opacity: 0, y: 36, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        delay,
        ease: 'power3.out',
        clearProps: 'filter,transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    )
  })
}

// ---------- Secciones apiladas: la de abajo tapa a la de arriba ----------
// [data-stack-wrap] contiene tarjetas sticky [data-stack]; cada una se reduce y
// oscurece mientras la siguiente sube por encima.
if (!reduce) {
  gsap.utils.toArray<HTMLElement>('[data-stack-wrap]').forEach((wrap) => {
    const cards = gsap.utils.toArray<HTMLElement>(wrap.querySelectorAll(':scope > [data-stack]'))
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return
      gsap.to(card, {
        scale: 0.9,
        filter: 'brightness(0.45) blur(2px)',
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
      })
    })
  })

  // Una sección sticky [data-cover] se oscurece cuando la tapa la siguiente
  gsap.utils.toArray<HTMLElement>('[data-cover]').forEach((el) => {
    const next = el.nextElementSibling
    if (!next) return
    gsap.to(el.querySelector('[data-cover-target]') ?? el, {
      scale: 0.94,
      filter: 'brightness(0.55)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
    })
  })
}

// ---------- Contadores: $650 → cuenta desde 0 ----------
gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count)
  const text = el.textContent ?? ''
  const prefix = text.match(/^[^\d]*/)?.[0] ?? ''
  const suffix = text.match(/[^\d,]*$/)?.[0] ?? ''
  if (!Number.isFinite(target) || reduce) return
  const obj = { v: 0 }
  gsap.to(obj, {
    v: target,
    duration: 1.4,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = prefix + Math.round(obj.v).toLocaleString('en-US') + suffix
    },
  })
})

// ---------- Texto que se escribe solo ----------
gsap.utils.toArray<HTMLElement>('[data-type]').forEach((el, i) => {
  if (reduce) return
  const full = el.textContent ?? ''
  el.setAttribute('aria-label', full)
  const obj = { n: 0 }
  el.textContent = ''
  gsap.to(obj, {
    n: full.length,
    duration: Math.min(2.2, full.length * 0.028),
    delay: (i % 4) * 0.25,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    onUpdate: () => {
      el.textContent = full.slice(0, Math.round(obj.n))
    },
  })
})

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
  const v = document.getElementById(btn.getAttribute('aria-controls') ?? '') as HTMLVideoElement | null
  if (!v) return
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
document.fonts?.ready.then(() => ScrollTrigger.refresh())
