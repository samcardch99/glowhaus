import type { ImageMetadata } from 'astro'
import type { Faq } from './treatments'
import { treatments } from './treatments'
import flacidez from '../assets/goals/flacidez.jpg'
import arrugas from '../assets/goals/arrugas.png'
import ojeras from '../assets/goals/ojeras.png'
import cuerpo from '../assets/goals/cuerpo.jpg'
import facialDespues from '../assets/ba/facial-despues.png'
import rellenoDespues from '../assets/ba/relleno-1d.png'
import fotonaAntes from '../assets/ba/fotona-antes-al.png'
import alain from '../assets/team/alain.jpg'
import daniela from '../assets/team/p2.jpg'
import bella from '../assets/reviews/bella.png'
import odelia from '../assets/reviews/odelia.png'
import step1 from '../assets/steps/01.jpg'
import step2 from '../assets/steps/02c.jpg'
import step3 from '../assets/steps/03.jpg'

// Contenido propio de la página de inicio. Texto en español: el inglés sale del
// diccionario (src/i18n). Las reseñas se publican tal cual las escribió cada paciente.

// ---------- ¿Qué desearías mejorar? ----------

export interface Suggestion {
  tag: string
  name: string
  desc: string
  price: string
  /** Índice de la categoría en `treatments` a la que lleva «Ver y reservar» */
  tx: number
}
export interface Goal {
  label: string
  img: ImageMetadata
  s: Suggestion[]
}

const TAG_TX: Record<string, number> = {
  'Fotona láser · rostro': 0,
  'Fotona Body': 2,
  'Depilación láser Fotona': 3,
  Inyectables: 4,
  'Rellenos dérmicos': 5,
  'Cuidado médico de la piel': 6,
}
const sug = (tag: string, name: string, desc: string, price: string, tx = TAG_TX[tag] ?? 0) => ({
  tag,
  name,
  desc,
  price,
  tx,
})

export const goals: Goal[] = [
  {
    label: 'Flacidez',
    img: flacidez,
    s: [
      sug(
        'Fotona láser · rostro',
        'Fotona 4D',
        'Tensa y renueva la piel en cuatro pasos, sin agujas.',
        '$650',
      ),
      sug(
        'Fotona Body',
        'Tensado de cuello',
        'Mejora la firmeza del cuello y la línea de la mandíbula.',
        '$550',
      ),
    ],
  },
  {
    label: 'Arrugas y líneas',
    img: arrugas,
    s: [
      sug(
        'Inyectables',
        'Neurotoxina',
        'Suaviza líneas de expresión en frente, entrecejo y patas de gallo.',
        '$225 / área',
      ),
      sug(
        'Fotona láser · rostro',
        'Fotona 4D',
        'Trabaja las arrugas finas y la calidad de la piel.',
        '$650',
      ),
    ],
  },
  {
    label: 'Manchas',
    img: facialDespues,
    s: [
      sug(
        'Cuidado médico de la piel',
        'MesojectGun Melasma',
        'Protocolo para melasma y pigmentación.',
        '$375',
      ),
      sug(
        'Cuidado médico de la piel',
        'Peeling químico',
        'Renueva la capa superficial y unifica el tono.',
        '$125',
      ),
    ],
  },
  {
    label: 'Vello',
    img: treatments[3]!.img,
    s: [
      sug(
        'Depilación láser Fotona',
        'Axilas',
        'Paquete de 8 sesiones para resultados duraderos.',
        '$175',
      ),
      sug(
        'Depilación láser Fotona',
        'Rostro completo',
        'Para vello facial, en todo tipo de piel.',
        '$250',
      ),
    ],
  },
  {
    label: 'Labios',
    img: rellenoDespues,
    s: [
      sug(
        'Rellenos dérmicos',
        'Relleno de labios',
        'Volumen y definición con ácido hialurónico.',
        '$700 (1 ml)',
      ),
      sug(
        'Fotona láser · rostro',
        'Fotona LipLace',
        'Hidrata y da volumen sin inyecciones.',
        '$300',
      ),
    ],
  },
  {
    label: 'Textura y poros',
    img: fotonaAntes,
    s: [
      sug(
        'Cuidado médico de la piel',
        'HydraFacial Signature',
        'Limpieza profunda, exfoliación e hidratación.',
        '$170',
      ),
      sug(
        'Cuidado médico de la piel',
        'Microneedling + vitaminas',
        'Estimula colágeno y mejora la textura.',
        '$250',
      ),
    ],
  },
  {
    label: 'Ojeras',
    img: ojeras,
    s: [
      sug(
        'Fotona láser · rostro',
        'Fotona SmoothEye',
        'Trabaja la piel fina alrededor de los ojos.',
        '$350',
      ),
      sug(
        'Cuidado médico de la piel',
        'MesojectGun Ojeras',
        'Ilumina y descongestiona la zona.',
        '$375',
      ),
    ],
  },
  {
    label: 'Cuerpo',
    img: cuerpo,
    s: [
      sug('Fotona Body', 'Tensado de abdomen', 'Mejora la firmeza de la piel del abdomen.', '$500'),
      // Las várices están en «Renovación de la piel con Fotona»
      sug(
        'Fotona Body',
        'Várices · áreas pequeñas',
        'Tratamiento láser de venas visibles.',
        '$600',
        1,
      ),
    ],
  },
]

