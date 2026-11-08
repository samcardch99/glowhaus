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

## Estado (08-11-2026)

Las fases 1 a 8 están hechas y la web está publicada en el sitio temporal:
<https://darkgray-mandrill-714142.hostingersite.com>. El sitio temporal no se indexa (`noindex`).

Pendiente de la clínica:

- **Claves de EmailJS:** ver `docs/emailjs.md`. Hasta que estén, el formulario envía la consulta por WhatsApp.
- **Enlace de solicitud de Cherry:** va en `site.cherry`, en `src/data/site.ts`.
- **Enlaces reales de Facebook y TikTok:** también en `site.ts`.
- **Tercera persona del equipo:** se añade en `src/data/home.ts`.
- **Foto horizontal de la sala:** la actual (768×1024, vertical) se ve blanda en el banner de Primera visita.
- **Revisión de los textos de Privacidad y Términos.**
- **Conectar `glowhausaesthetics.net`:** transferir desde Namecheap o apuntar los DNS. Después, construir sin `SITE_URL` y volver a desplegar.

## Desplegar

1. Construye y comprime la web:

   ```bash
   SITE_URL=https://darkgray-mandrill-714142.hostingersite.com pnpm build   # en el dominio final, sin SITE_URL
   rm -f site.zip && (cd dist && zip -qr ../site.zip .)
   ```

2. Sube `site.zip` a `public_html` con la API de archivos de Hostinger (TUS).
3. Ejecuta `hosting_websites_deploy-static-site-archive` con `archive_path: site.zip`, que reemplaza todo el contenido del sitio.
