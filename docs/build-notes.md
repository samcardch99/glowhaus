# Notas de construcción

Convenciones del código de la web. Léelas antes de tocar una página.

## Referencias

- Diseño: `design/GlowHaus Web v3 -Vercel-.dc.html` (solo en local, ignorado por git). Se ve en `http://127.0.0.1:4400/GlowHaus%20Web%20v3%20-Vercel-.dc.html` cuando el servidor de la carpeta `design/` está arrancado.
- Marcado del diseño limpio, por secciones: `/private/tmp/claude-501/-Users-sam-Documents-laira/fa562ac9-3ef6-40d0-a75c-4018ce24d885/scratchpad/markup.html`
  - Inicio: desde la línea 29.
  - Tratamientos: desde la 298.
  - Plantilla de detalle: desde la 355.
  - Nosotros: desde la 467.
  - Visita: desde la 515.
  - Contacto y pie: desde la 573.
- Datos del diseño (arrays de JS): `…/scratchpad/data.js`, con `goalData`, `faqHomeData`, el equipo, las reseñas, los pasos, `visitSteps`, los testimonios y los antes/después.

## Piezas comunes (no se tocan desde una página)

- `src/layouts/Layout.astro`, con estas props:
  - `lang`, `title`, `description`;
  - `altPath`: la ruta equivalente en el otro idioma;
  - `headerTheme`: `overlay`, `light` o `dark`;
  - `contact`: añade la sección de contacto antes del pie y vale `true` por defecto;
  - `ogImage`, `jsonLd` y `noindex`.

  El layout ya incluye la cabecera, el menú, el contacto, el pie y `src/scripts/site.ts`.

- `src/i18n/index.ts`:
  - `useT(lang)` devuelve `t('texto en español')`. El texto se escribe siempre en español: el inglés sale del diccionario.
  - Las traducciones nuevas van en **`src/i18n/extra/<área>.json`**, un archivo por área, con forma `{ "es": "en" }`. En `pnpm dev` se avisa en consola de cada texto sin traducción.
  - `pathFor(lang, 'home' | 'about' | 'treatments' | 'visit' | 'contact' | 'privacy' | 'terms')` y `treatmentPath(lang, slug)` devuelven las rutas.
- `src/data/treatments.ts`: las 11 categorías, con slugs, precios, pasos y preguntas frecuentes, y los helpers `fromLabel` y `countLabel`.
- `src/data/site.ts`: teléfono, dirección, `whatsappHref(lang, tema?)` y `site.cherry`, que está vacío hasta que la clínica pase su enlace.
- `src/components/ui/Button.astro`: botón de cristal con flecha, con estas props:
  - `href`;
  - `tone`: `light` sobre fondo oscuro, `dark` sobre fondo claro;
  - `back` para «Atrás»;
  - `external`.
- `src/components/ui/Arrow.astro`: la flecha ↗.

## Utilidades CSS (`src/styles/global.css`)

- Colores: `cream`, `cream-2`, `cream-3`, `sand`, `sand-2`, `beige`, `tan`, `gold`, `gold-light`, `gold-dark`, `brown`, `brown-2`, `ink`, `taupe`, `silver` y `ash`.
- Utilidades:
  - `font-display` para los títulos en Aboreto;
  - `eyebrow` para las versalitas de 13,5 px;
  - `label-caps`;
  - `text-body` y `text-body-sm`;
  - `px-gutter` para los márgenes laterales;
  - `btn-glass` y `btn-glass-dark`;
  - `glass-panel` y `glass-chip`;
  - `stack-shadow`;
  - `no-scrollbar`.
- **Contraste:** el dorado `gold` sobre crema solo se usa en texto grande (24 px o más). En texto pequeño sobre fondo claro, usa `gold-dark`.

## Comportamientos globales (`site.ts`), por atributo

| Atributo                                                                                     | Qué hace                                                                                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `data-theme="dark\|light\|overlay"`                                                          | En cada sección: la cabecera cambia de color cuando la tiene debajo. **Pónselo a toda sección.** |
| `data-reveal` (con `data-delay="200"` opcional, en ms)                                       | Aparece con un fundido, desplazamiento y desenfoque al entrar en pantalla                        |
| `data-stack-wrap` con hijos `data-stack`                                                     | Tarjetas sticky que se apilan; la de debajo se reduce y se oscurece                              |
| `data-cover`                                                                                 | Una sección sticky que se oscurece cuando la tapa la siguiente                                   |
| `data-count="650"`                                                                           | Contador desde 0, conservando el prefijo y el sufijo del texto                                   |
| `data-type`                                                                                  | Texto que se escribe solo                                                                        |
| `<video data-autoplay data-src="/media/x.mp4" muted loop playsinline poster="/media/x.jpg">` | Se carga cerca de la pantalla y se pausa fuera de ella                                           |
| `data-video-toggle` + `aria-controls="<id del vídeo>"`                                       | Botón de pausa del vídeo; obligatorio en cada vídeo en bucle visible                             |

Las animaciones propias de una sección van en un `<script>` dentro de su componente:

- importan desde `src/scripts/gsap.ts` (`gsap`, `ScrollTrigger`, `SplitText`, `prefersReducedMotion`);
- respetan `prefersReducedMotion()` y usan `gsap.matchMedia()` para separar móvil y escritorio;
- dejan el contenido visible y usable sin JavaScript.

## Medios

- **Imágenes:** se importan desde `src/assets/...` y se pintan con `<Image>` o `<Picture>` de `astro:assets`, con `widths` y `sizes`. `loading="eager"` solo en la imagen principal de la primera pantalla.
- **Vídeos:** en `public/media/` hay un `.mp4` y un póster `.jpg` de cada uno:
  - `hero-reel`, `fotona-reel` y `fotona-4d`;
  - `tx-renovacion`, `tx-body`, `tx-inyectables`, `tx-rellenos`, `tx-skincare`, `tx-intimo` y `tx-complementos`;
  - `testimonio-1`, `testimonio-2` y `testimonio-3`, con sonido: sin `autoplay`, con controles o con reproducción al pulsar.

## Reservas y contacto

- **Reservas:** todo botón de «Reservar», «Reserve su cita» o «Ver y reservar» de un tratamiento lleva a `whatsappHref(lang, nombre)` con `target="_blank" rel="noopener"`, o a la ficha del tratamiento si el diseño lo indica.
- **Preguntas frecuentes:** «¿Cómo reservo?» se responde con WhatsApp o teléfono. No existe una agenda en línea.
- **Accesibilidad:**
  - Un solo `h1` por página, y los títulos en orden.
  - Los acordeones con `<details>`/`<summary>`, o con botones con `aria-expanded`.
  - Los carruseles se manejan con teclado.
  - El slider de antes/después es un `<input type="range">` accesible.

## Comprobación

`pnpm check` (tsc) y `pnpm build`, sin errores. Prettier: `pnpm format`.
