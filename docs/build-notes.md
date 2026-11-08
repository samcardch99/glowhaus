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

## Sistema de movimiento (`src/scripts/site.ts` y `src/scripts/gsap.ts`)

Replica la lógica de animación del diseño v3, que se puede leer extraída en
`/private/tmp/claude-501/-Users-sam-Documents-laira/fa562ac9-3ef6-40d0-a75c-4018ce24d885/scratchpad/design-logic.js`.
**No reimplementes en un componente lo que ya hace un atributo global.**

| Atributo | Qué hace (parámetros del diseño) |
| --- | --- |
| `data-theme="dark\|light\|overlay"` | En cada sección. La cabecera toma el color de fondo opaco de lo que tiene debajo y cambia su texto a claro u oscuro. Se esconde al bajar y vuelve al subir |
| `data-reveal` | Aparece en **grupo con sus hermanos** (mismo padre): sube 56 px, escala .96 → 1, 0,8 s, curva `glow` (.2,.7,.2,1), 220 ms entre hermanos. Se dispara cuando el primero del grupo llega al 82 % de la pantalla |
| `data-reveal="solo"` | Igual que `data-reveal`, pero aparece por su cuenta |
| `data-delay="ms"` | Retraso extra para `data-reveal` |
| `data-mark` | Destello dorado en el borde superior tras aparecer (tarjetas) |
| `data-words` (con `data-wstep="ms"` y `data-wdelay="ms"`) | Titular que aparece letra a letra. Úsalo en los h1/h2 grandes, nunca junto con `data-reveal` en el mismo elemento |
| `data-stack-wrap` > `data-stack` | Tarjetas sticky a pantalla completa. La de abajo tapa a la de arriba, que pasa a escala 1−.06p, desenfoque 4p, brillo 1−.35p y radio 18p; la que entra lleva sombra. En escritorio, cada golpe de rueda salta a la tarjeta siguiente (560–620 ms, easeInOutCubic) |
| `data-cover` (opcional: `data-cover-target`) | Una sección sticky que reacciona igual cuando la tapa su hermana siguiente |
| `data-count="650"` | Cuenta desde 0 en 1,3 s, conservando el prefijo y el sufijo |
| `data-wipe` | El texto se descubre de izquierda a derecha con desenfoque (1,4 s) |
| `data-glow` | Destello dorado del texto una vez, tras 0,9 s |
| Contenedor con `data-typerow` (cada fila con `data-dot` + `data-type`) | Se escribe fila a fila: el punto aparece con un rebote y luego el texto, a 22 ms por letra. Un `data-type` suelto también funciona |
| `video[data-autoplay][data-src]` | Carga diferida, play y pause según la visibilidad |
| `data-video-toggle` + `aria-controls` | Botón de pausa de un vídeo |

Más piezas:

- **Anclas** de la misma página: desplazamiento suave de 900 ms.
- **Transición entre páginas:** View Transitions en CSS (`global.css`).
- **Helpers de `src/scripts/gsap.ts`:**
  - curvas `glow`, `swift` y `wipe`;
  - `prefersReducedMotion()` e `isDesktopPointer()` (≥1100 px con ratón);
  - `easeInOutCubic` y `scrollToY(y, ms)`.
- **Entrada de marca:** `src/scripts/intro-state.ts` exporta `introDone`, una promesa que se resuelve cuando termina la entrada. Mientras corre, `<html>` tiene la clase `gh-intro-on`. Las animaciones de la primera pantalla esperan a `introDone`.

Reglas:

- **Hover** solo en escritorio (en Tailwind 4, `hover:` ya va dentro de `@media (hover:hover)`).
- **Rotación automática** (carruseles, metas, equipo, pagos): se pausa al interactuar 6–7 s, con la pestaña oculta o fuera de pantalla, y no corre con movimiento reducido.
- Todo debe verse completo **sin JS** y con **movimiento reducido**.

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