// ---------- Experiencia (tarjetas apiladas) ----------

export const steps: {
  num: string
  label: string
  title: string
  text: string
  img: ImageMetadata
  pos: string
}[] = [
  {
    num: '01',
    label: 'Desde que reservas',
    title: 'Tu hora es solo tuya',
    text: 'La experiencia empieza antes de llegar. Tu cita queda reservada para ti, sin agendas llenas ni turnos encimados.',
    img: step1,
    pos: 'center 38%',
  },
  {
    num: '02',
    label: 'Al llegar',
    title: 'Nunca eres uno más',
    text: 'Sin ruido ni salas de espera llenas. Entras a un espacio en calma, con tu privacidad cuidada.',
    img: step2,
    pos: 'center 45%',
  },
  {
    num: '03',
    label: 'Durante tu tratamiento',
    title: 'Hecho bien, no rápido',
    text: 'No se trata de hacer más tratamientos, sino de hacerlos bien. Te consentimos y avanzamos a tu ritmo.',
    img: step3,
    pos: 'center 68%',
  },
]

// ---------- Equipo ----------
// El diseño tiene una tercera persona («Nombre», esteticista) sin datos todavía:
// se añade aquí cuando la clínica pase su nombre y su formación.

export const team: {
  name: string
  img: ImageMetadata
  role: string
  tag: string
  cred: string
  bio: string
}[] = [
  {
    name: 'Alain Castellat',
    img: alain,
    role: 'APRN, FNP-C',
    tag: 'DIRECCIÓN MÉDICA',
    cred: 'APRN, FNP-C · Enfermero de práctica avanzada',
    bio: 'Médico de formación, enfermero registrado y Nurse Practitioner en Florida. Fundó GlowHaus para ofrecer una estética sin prisas, una persona a la vez.',
  },
  {
    name: 'Daniela Vela',
    img: daniela,
    role: 'FNP-BC',
    tag: 'LÁSER',
    cred: 'FNP-BC · Family Nurse Practitioner',
    bio: 'Nurse Practitioner certificada. Valora a cada paciente y realiza tratamientos con láser Fotona.',
  },
]

// ---------- Reseñas de Google (texto original, sin traducir) ----------

