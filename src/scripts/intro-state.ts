// La entrada de marca (Intro) avisa con «gh:intro-done» cuando termina.
// Hasta entonces no se anima nada de la primera pantalla.
export const introDone: Promise<void> = new Promise((resolve) => {
  if (!document.documentElement.classList.contains('gh-intro-on')) return resolve()
  window.addEventListener('gh:intro-done', () => resolve(), { once: true })
})
