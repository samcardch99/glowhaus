// La entrada de marca (Intro) avisa con «gh:intro-reveal» en cuanto la vista entra por
// el logotipo. Desde ese momento ya se anima la primera pantalla: no se espera a que la
// capa termine de fundirse («gh:intro-done»).
export const introDone: Promise<void> = new Promise((resolve) => {
  if (!document.documentElement.classList.contains('gh-intro-on')) return resolve()
  window.addEventListener('gh:intro-reveal', () => resolve(), { once: true })
  window.addEventListener('gh:intro-done', () => resolve(), { once: true })
})
