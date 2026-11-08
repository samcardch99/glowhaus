import type { ImageMetadata } from 'astro'
import p0 from '../assets/photos/p0.jpg'
import p1 from '../assets/photos/p1.jpg'
import p2 from '../assets/photos/p2.jpg'
import p3 from '../assets/photos/p3.jpg'
import p4 from '../assets/photos/p4.jpg'
import p5 from '../assets/photos/p5.jpg'
import p7 from '../assets/photos/p7.jpg'
import p8 from '../assets/photos/p8.jpg'
import p9 from '../assets/photos/p9.jpg'
import bienestar from '../assets/photos/bienestar.jpg'
import intimoInterna from '../assets/photos/intimo-interna.jpg'
import inyectablesImg from '../assets/tx/inyectables.jpg'
import rellenosImg from '../assets/tx/rellenos.jpg'

// Las 11 categorías de tratamientos. Texto en español: el inglés sale del
// diccionario (src/i18n). Precios en dólares tal como los publica la clínica.

export interface PriceRow {
  n: string
  p: string
}
export interface Step {
  t: string
  d: string
}
export interface Faq {
  q: string
  a: string
}

export interface Treatment {
  /** Ruta en español y en inglés */
  slug: { es: string; en: string }
  /** Nombre de la categoría (carrusel, menú, pie) */
  name: string
  /** Título de la ficha (la de Fotona rostro se llama Fotona 4D) */
  title: string
  tag: string
  from: string
  short: string
  /** Texto del paquete, debajo de la tabla de precios */
  desc: string
  img: ImageMetadata
  imgPos?: string
  /** Vídeo en bucle (public/media) */
  video?: string
  /** Imagen fija de la ficha cuando no hay vídeo o se prefiere una foto */
  detailImg?: ImageMetadata
  detailPos?: string
  items: PriceRow[]
  what: string
  sessions: string
  duration: string
  recovery: string
  by: string
  forWho: string[]
  stepsTitle: string
  steps: Step[]
  faqs: Faq[]
  /** Se muestran fotos de antes y después en la ficha */
  showResults: boolean
}

const A = 'Alain Castellat, APRN, FNP-C'
const E = 'Equipo licenciado de GlowHaus'
const P = (n: string, p: string): PriceRow => ({ n, p })
const S = (rows: [string, string][]): Step[] => rows.map(([t, d]) => ({ t, d }))
const F = (rows: [string, string][]): Faq[] => rows.map(([q, a]) => ({ q, a }))

