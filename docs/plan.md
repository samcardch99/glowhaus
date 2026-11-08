# Plan: web de GlowHaus

Web estática con Astro 7, Tailwind 4 y GSAP (ScrollTrigger y SplitText) para Hostinger. Diseño de referencia: `design/GlowHaus Web v3 -Vercel-.dc.html` (carpeta local, fuera de git).

## Decisiones

| Tema           | Decisión                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Páginas        | Inicio, Sobre nosotros, Tratamientos, Fotona 4D, Tu primera visita y Contacto, en español (`/`) e inglés (`/en/`)                               |
| URLs en inglés | Traducidas (`/en/treatments`), por SEO                                                                                                          |
| Reservas       | Solo WhatsApp (`wa.me/17869182997`)                                                                                                             |
| Formularios    | EmailJS desde el navegador. Las claves públicas van en variables `PUBLIC_EMAILJS_*` y se limitan los dominios permitidos en el panel de EmailJS |
| Navegación     | Multipágina, sin `ClientRouter`                                                                                                                 |
| Hosting        | Hostinger, primero con su dominio temporal                                                                                                      |
| Dominio        | `glowhausaesthetics.net` está en Namecheap. Se transfiere o se apunta a Hostinger **al final**                                                  |
| Repo           | Público en GitHub. Nunca se suben los originales de `design/uploads/` ni nada privado de pacientes                                              |

## Fases

1. **Inventario y contenido:** textos a `src/i18n/{es,en}.ts` y tratamientos en una _content collection_.
2. **Imágenes y vídeos:** `scripts/optimize-media.sh` (ffmpeg), clips de 2,5 MB como máximo con su portada; imágenes con `astro:assets`.
3. **Plantilla común:** `Header`, `MobileMenu`, `Footer`, `WhatsAppButton`, `StackSection`, `Seo` y selector de idioma.
4. **Páginas:** primero Inicio (9 secciones) y después las otras cinco; maquetadas en 375, 768 y 1440.
5. **Animaciones con GSAP:** `gsap.matchMedia()` y `prefers-reduced-motion`; apilado con `sticky` de CSS; solo `transform` y `opacity`.
6. **Formularios con EmailJS:** validación, estados de envío y error, protección anti-spam (_honeypot_, reCAPTCHA de EmailJS).
7. **SEO local:** sitemap, `hreflang`, JSON-LD de `MedicalBusiness` y `FAQPage`, Open Graph.
8. **Accesibilidad:** el dorado `#A8844F` sobre crema da ~3,3:1, así que solo va en textos grandes o adornos y el texto pequeño usa `#765C37`; pausa en los vídeos en bucle.
9. **QA:** smoke con Playwright, revisión visual en los tres tamaños y en Safari de iOS, Lighthouse en móvil de 90 o más.
10. **Despliegue:** Hostinger con el dominio temporal y, al final, el dominio desde Namecheap.

## Pendiente de confirmar

- ¿La clínica usa Cherry? Si sí, falta el enlace de solicitud.
- Dirección exacta de la clínica, para el mapa y los datos estructurados.
- Cuenta de EmailJS: Service ID, Template ID y Public Key.

## Comprobaciones antes de cada commit

```bash
pnpm build && pnpm check && pnpm format:check
```