export interface Review {
  n: string
  /** Tratamiento y fecha relativa; se traduce */
  s: string
  t: string
  /** Idioma en que está escrita la reseña */
  lang: 'es' | 'en'
  img?: ImageMetadata
}
const reviews: Review[] = [
  {
    n: 'Bella Guevara',
    s: 'HydraFacial · hace 3 meses',
    img: bella,
    lang: 'en',
    t: 'I had the Deluxe Hydrafacial with Sabrina and it was such an amazing experience! My skin was instantly so smooth, hydrated, and glowing. Sabrina has the best hands and made the whole treatment feel so relaxing. The space is beautiful, clean, and welcoming, plus there’s easy parking and the location is super convenient. I already can’t wait to come back and would recommend GlowHaus Aesthetics to anyone!',
  },
  {
    n: 'Alejandra Rojas',
    s: 'HydraFacial · hace 3 meses',
    lang: 'en',
    t: 'I had an excellent experience at GlowHaus Aesthetics. Dr. Alain was very professional, attentive, and took the time to explain everything clearly. Sabrina also did an amazing job with my facial, paying close attention to every detail and making the experience very relaxing. The atmosphere is calm, welcoming, and perfect for unwinding. I definitely recommend them!',
  },
  {
    n: 'Eliza Fernández Díaz',
    s: 'Radiesse + HydraFacial · hace 6 meses',
    lang: 'es',
    t: 'Mi experiencia en GlowHaus Aesthetics fue absolutamente maravillosa! Desde que entras, el staff te hace sentir bienvenida y cuidada. La atención y el detalle fue extraordinaria. El Dr Alain y Sabrina fueron muy profesionales en todo momento. Me hice un relleno de Radiesse con el Dr Alain y un Hydrafacial con Sabrina, y los resultados fueron increíblemente naturales. Las manos de ambos son mágicas! El lugar es impecable, acogedor y lindo. Recomiendo esta oficina 100% a cualquiera que busque calidad y profesionalismo. ¡Volveré sin duda!',
  },
  {
    n: 'Marilen Ruiz',
    s: 'Botox · hace un mes',
    lang: 'en',
    t: 'This is the best Medspa in Miami, Florida! My experience has been exceptional and unique, and the results are truly amazing. I recommend GlowHaus Aesthetics to everyone who wants to look naturally beautiful.',
  },
  {
    n: 'Odelia Feumba',
    s: 'Dysport · hace un mes',
    img: odelia,
    lang: 'en',
    t: 'I wanted to fix a minor issue with my smile and did a gummy smile treatment. The attention and care given at GlowHaus is remarkable! The team is extremely professional and kind, and very attentive to your concerns. Happy to have found my beauty spot in Miami!',
  },
  {
    n: 'Sabrina Flores',
    s: 'Fotona LipLase · hace un mes',
    lang: 'en',
    t: 'GlowHaus Aesthetics was the most professional and welcoming medspa I’ve been to. From the second you walk in your greeted and made felt so comfortable. Dr. Alain and aesthetician Sabrina were amazing and so educated guiding me through my Fotona Liplase treatment. They informed me on treatment expectations and maintenance. I’m obsessed with my results and definitely will be back! Thank you.',
  },
]
/** Tres columnas, en el orden del diseño */
export const reviewColumns: Review[][] = [
  [reviews[0]!, reviews[1]!],
  [reviews[2]!, reviews[5]!],
  [reviews[4]!, reviews[3]!],
]

// ---------- Testimonios en vídeo (public/media) ----------

export const testimonials = [
  {
    src: '/media/testimonio-1.mp4',
    poster: '/media/testimonio-1.jpg',
    tag: 'Fotona 4D',
    title: 'Su recuperación',
  },
  {
    src: '/media/testimonio-2.mp4',
    poster: '/media/testimonio-2.jpg',
    tag: 'Inyectables',
    title: 'Su primera vez',
  },
  {
    src: '/media/testimonio-3.mp4',
    poster: '/media/testimonio-3.jpg',
    tag: 'Fotona',
    title: 'Su experiencia',
  },
  {
    src: '/media/testimonio-4.mp4',
    poster: '/media/testimonio-4.jpg',
    tag: 'Complementos',
    title: 'Su visita',
  },
]

// ---------- Preguntas frecuentes ----------

