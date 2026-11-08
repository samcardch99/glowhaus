import { whatsappHref } from '../data/site'

// Envío del formulario de contacto con EmailJS.
// Las claves son públicas por diseño (EmailJS las usa desde el navegador) y van en
// variables PUBLIC_EMAILJS_*. En el panel de EmailJS hay que limitar los dominios
// permitidos. Mientras no estén configuradas, el formulario abre WhatsApp con el
// mensaje ya escrito, para no perder la consulta.

const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID as string | undefined
const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY as string | undefined

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function sendContact(form: HTMLFormElement) {
  const data = new FormData(form)
  const get = (k: string) => String(data.get(k) ?? '').trim()
  const lang = form.dataset.lang === 'en' ? 'en' : 'es'
  const errorEl = form.querySelector<HTMLElement>('[data-form-error]')
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const label = submit?.querySelector('span')

  const fail = (msg: string | undefined, focus?: string) => {
    form.dataset.state = 'error'
    if (errorEl) {
      // Se oculta y se vuelve a mostrar para repetir el fundido de entrada
      errorEl.hidden = true
      void errorEl.offsetWidth
      errorEl.textContent = msg ?? ''
      errorEl.hidden = false
    }
    if (focus) form.querySelector<HTMLElement>(`[name="${focus}"]`)?.focus()
  }

  // Bots: si rellenan la trampa, fingimos éxito
  if (get('website')) return done(form)

  const name = get('name')
  const phone = get('phone')
  const email = get('email')
  if (!name) return fail(form.dataset.msgName, 'name')
  if (!phone && !email) return fail(form.dataset.msgContact, 'phone')
  if (email && !EMAIL_RE.test(email)) return fail(form.dataset.msgEmail, 'email')
  if (errorEl) errorEl.hidden = true
  delete form.dataset.state

  const reason = get('reason')
  const treatment = form.querySelector<HTMLElement>('[data-treatment-field]')?.hidden
    ? ''
    : get('treatment')
  const params = {
    name,
    phone,
    email,
    reason,
    treatment,
    message: get('message'),
    language: lang === 'en' ? 'English' : 'Español',
    page: location.href,
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    // Sin EmailJS todavía: la consulta sigue por WhatsApp
    const topic = [reason, treatment].filter(Boolean).join(' · ')
    const lines = [
      `${name}${phone ? ' · ' + phone : ''}${email ? ' · ' + email : ''}`,
      params.message,
    ].filter(Boolean)
    const href = whatsappHref(lang, topic) + encodeURIComponent('\n' + lines.join('\n'))
    window.open(href, '_blank', 'noopener')
    return done(form)
  }

  const original = label?.textContent ?? ''
  if (submit) submit.disabled = true
  if (label) label.textContent = form.dataset.msgSending ?? ''
  form.dataset.state = 'sending'
  try {
    const emailjs = await import('@emailjs/browser')
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, {
      publicKey: PUBLIC_KEY,
      limitRate: { id: 'glowhaus-contact', throttle: 10000 },
    })
    done(form)
  } catch {
    fail(form.dataset.msgError)
  } finally {
    if (form.dataset.state === 'sending') delete form.dataset.state
    if (submit) submit.disabled = false
    if (label) label.textContent = original
  }
}

// Enviado. La interfaz puede animar el cambio escuchando «gh:contact-sent» y
// llamando a preventDefault(); si nadie lo hace, se cambia al instante.
function done(form: HTMLFormElement) {
  form.dataset.state = 'sent'
  const fields = form.querySelector<HTMLElement>('[data-form-fields]')
  const sent = form.querySelector<HTMLElement>('[data-form-sent]')
  const handled = !form.dispatchEvent(new CustomEvent('gh:contact-sent', { cancelable: true }))
  if (!handled) {
    if (fields) fields.hidden = true
    if (sent) {
      sent.hidden = false
      sent.focus?.()
    }
  }
  form.reset()
}
