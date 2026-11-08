import type { Lang, PageKey } from '../i18n'

// Datos de la clínica. Un solo sitio para cambiarlos.
export const site = {
  name: 'GlowHaus Aesthetics',
  url: 'https://glowhausaesthetics.net',
  phone: '+1 (786) 918-2997',
  phoneHref: 'tel:+17869182997',
  whatsapp: '17869182997',
  email: 'hola@aestheticsglowhaus.com',
  instagram: 'https://www.instagram.com/aestheticsglowhaus/',
  instagramHandle: '@aestheticsglowhaus',
  // Pendiente de que la clínica pase los enlaces reales
  facebook: 'https://www.facebook.com/',
  tiktok: 'https://www.tiktok.com/',
  googleReviews: 'https://www.google.com/maps/search/GlowHaus+Aesthetics+11890+SW+8th+St+Miami',
  mapsLink: 'https://maps.google.com/?q=GlowHaus+Aesthetics+11890+SW+8th+St+Miami',
  mapsEmbed:
    'https://maps.google.com/maps?q=11890%20SW%208th%20St%2C%20Miami%2C%20FL&z=15&output=embed',
  address: {
    street: '11890 SW 8th St, Suite 211',
    city: 'Miami',
    region: 'FL',
    zip: '33184',
    country: 'US',
    short: '11890 SW 8th St, Miami, FL',
    lat: 25.7624,
    lng: -80.3828,
  },
  rating: { value: 5, count: 6 },
  // Enlace de solicitud de Cherry: pendiente de la clínica
  cherry: '' as string,
} as const

/** Enlace de WhatsApp con un mensaje inicial en el idioma de la página */
export function whatsappHref(lang: Lang, topic?: string) {
  const base =
    lang === 'en'
      ? 'Hi GlowHaus, I would like to book an appointment'
      : 'Hola GlowHaus, me gustaría reservar una cita'
  const text = topic ? `${base} (${topic}).` : `${base}.`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

/** Menú principal, en el orden del diseño. Las anclas llevan a secciones de Inicio. */
export const menuItems: { label: string; page?: PageKey; hash?: string; fotona?: boolean }[] = [
  { label: 'Sobre nosotros', page: 'about' },
  { label: 'Tu primera visita', page: 'visit' },
  { label: 'Tratamientos', page: 'treatments' },
  { label: 'Fotona 4D', fotona: true },
  { label: 'Resultados', page: 'home', hash: 'resultados' },
  { label: 'Equipo', page: 'home', hash: 'equipo' },
  { label: 'Contacto', page: 'contact' },
]
