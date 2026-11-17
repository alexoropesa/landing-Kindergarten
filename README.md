# Casa Alba Kindergarten — Landing de captación

Sitio estático (HTML + CSS + JS, sin build) para captar leads de familias: visitas guiadas y descargas del folleto.

| Documento | Contenido |
|---|---|
| [Design.md](Design.md) | Sistema visual: fuente única de verdad. **Consúltalo antes de crear o modificar secciones.** |
| [DECISIONS.md](DECISIONS.md) | Ambigüedades del brief, criterios, referencias Mobbin y resultados de Lighthouse. |

## Ejecutar

```bash
npm install          # solo sharp, para el pipeline de imágenes
npm run serve        # http://localhost:5173
npm run images       # regenera AVIF/WebP desde assets/src → assets/img
```

## Producción

1. En `script.js`, define en `CONFIG`: `leadEndpoint` (endpoint que guarda en el CRM y envía el correo) y `whatsappNumber`.
2. Sustituye los datos de demostración: teléfono, correo, dirección, JSON-LD, dominio canónico y OG, testimonios, y la tabla de costos del folleto (`scripts/brochure.html` → PDF).
3. Sirve `assets/` con `Cache-Control: public, max-age=31536000, immutable` y Brotli.

## Estructura

```
index.html · style.css · script.js     ← sitio
assets/img     imágenes optimizadas (AVIF/WebP)   assets/src   originales generados (Nodal)
assets/video   loop del hero (WebM/MP4)           assets/docs  folleto PDF
assets/fonts   Instrument Sans (variable)          assets/vendor GSAP, ScrollTrigger, Motion
scripts/       optimize-images.mjs · brochure.html (fuente del PDF)
```