export const treatments: Treatment[] = [
  {
    slug: { es: 'fotona-4d', en: 'fotona-4d' },
    name: 'Fotona rostro',
    title: 'Fotona 4D',
    tag: 'TRATAMIENTO INSIGNIA · FOTONA ROSTRO',
    from: '$300',
    short: 'Láser que tensa, renueva y da luminosidad al rostro sin agujas.',
    desc: 'Lifting no quirúrgico con láser Fotona para rostro, cuello, ojos y labios. Precio por sesión; paquetes de 4 sesiones con descuento.',
    img: p3,
    video: '/media/fotona-4d.mp4',
    items: [
      P('Fotona 4D · lifting no quirúrgico', '$650'),
      P('Fotona 4D · rostro y cuello', '$750'),
      P('Fotona SmoothEye', '$350'),
      P('Fotona LipLace', '$300'),
    ],
    what: 'Un tratamiento láser que tensa y renueva la piel del rostro por dentro y por fuera. Combina cuatro modos de la tecnología Fotona en una sola sesión, sin agujas y sin cirugía.',
    sessions: '2 a 4',
    duration: '60 min',
    recovery: 'Mínima',
    by: A,
    forWho: [
      'Flacidez leve o moderada',
      'Arrugas finas',
      'Pérdida de firmeza',
      'Textura irregular',
      'Quien prefiere no inyectarse',
    ],
    stepsTitle: 'Cuatro pasos, una sesión',
    steps: S([
      ['SmoothLiftin', 'Desde el interior de la boca, estimula el colágeno y da soporte a las mejillas y los surcos.'],
      ['FRAC3', 'Trabaja imperfecciones, manchas y textura en capas profundas de la piel.'],
      ['PIANO', 'Calor profundo y uniforme que tensa el óvalo del rostro y la piel del cuello.'],
      ['SupErficial', 'Un pulido suave de la superficie que deja la piel más lisa y luminosa.'],
    ]),
    faqs: F([
      ['¿Duele?', 'La mayoría de los pacientes lo describe como calor intenso en la piel. Usamos enfriamiento durante la sesión para que sea cómodo.'],
      ['¿Cuándo veo resultados?', 'Notarás la piel más luminosa en los primeros días. La firmeza mejora de forma gradual durante las semanas siguientes, a medida que la piel produce colágeno.'],
      ['¿Puedo volver al trabajo el mismo día?', 'Sí. Puede quedar enrojecimiento leve por unas horas. Te damos indicaciones de cuidado al terminar.'],
      ['¿Cuántas sesiones necesito?', 'Lo habitual son de 2 a 4 sesiones, separadas por unas 4 semanas. En tu valoración te decimos cuántas necesitas tú.'],
      ['¿Se puede combinar con otros tratamientos?', 'Sí, por ejemplo con neurotoxina o rellenos. Lo planificamos contigo para espaciar las citas de forma segura.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'renovacion-piel-fotona', en: 'fotona-skin-renewal' },
    name: 'Renovación de la piel con Fotona',
    title: 'Renovación de la piel con Fotona',
    tag: 'FOTONA · TEXTURA Y MANCHAS',
    from: '$200',
    short: 'Peelings láser, cicatrices de acné, manchas y lesiones.',
    desc: 'Resurfacing láser para textura, cicatrices, acné, manchas y lesiones vasculares. Paquetes de 3 sesiones. Lesiones con valoración previa.',
    img: p1,
    video: '/media/tx-renovacion.mp4',
    items: [
      P('GlowHaus Glass Skin Peel', '$300'),
      P('Fotona GlowHaus Light Peel', '$250'),
      P('Resurfacing fraccionado + PDGF', '$650'),
      P('Cicatrices de acné', '$450'),
      P('Acné activo', '$300'),
      P('Manos', '$250'),
      P('Restauración capilar · láser', '$200'),
      P('Restauración capilar + PDGF', '$650'),
      P('Lesiones pigmentadas', 'desde $250'),
      P('Lesiones benignas', 'desde $250'),
      P('Lesiones vasculares', 'desde $250'),
      P('Várices · áreas pequeñas (30 min)', '$600'),
      P('Várices · áreas grandes (30 min)', '$900'),
    ],
    what: 'Peelings y resurfacing con láser Fotona para mejorar la textura, las cicatrices de acné, las manchas y las lesiones de la piel. Cada protocolo se ajusta a tu tipo de piel.',
    sessions: '1 a 3',
    duration: '30–60 min',
    recovery: '1 a 5 días',
    by: A,
    forWho: ['Cicatrices de acné', 'Acné activo', 'Manchas y pigmentación', 'Poros y textura', 'Lesiones vasculares'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Valoración de la piel', 'Revisamos la zona, el tipo de piel y las lesiones para elegir el protocolo y la intensidad.'],
      ['Preparación', 'Limpiamos la piel y, si hace falta, aplicamos anestesia tópica para que estés cómoda.'],
      ['Láser Fotona', 'Tratamos la zona por capas. En algunos protocolos sumamos PDGF para acelerar la regeneración.'],
      ['Cuidados posteriores', 'Te llevas indicaciones de hidratación y protección solar para los días siguientes.'],
    ]),
    faqs: F([
      ['¿Cuánto tarda en recuperarse la piel?', 'Depende del protocolo. Un peeling suave deja la piel rosada unas horas; un resurfacing puede necesitar de 3 a 5 días.'],
      ['¿Sirve para cicatrices antiguas?', 'Sí. Las cicatrices de acné mejoran de forma progresiva con varias sesiones.'],
      ['¿Las lesiones tienen precio fijo?', 'Parten desde $250 y el precio final depende del tamaño y la cantidad. Lo confirmamos en tu valoración.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'fotona-body', en: 'fotona-body' },
    name: 'Fotona Body',
    title: 'Fotona Body',
    tag: 'FOTONA · CUERPO',
    from: '$450',
    short: 'Tensado de la piel y TightSculpting para el cuerpo.',
    desc: 'Tensado corporal y TightSculpting con láser Fotona. Precio por sesión; paquetes de 4 sesiones con descuento.',
    img: p2,
    video: '/media/tx-body.mp4',
    items: [
      P('Tensado de cuello', '$550'),
      P('Tensado de abdomen', '$500'),
      P('Tensado de brazos y piernas', '$500'),
      P('Tensado de glúteos', '$800'),
      P('TightSculpting · papada', '$450'),
      P('TightSculpting · abdomen', '$650'),
      P('TightSculpting · flancos', '$450'),
      P('TightSculpting · brazos y muslos', '$650'),
    ],
    what: 'Tensado de la piel y TightSculpting con láser Fotona para cuello, abdomen, brazos, piernas y glúteos. Mejora la firmeza y el contorno sin cirugía.',
    sessions: '4',
    duration: '30–60 min',
    recovery: 'Ninguna',
    by: A,
    forWho: ['Piel flácida después de bajar de peso', 'Grasa localizada', 'Papada', 'Abdomen y flancos', 'Brazos y muslos'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Valoración', 'Medimos la zona y definimos si conviene tensado, TightSculpting o ambos.'],
      ['Calor profundo', 'El láser calienta las capas profundas para estimular colágeno y tensar la piel.'],
      ['TightSculpting', 'En zonas con grasa localizada, el láser trabaja el tejido graso de forma no invasiva.'],
      ['Seguimiento', 'Repetimos cada pocas semanas hasta completar el paquete y medimos el avance.'],
    ]),
    faqs: F([
      ['¿Es doloroso?', 'Se siente como calor intenso y controlado. La mayoría lo tolera bien sin anestesia.'],
      ['¿Cuándo se ven los cambios?', 'La piel se ve más firme desde las primeras semanas y el resultado se consolida al terminar el paquete.'],
      ['¿Puedo hacer ejercicio después?', 'Sí, puedes seguir con tu rutina el mismo día.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'depilacion-laser', en: 'laser-hair-removal' },
    name: 'Depilación láser',
    title: 'Depilación láser',
    tag: 'FOTONA · DEPILACIÓN',
    from: '$120',
    short: 'Elimina el vello de forma duradera en rostro y cuerpo.',
    desc: 'Depilación con láser Fotona para rostro y cuerpo. Precio por sesión; paquetes de 8 sesiones.',
    img: p1,
    imgPos: 'center 30%',
    items: [
      P('Labio superior', '$120'),
      P('Axilas', '$175'),
      P('Rostro completo', '$250'),
      P('Pierna inferior', '$275'),
      P('Brazos parciales', '$275'),
      P('Brazos completos', '$400'),
      P('Pecho', '$400'),
      P('Piernas completas', '$450'),
      P('Pecho y abdomen bajo', '$450'),
      P('Espalda completa', '$500'),
    ],
    what: 'Depilación con láser Fotona para rostro y cuerpo. Reduce el vello de forma duradera sesión a sesión y es apta para distintos tonos de piel.',
    sessions: '8',
    duration: '15–60 min',
    recovery: 'Ninguna',
    by: E,
    forWho: ['Vello en rostro', 'Axilas', 'Piernas y brazos', 'Espalda y pecho', 'Vello encarnado'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Preparación', 'Llegas con la zona rasurada el día anterior, sin cera ni pinzas en las semanas previas.'],
      ['Prueba de piel', 'Ajustamos el láser a tu tono de piel y al tipo de vello.'],
      ['Tratamiento', 'Pasamos el láser por la zona con enfriamiento para que sea cómodo.'],
      ['Siguiente cita', 'Agendamos la próxima sesión según el ciclo de crecimiento del vello.'],
    ]),
    faqs: F([
      ['¿Cuántas sesiones necesito?', 'Lo habitual son 8 sesiones. Por eso los paquetes son de 8.'],
      ['¿Duele?', 'Se siente como un chasquido leve y caliente. Usamos enfriamiento durante la sesión.'],
      ['¿Puedo tomar sol después?', 'Evita el sol directo unos días antes y después de cada sesión y usa protector solar.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'inyectables', en: 'injectables' },
    name: 'Inyectables',
    title: 'Inyectables',
    tag: 'NEUROTOXINA',
    from: '$80',
    short: 'Suaviza líneas de expresión con resultados naturales.',
    desc: 'Neurotoxina para líneas de expresión y tratamientos puntuales del rostro.',
    img: p9,
    video: '/media/tx-inyectables.mp4',
    detailImg: inyectablesImg,
    items: [
      P('Neurotoxina · frente, entrecejo, patas de gallo', '$225 / área'),
      P('Nose lift', '$150'),
      P('Lip flip', '$80'),
      P('Líneas de conejo', '$80'),
      P('Sonrisa gingival', '$80'),
      P('Mentón (mentalis)', '$80'),
      P('DAO', '$80'),
      P('Nefertiti', '$400'),
      P('Masetero', '$700'),
      P('Hiperhidrosis (axilas)', '$1,000'),
    ],
    what: 'Neurotoxina para suavizar las líneas de expresión de la frente, el entrecejo y las patas de gallo, y para tratamientos puntuales como lip flip, masetero o sudoración excesiva.',
    sessions: '1',
    duration: '15–30 min',
    recovery: 'Ninguna',
    by: A,
    forWho: ['Líneas de expresión', 'Entrecejo', 'Patas de gallo', 'Bruxismo (masetero)', 'Sudoración excesiva'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Valoración', 'Alain observa tus gestos y define las zonas y las unidades necesarias.'],
      ['Marcado', 'Marcamos los puntos de aplicación para un resultado equilibrado.'],
      ['Aplicación', 'Microinyecciones rápidas con aguja muy fina, en pocos minutos.'],
      ['Revisión', 'A las dos semanas revisamos el resultado y ajustamos si hace falta.'],
    ]),
    faqs: F([
      ['¿Cuándo se ve el efecto?', 'Empieza a notarse entre 3 y 5 días después y el resultado completo llega a las 2 semanas.'],
      ['¿Cuánto dura?', 'Normalmente de 3 a 4 meses, según la zona y tu metabolismo.'],
      ['¿Se va a notar que me hice algo?', 'Buscamos un resultado natural: suavizar las líneas sin perder la expresión.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'rellenos-dermicos', en: 'dermal-fillers' },
    name: 'Rellenos dérmicos',
    title: 'Rellenos dérmicos',
    tag: 'ÁCIDO HIALURÓNICO Y BIOESTIMULADORES',
    from: '$700',
    short: 'Devuelve volumen y define labios, mejillas y contorno.',
    desc: 'Volumen y definición con ácido hialurónico y bioestimuladores. Precio por jeringa de 1 ml.',
    img: p7,
    video: '/media/tx-rellenos.mp4',
    detailImg: rellenosImg,
    items: [
      P('Labios', '$700'),
      P('Mejillas', '$700'),
      P('Surco nasolabial', '$700'),
      P('Skin booster (SkinVive, Redensity)', '$700'),
      P('Radiesse', '$950'),
    ],
    what: 'Rellenos con ácido hialurónico y Radiesse para devolver volumen y definir labios, mejillas y surcos. También skin boosters para hidratar la piel en profundidad.',
    sessions: '1',
    duration: '30–45 min',
    recovery: '1 a 3 días',
    by: A,
    forWho: ['Labios', 'Mejillas', 'Surco nasolabial', 'Pérdida de volumen', 'Piel deshidratada'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Valoración', 'Analizamos tus proporciones y decidimos cuánto producto necesitas.'],
      ['Anestesia', 'Aplicamos anestesia tópica; la mayoría de los rellenos ya traen lidocaína.'],
      ['Aplicación', 'Colocamos el producto con aguja o cánula, poco a poco y revisando el resultado.'],
      ['Cuidados', 'Te damos indicaciones para los primeros días y una revisión si la necesitas.'],
    ]),
    faqs: F([
      ['¿Cuánto dura un relleno?', 'Según la zona y el producto, de 6 a 18 meses.'],
      ['¿Se hincha?', 'Puede haber inflamación leve o algún moretón por 1 a 3 días.'],
      ['¿Cuántos ml necesito?', 'Depende de la zona y de lo que buscas. El precio es por jeringa de 1 ml y lo definimos contigo.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'cuidado-medico-piel', en: 'medical-skin-care' },
    name: 'Cuidado médico de la piel',
    title: 'Cuidado médico de la piel',
    tag: 'FACIALES MÉDICOS',
    from: '$90',
    short: 'Faciales médicos y HydraFacial para textura, manchas y acné.',
    desc: 'HydraFacial, faciales médicos, microneedling, MesojectGun y peelings. Precio por sesión; paquetes de 4 sesiones con descuento.',
    img: p4,
    video: '/media/tx-skincare.mp4',
    items: [
      P('HydraFacial Signature', '$170'),
      P('HydraFacial Deluxe', '$230'),
      P('HydraFacial Platinum', '$280'),
      P('GlowHaus Signature Experience', '$130'),
      P('Facial para acné', '$150'),
      P('Facial de espalda · 60 min', '$120'),
      P('Facial · 60 min', '$115'),
      P('Facial · 30 min', '$90'),
      P('Face Vitamin', '$150'),
      P('Microneedling + vitaminas', '$250'),
      P('Microneedling + PDGF', '$575'),
      P('Microneedling + Salmon DNA', '$475'),
      P('MesojectGun · ojeras', '$375'),
      P('MesojectGun · antiedad', '$375'),
      P('MesojectGun · melasma', '$375'),
      P('MesojectGun · capilar', '$375'),
      P('Peeling químico', '$125'),
      P('Exosomes Dermapen', '$475'),
    ],
    what: 'HydraFacial, faciales médicos, microneedling, MesojectGun y peelings para limpiar, hidratar y mejorar la textura, las manchas y el acné.',
    sessions: '1 a 4',
    duration: '30–90 min',
    recovery: 'Ninguna a 2 días',
    by: E,
    forWho: ['Piel apagada', 'Acné', 'Poros dilatados', 'Manchas', 'Ojeras'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Diagnóstico', 'Revisamos tu piel y elegimos el facial o la combinación que más te conviene.'],
      ['Limpieza profunda', 'Limpiamos, exfoliamos y extraemos impurezas.'],
      ['Tratamiento activo', 'Aplicamos el protocolo: HydraFacial, microneedling, MesojectGun o peeling.'],
      ['Hidratación y protección', 'Terminamos con sueros, hidratación y protector solar.'],
    ]),
    faqs: F([
      ['¿Cada cuánto debo hacerme un facial?', 'Para mantener resultados, cada 4 a 6 semanas.'],
      ['¿Puedo maquillarme después?', 'Tras un HydraFacial, sí. Tras microneedling, espera 24 horas.'],
      ['¿Qué facial me conviene?', 'Lo definimos en tu valoración según tu piel y lo que quieres mejorar.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'rejuvenecimiento-intimo', en: 'intimate-rejuvenation' },
    name: 'Rejuvenecimiento íntimo',
    title: 'Rejuvenecimiento íntimo',
    tag: 'FOTONA · SALUD ÍNTIMA',
    from: '$800',
    short: 'Láser Fotona para la salud y el bienestar íntimo.',
    desc: 'Tratamientos láser Fotona de salud íntima. Precio por sesión; paquetes de 3 sesiones por $2,100.',
    img: p5,
    video: '/media/tx-intimo.mp4',
    detailImg: intimoInterna,
    detailPos: 'center 45%',
    items: [
      P('IntimaLase · tensado vaginal', '$800'),
      P('IncontiLase · incontinencia urinaria', '$800'),
      P('RenovaLase · resequedad / menopausia', '$800'),
    ],
    what: 'Tratamientos láser Fotona para el tensado vaginal, la incontinencia urinaria leve y la resequedad asociada a la menopausia. Sin cirugía y en un espacio privado.',
    sessions: '3',
    duration: '20–30 min',
    recovery: 'Mínima',
    by: A,
    forWho: ['Incontinencia urinaria leve', 'Laxitud vaginal', 'Resequedad', 'Menopausia', 'Después del parto'],
    stepsTitle: 'Cómo es una sesión',
    steps: S([
      ['Consulta privada', 'Hablamos de tus síntomas con total confidencialidad.'],
      ['Preparación', 'Te explicamos el procedimiento y te preparamos en una sala privada.'],
      ['Láser Fotona', 'Una sesión breve, sin cortes ni anestesia en la mayoría de los casos.'],
      ['Recomendaciones', 'Te indicamos cuántos días evitar relaciones y ejercicio intenso.'],
    ]),
    faqs: F([
      ['¿Es doloroso?', 'La mayoría siente calor leve. Es un procedimiento bien tolerado.'],
      ['¿Cuántas sesiones necesito?', 'El protocolo es de 3 sesiones, por eso el paquete de 3 cuesta $2,100.'],
      ['¿Cuándo noto mejoría?', 'Muchas pacientes notan cambios desde la primera sesión, y mejoran con las siguientes.'],
    ]),
    showResults: false,
  },
  {
    slug: { es: 'paquetes-vip', en: 'vip-packages' },
    name: 'Paquetes VIP',
    title: 'Paquetes VIP',
    tag: 'COMBINACIONES ESPECIALES',
    from: '$299 / mes',
    short: 'Combinaciones de Fotona y HydraFacial con precio especial.',
    desc: 'Paquetes que combinan Fotona 4D, SmoothEye, LipLace y HydraFacial Platinum, y una membresía mensual.',
    img: p8,
    items: [
      P('Gold Glow', '$1,999'),
      P('GlowHaus 4D Transformation', '$1,999'),
      P('Bridal Glow', '$999'),
      P('Executive Refresh', '$1,199'),
      P('Membresía Total Face Rejuvenation', '$299 / mes'),
    ],
    what: 'Paquetes que combinan Fotona 4D, SmoothEye, LipLace y HydraFacial Platinum con un precio especial, y una membresía mensual para mantener tus resultados.',
    sessions: 'Según paquete',
    duration: 'Varias citas',
    recovery: 'Mínima',
    by: A,
    forWho: ['Antes de una boda', 'Rejuvenecimiento completo', 'Agenda apretada', 'Mantenimiento mensual'],
    stepsTitle: 'Cómo funciona',
    steps: S([
      ['Elige tu paquete', 'Gold Glow, 4D Transformation, Bridal Glow, Executive Refresh o la membresía.'],
      ['Valoración', 'Confirmamos que el paquete se ajusta a tu piel y a tus fechas.'],
      ['Calendario', 'Organizamos todas tus sesiones con anticipación.'],
      ['Seguimiento', 'Revisamos el avance en cada cita y ajustamos si hace falta.'],
    ]),
    faqs: F([
      ['¿Puedo pagar el paquete en cuotas?', 'Sí, con Cherry.'],
      ['¿Cómo funciona la membresía?', 'Pagas $299 al mes y recibes tratamientos periódicos de rejuvenecimiento facial.'],
      ['¿Puedo cambiar un tratamiento del paquete?', 'Lo podemos ajustar en tu valoración.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'bienestar', en: 'wellness' },
    name: 'Bienestar',
    title: 'Bienestar',
    tag: 'PÉRDIDA DE PESO MÉDICA',
    from: 'Consultar',
    short: 'Programa médico de pérdida de peso.',
    desc: 'Programa médico de pérdida de peso con seguimiento. Requiere consulta.',
    img: bienestar,
    items: [P('Pérdida de peso médica', 'Consultar')],
    what: 'Programa médico de pérdida de peso con seguimiento de Alain Castellat, APRN. El plan se define en una consulta según tu historial y tus objetivos.',
    sessions: 'Mensual',
    duration: '30 min',
    recovery: 'Ninguna',
    by: A,
    forWho: ['Bajar de peso con acompañamiento', 'Control del apetito', 'Seguimiento médico'],
    stepsTitle: 'Cómo funciona',
    steps: S([
      ['Consulta', 'Revisamos tu historial, tus hábitos y tus objetivos.'],
      ['Plan', 'Definimos el tratamiento y la frecuencia de las citas.'],
      ['Inicio', 'Empiezas el programa con indicaciones claras.'],
      ['Seguimiento', 'Citas periódicas para medir el avance y ajustar el plan.'],
    ]),
    faqs: F([
      ['¿Cuánto cuesta?', 'El precio depende del plan y se define en la consulta.'],
      ['¿Necesito análisis?', 'En algunos casos sí. Te lo indicamos en la consulta.'],
      ['¿Cada cuánto son las citas?', 'Normalmente una vez al mes.'],
    ]),
    showResults: true,
  },
  {
    slug: { es: 'complementos', en: 'add-ons' },
    name: 'Complementos',
    title: 'Complementos',
    tag: 'PARA SUMAR A TU TRATAMIENTO',
    from: '$10',
    short: 'Luz LED, drenaje y más para potenciar tu tratamiento.',
    desc: 'Para sumar a tu facial o tratamiento. Precio por sesión.',
    img: p0,
    video: '/media/tx-complementos.mp4',
    detailImg: p0,
    items: [
      P('Terapia de luz LED', '$20'),
      P('Drenaje linfático', '$80'),
      P('Cuello y escote', '$50'),
      P('Globos fríos', '$10'),
    ],
    what: 'Pequeños extras para sumar a tu facial o tratamiento: terapia de luz LED, drenaje linfático, cuello y escote, y globos fríos.',
    sessions: 'Por sesión',
    duration: '10–30 min',
    recovery: 'Ninguna',
    by: E,
    forWho: ['Desinflamar', 'Calmar la piel', 'Potenciar un facial', 'Cuello y escote'],
    stepsTitle: 'Cómo se suman',
    steps: S([
      ['Elige tu tratamiento', 'Reserva tu facial o tratamiento principal.'],
      ['Añade el complemento', 'Pídelo al reservar o el mismo día en la clínica.'],
      ['Lo aplicamos', 'Se hace en la misma cita, antes o después del tratamiento.'],
      ['Sales lista', 'Sin tiempo de recuperación.'],
    ]),
    faqs: F([
      ['¿Puedo reservar solo un complemento?', 'Están pensados para sumarse a otro tratamiento.'],
      ['¿Qué hace la luz LED?', 'Ayuda a calmar la piel y a potenciar los resultados del facial.'],
    ]),
    showResults: true,
  },
]

export const needsConsult = (t: Treatment) => t.from === 'Consultar'

/** «desde $300» o «Requiere consulta» (texto en español, se traduce con tr) */
export const fromLabel = (t: Treatment) => (needsConsult(t) ? 'Requiere consulta' : 'desde ' + t.from)

/** Recuento como en el diseño: «4 tratamientos» */
export const countLabel = (t: Treatment) =>
  t.items.length + (t.items.length === 1 ? ' tratamiento' : ' tratamientos')

export const treatmentBySlug = (lang: 'es' | 'en', slug: string) =>
  treatments.find((t) => t.slug[lang] === slug)