export const homeFaqs: Faq[] = [
  {
    q: '¿Necesito una valoración antes de mi primer tratamiento?',
    a: 'Sí. En la valoración revisamos tu piel, lo que quieres mejorar y tu historial, y te decimos qué tratamiento te conviene y cuánto cuesta.',
  },
  {
    q: '¿Quién realiza los tratamientos?',
    a: 'Un equipo licenciado bajo la dirección de Alain Castellat, APRN. En cada página de tratamiento verás quién lo realiza.',
  },
  {
    q: '¿Los precios de la web son los finales?',
    a: 'Son los precios vigentes por sesión y por paquete. El total depende del plan que definamos en tu valoración.',
  },
  {
    q: '¿Puedo pagar en cuotas?',
    a: 'Sí, con Cherry. Divides el costo del paquete en pagos mensuales y la solicitud se hace desde el celular.',
  },
  {
    q: '¿Cómo reservo?',
    a: 'Escríbenos por WhatsApp o llámanos al +1 (786) 918-2997 y te damos cita. No tenemos agenda en línea: así confirmamos contigo el tratamiento y el horario.',
  },
  {
    q: '¿Dónde están?',
    a: 'En 11890 SW 8th St, Miami, FL. Atendemos de lunes a viernes, de 9:00 a. m. a 6:00 p. m.',
  },
]

// ---------- Mapa del cuerpo ----------
// Coordenadas en % de la figura (proporción 2/3), copiadas del diseño. Las
// categorías de rostro amplían la cara y usan otro juego de puntos.

type P = [number, number]
const BODY: Record<string, P[]> = {
  cara: [[49.8, 11.4]],
  cuero: [[49.8, 5.4]],
  labios: [[49.8, 13.1]],
  cuello: [[49.8, 16.5]],
  escote: [[49.8, 20]],
  axilas: [
    [39.5, 22],
    [60.2, 22],
  ],
  brazos: [
    [35, 26.5],
    [64.6, 26.5],
  ],
  manos: [
    [11.8, 45],
    [88, 45],
  ],
  pecho: [[49.8, 22.6]],
  abdomen: [[49.8, 32.5]],
  flancos: [
    [43, 34.5],
    [56.6, 34.5],
  ],
  intima: [[49.8, 46.5]],
  muslos: [
    [45, 54],
    [54.7, 54],
  ],
  piernas: [
    [46, 76],
    [54.2, 76],
  ],
}
const FACE: Record<string, P[]> = {
  frente: [[50, 21.5]],
  entrecejo: [[50, 31]],
  patas: [
    [26, 36.5],
    [74, 36.5],
  ],
  ojeras: [
    [35.6, 39.5],
    [64.5, 39.5],
  ],
  mejillas: [
    [32, 45.5],
    [68, 45.5],
  ],
  surcos: [
    [43, 52],
    [57, 52],
  ],
  labios: [[50, 55.3]],
  menton: [[50, 62.5]],
  mandibula: [
    [29.5, 57],
    [70.5, 57],
  ],
  masetero: [
    [28.5, 51],
    [71.5, 51],
  ],
  nariz: [[50, 44]],
  cuello: [[50, 73]],
  escote: [[50, 91]],
}
/** Zonas por categoría, en el orden de `treatments` */
const ZONES: { face: boolean; z: string[] }[] = [
  { face: true, z: ['frente', 'ojeras', 'mejillas', 'labios', 'mandibula', 'cuello'] },
  { face: false, z: ['cara', 'manos', 'piernas', 'cuero'] },
  { face: false, z: ['cuello', 'brazos', 'abdomen', 'flancos', 'muslos'] },
  { face: false, z: ['labios', 'axilas', 'pecho', 'brazos', 'piernas'] },
  { face: true, z: ['frente', 'entrecejo', 'patas', 'nariz', 'labios', 'menton', 'masetero'] },
  { face: true, z: ['labios', 'mejillas', 'surcos', 'menton', 'mandibula'] },
  { face: true, z: ['frente', 'mejillas', 'nariz', 'menton', 'cuello'] },
  { face: false, z: ['intima'] },
  { face: true, z: ['frente', 'ojeras', 'mejillas', 'labios', 'cuello'] },
  { face: false, z: ['abdomen', 'flancos'] },
  { face: false, z: ['cara', 'escote', 'muslos'] },
]
export const bodyMap = ZONES.map(({ face, z }) => ({
  face,
  dots: z.flatMap((k) => (face ? FACE : BODY)[k] ?? []),
}))
