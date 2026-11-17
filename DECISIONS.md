# DECISIONS.md — Casa Alba Kindergarten

Registro de cada ambigüedad del brief, cómo se resolvió y con qué criterio. Complementa a `Design.md` (sistema visual) y no lo reemplaza.

---

## 1. Producto y contenido

| # | Ambigüedad | Decisión | Criterio |
|---|---|---|---|
| 1.1 | El brief no da nombre, ubicación ni idioma de la marca. | **Casa Alba Kindergarten**, Coyoacán (CDMX), español de México (`es-MX`). | El brief está en español y usa "Pre-Kinder/Kinder", términos de Latinoamérica. Un barrio con identidad (Coyoacán) apoya el objetivo de **SEO local** (NFR-05) y la dirección de arte (casas de adobe, jacarandas). |
| 1.2 | Métricas de confianza (8:1, 15+ años, 100% seguras). | Se usan **las del propio brief** (8:1, 15+). "Instalaciones 100% seguras" se reformuló como **"100% de accesos controlados con registro"**. | No inventar datos. "100% seguras" es una promesa absoluta e imposible de verificar; el acceso controlado sí es un hecho comprobable. |
| 1.3 | Testimonios, teléfono, WhatsApp, correo y dirección exacta. | Contenido **de ejemplo**, señalado en el footer ("Sitio de demostración…"). Teléfono `+52 55 0000 0000` y dominio `.example` evidentemente ficticios. | Las reglas prohíben inventar testimonios o claims. Sin datos reales, lo honesto es marcarlos como demo y dejarlos centralizados (`CONFIG` en `script.js`, JSON-LD en `index.html`) para reemplazarlos en un solo lugar. |
| 1.4 | "Costos aproximados" en el FAQ, sin cifras en el brief. | El FAQ explica el **esquema** (inscripción + 10 colegiaturas, descuentos) y lleva a pedir el folleto. La tabla del PDF dice "Por confirmar". | Publicar precios inventados sería un claim falso. Además, enviar la consulta de costos al folleto refuerza el objetivo de negocio (descargas del folleto = leads). |
| 1.5 | Edades: el brief dice Pre-Kinder 3, Kinder 4–5 y actividades sin edad. | After-School de **3–6 años**, abierto a otras escuelas. El selector de edad del formulario incluye **2 años** ("ingreso próximo ciclo"). | Cubre el rango de 3 a 6 años del hero. Muchas familias empiezan a buscar escuela un año antes, así que el lead de 2 años es valioso. |
| 1.6 | "Descargas del folleto": el brief no dice si hay que dar datos para descargarlo. | La descarga pide **nombre, correo y consentimiento** (paso 1) y luego entrega el **PDF real** (`assets/docs/folleto-casa-alba.pdf`, 4 páginas, 424 KB). | El objetivo 1.2 del brief es captar leads con las descargas. Pedir solo 2 campos minimiza la fricción. |
| 1.7 | Un sitio "one-page" frente a "todas las pantallas, vistas de detalle, pestañas y subpestañas". | One-page con **capas de detalle**: tabs + subtabs (programas), drawer "Ver programa completo", modal multipaso del tour, modal del folleto, modal de historia, lightbox, modal legal y popover de WhatsApp. | Respeta la arquitectura one-page (§2 del brief) y cubre "vistas de detalle y flujos" sin crear rutas que dispersen la conversión. |
| 1.8 | Hay enlaces legales, pero no páginas legales. | **Modales legales** (privacidad con derechos ARCO/LFPDPPP, términos y cookies). | El consentimiento (NFR-04) debe enlazar a un aviso legible sin sacar al usuario del formulario. Al ser un modal anidado sobre el formulario, el progreso no se pierde. |

## 2. Referencias: Mobbin (estructura) frente a Podium (estética)

**Mobbin define cómo funciona.** Estas son las referencias usadas, solo como wireframe:

| Componente | Referencia Mobbin | Qué se tomó |
|---|---|---|
| Hero con medio inset y titular superpuesto | [Wix Learn — hero](https://mobbin.com/sites/sections/6eae0753-3cdb-4ca3-b070-0a207d352552) | Contenedor redondeado dentro del grid, texto abajo a la izquierda sobre la foto y CTA dual |
| Tabs de programas con subrayado | [MasterClass — tabs](https://mobbin.com/sites/sections/624bb2a3-d649-47dd-9996-aaa8e3f5d8e2) | Tabs de texto con indicador inferior y contenido debajo |
| Subtabs segmentadas | [Sketch — Events](https://mobbin.com/sites/sections/8c0f223c-c7c6-407b-a93c-185a6f940927) | Control segmentado (pastillas) para el segundo nivel |
| Franja "de un vistazo" (confianza) | [monday.com — program at a glance](https://mobbin.com/sites/sections/9dd549b9-6095-4562-a91c-c3d568fc2524) | 4 columnas: icono, cifra y descripción |
| Galería en mosaico + "Ver todas las fotos" | [Zillow — Requesting a tour](https://mobbin.com/flows/dd16a70f-e8b8-4b47-94e4-d338d1f551b0) | 1 foto grande + 4 pequeñas, botón sobre la última y lightbox |
| Tour multipaso en modal | [Zillow — Requesting a tour](https://mobbin.com/flows/dd16a70f-e8b8-4b47-94e4-d338d1f551b0) · [Care.com — Booking a tour](https://mobbin.com/flows/34a00efc-4f12-47da-bd53-23828cc89e0c) | Selector de día en tarjetas con flechas, horario, paso de datos, confirmación con resumen y stepper 1-2-3 arriba |
| Formulario en línea dividido | [Calendly — Booking a meeting](https://mobbin.com/flows/867f492f-df9c-4b83-8add-1b5a21a55321) | Panel de contexto a la izquierda y formulario a la derecha; éxito con resumen y "añadir al calendario" |
| FAQ | [Relume](https://mobbin.com/sites/sections/46c35afd-06bf-41fc-bb0b-83cb1494e5ef) · [Lattice](https://mobbin.com/sites/sections/1c9412fe-a762-483c-9993-125a46164b6b) · [Kajabi](https://mobbin.com/sites/sections/93c2b4c3-51d7-485a-ad79-2909c292f801) | Acordeón con "+" y hairlines, cabecera lateral y tarjeta "¿Aún tienes dudas?" |
| Bottom sheet móvil | [DoorDash — sheet de reserva](https://mobbin.com/screens/d5b4113b-f156-4668-9eeb-fc93fae637b8) | Grabber, selección en chips y CTA fijo abajo |

**Podium define cómo se ve.** Los tokens se **extrajeron de su CSS publicado** (variables `--_color---*`, `--_typography---*`, `--_sizes---*` de su hoja Webflow), no de una inspección visual: colores, Instrument Sans 400/500, escala tipográfica, tracking `-0.04em`, radios de 4/8/16/24 px, hairlines al 20%, botón primario tinta→amarillo, acordeón con relleno amarillo en hover y easing `cubic-bezier(.645,.045,.355,1)`.

**Conflictos resueltos (regla 3 del brief):** Podium no tiene modales, sheets, tablas, steppers, estados de error/éxito, toasts ni FAB. Se construyeron con la estructura de Mobbin y los tokens de Podium. Hubo que **extender** el sistema con: error terracota `#a8432a`, éxito salvia `#3f6b4a`, sombras solo para capas flotantes (Podium es plano), estrella `#c99a1a` y verde WhatsApp oscurecido `#1f7a4d` (por contraste AA). Todo está documentado en `Design.md` §2.5 y §6.

## 3. Herramientas

| # | Situación | Decisión |
|---|---|---|
| 3.1 | El MCP de **Nodal** falló al iniciar la sesión (ECONNREFUSED). | Se reintentó como pediste. El servidor local ya respondía, pero sus herramientas no se habían cargado en la sesión, así que se usó **Nodal directamente por su endpoint MCP** con el token ya configurado. Todas las imágenes fotográficas se generaron con **Nano Banana 2 Lite** (`google/gemini-3.1-flash-lite-image`). |
| 3.2 | PNG con transparencia. | **GPT Image 2.6 Flare** (Nodal) para el juguete arcoíris de madera (canal alfa real), usado en el respiro B. |
| 3.3 | "Videos". | Un loop ambiental de 10 s del hero (**Gemini Omni 1.2 Flash**, con la foto del hero como referencia) en WebM/MP4 a 720p, ~660 KB, **sin audio**. Solo se carga en desktop, sin `prefers-reduced-motion` ni Save-Data, después de `load`. El LCP sigue siendo el póster (AVIF de 15–42 KB). Tiene botón de pausa (WCAG 2.2.2). |
| 3.4 | "Motion for React / client components" en un proyecto vanilla (`index.html`, `style.css` y `script.js` vacíos). | Se mantuvo **HTML/CSS/JS sin build ni framework**: es lo más rápido para el objetivo de Lighthouse y respeta el andamiaje existente. Se usa **Motion One** (build vanilla UMD de `motion@11.18.2`). El equivalente a "client components solo donde haga falta" es que **la página completa funciona sin JS de animación**: GSAP y Motion son mejora progresiva. |
| 3.5 | Librerías por CDN o locales. | **Auto-hospedadas** en `assets/vendor/` (GSAP 3.12.5, ScrollTrigger y Motion). Evitan conexiones a terceros, DNS y el riesgo de bloqueo. |

## 4. Dirección de arte

- **Género:** fotografía documental-editorial cálida (no stock). Lente de 35/50 mm a f/2–2.8, **a la altura del niño**, luz de ventana, grano y color tipo Kodak Portra 400.
- **Por qué:** el negocio vende **confianza y calidez** a padres. El tono crema/papel de Podium (`#fefbf6`) y el amarillo `#ffec88` se extienden a la fotografía (madera clara, lino, salvia, amarillo mantequilla), así la UI y la imagen parecen un solo sistema.
- **Variedad por sección:** establecimiento (hero), macro de manos (metodología 01), retrato contextual (02, 03), vida práctica (04), arquitectura de interiores (galería), atmósfera de golden hour (respiro A), producto aislado (respiro B), lifestyle de llegada (admisiones).
- **Reglas aplicadas:** sin texto ni logos en las imágenes, niños sin mirar a cámara, sin sonrisas exageradas y negative space a la izquierda en el hero para el titular. El prompt de estilo común garantiza la coherencia; los prompts por imagen se conservan en el historial de generación.

## 5. Ritmo y respiros

| Posición | Arquetipo | Por qué ahí |
|---|---|---|
| Entre **Programas** (UI densa: tabs, tablas, CTAs) y **Metodología** | **A — Atmosférico**: foto full-bleed 21:9 de golden hour con parallax y un solo pie de foto | Tras la sección más cargada de UI, la página "exhala" con pura emoción antes de la explicación pedagógica |
| Entre **Instalaciones** (galería/protocolos) y **Testimonios** | **B — Manifiesto tipográfico**: frase a 96 px sobre papel amarillo, palabras que se encienden con el scroll y el juguete en PNG como acento | Hace de puente entre "lo que tenemos" y "lo que dicen las familias" con una declaración de valores |

No van juntos (entre ambos hay dos secciones) y son de formatos distintos (imagen frente a tipografía). Se descartó el arquetipo C (métricas) porque ya existe la franja de confianza y no hay más métricas verificadas.

## 6. Funcionalidad

| Requisito | Implementación | Decisión clave |
|---|---|---|
| **FR-01** Formulario de leads | Dos puntos de entrada: **tour multipaso** (modal/sheet) y **formulario en línea** con intención (visita / folleto / información). Campos del brief más programa y mensaje opcional; honeypot antispam; UTM capturados. | **No hay backend en el alcance.** `submitLead()` hace `POST` JSON a `CONFIG.leadEndpoint` si existe; si no, el **modo demo** guarda en `localStorage` (`casaAlba.leads`). La notificación por correo y el guardado en CRM son trabajo del endpoint (p. ej. una función serverless que reenvíe al CRM y envíe el correo con Resend o SendGrid). Se documenta en vez de simularlo. |
| **FR-02** WhatsApp | FAB con popover y **mensaje editable** prellenado → `wa.me/<número>?text=`. Hay enlaces contextuales en FAQ, éxito y footer, cada uno con su propio mensaje. | Un popover intermedio, en vez de un salto directo, deja ver el mensaje antes de salir del sitio. |
| **FR-03** Selector de programas | Tabs ARIA (flechas, Home/End) con 3 subtabs por nivel (Objetivos · Un día típico · Detalles) y un drawer de detalle completo que **clona** la tabla de rutina del DOM (sin duplicar contenido). | Todo el contenido está en el HTML para SEO; el drawer usa `<template>` inertes. |
| **FR-04** Galería adaptativa | Desktop: **mosaico**. Móvil: **carrusel táctil** con scroll-snap y contador. Lightbox con teclado y swipe (8 fotos). | El scroll-snap es nativo (0 KB de JS y gestos del sistema). |
| **FR-05** Mapa | **Facade** que solo inserta el `<iframe>` de Google Maps al pulsar, y enlace "Cómo llegar" siempre visible. | Un iframe de Maps añade ~500 KB y cookies de terceros; cargarlo bajo demanda protege el rendimiento y la privacidad (lo explica el aviso de cookies). |
| **NFR-04** Consentimiento | Checkbox obligatorio en los tres formularios, con enlace al aviso de privacidad, que menciona expresamente los **datos de menores**. | Del menor solo se pide la **edad** (minimización de datos). |
| Añadir al calendario | `.ics` generado en el cliente (zona `America/Mexico_City`, 45 min). | Sin servicios externos. |

## 7. App shell móvil (≤ 767 px)

- **Solo hay scroll interno:** `html` y `body` tienen `overflow: hidden` y solo `#main` desplaza. Así se evita el rebote del body y las barras quedan fijas como en una app nativa.
- La tab bar tiene 5 destinos con la **Visita como acción central** (acento). Metodología e Instalaciones activan "Programas" y Testimonios activa "FAQ", para no sobrecargar la barra.
- Todas las overlays (`<dialog>` nativo) se convierten en **bottom sheets** con grabber y arrastre para cerrar (>120 px o velocidad >0.5 px/ms).
- GSAP usa `#main` como `scroller` en móvil y `window` en desktop, vía `gsap.matchMedia()`, que revierte y recrea al cambiar de breakpoint.

## 8. Rendimiento

| Decisión | Por qué |
|---|---|
| HTML estático, CSS sin framework y JS propio de ~50 KB sin minificar, cargado con `defer` | FCP sin bloqueo de JS |
| Hero AVIF precargado (`fetchpriority="high"`, `imagesrcset`) + fuente variable auto-hospedada de 30 KB precargada con fallback métrico | LCP; sin FOIT y CLS de fuente mínimo |
| 23 `<picture>` AVIF/WebP con `srcset`, `width`/`height` y `loading="lazy"` (todas salvo el hero) | CLS = 0 y bytes justos |
| **La capa de animación se carga en la primera interacción** (scroll, toque, puntero o teclado) | La configuración de ScrollTrigger costaba ~270 ms de long task en móvil simulado. Antes de interactuar no hay nada que animar, y los elementos ya son visibles sin JS |
| Las chips de días del tour se generan al abrir (Intl cacheado) | Eliminó trabajo innecesario en la carga |
| Vídeo, mapa y lightbox bajo demanda | No compiten con la carga crítica |
| `scripts/optimize-images.mjs` (sharp) | Pipeline reproducible: `npm run images` |

**Resultado medido** (Lighthouse 12.2.1, `serve` local con gzip):

| Perfil | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Mobile (Moto G Power, 4G lento) | **97–98** | **100** | **100** | **100** | 1.5 s | 1.9 s | 0 | 130–170 ms |
| Desktop | **100** | **100** | **100** | **100** | 0.4 s | 0.5 s | 0 | 10 ms |

Pendiente en producción (fuera del código): cabeceras `Cache-Control` largas para `assets/` (Lighthouse "uses-long-cache-ttl") y compresión Brotli. Ambas son configuración del hosting (Vercel o Netlify las aplican por defecto a estáticos con hash).

## 9. Accesibilidad

- `<dialog>` nativo con `showModal()` (fondo inerte, Esc y foco devuelto al disparador), tabs ARIA completas, acordeón con `aria-expanded`/`region`, `aria-current` en navegación, skip link y `:focus-visible` en todo.
- Errores de formulario: mensaje por campo con `aria-describedby`, resumen con `role="alert"` y foco al primer error.
- **Metodología:** la primera versión atenuaba los pasos inactivos con `opacity` y fallaba el contraste. Ahora los pasos inactivos conservan el texto a contraste completo y solo cambian el titular a gris AA y el icono a neutro.
- El manifiesto se divide en palabras para la animación, y la frase completa queda disponible para lectores de pantalla en un `span` visualmente oculto.
- `prefers-reduced-motion`: sin vídeo, sin GSAP ni Motion y transiciones a 0.01 ms.

## 10. Verificación realizada

- 38 comprobaciones automáticas de flujos (Puppeteer + Chrome) que pasaron: tabs y subtabs, drawer → tour encadenado con programa preseleccionado, validación de los 3 pasos, lead guardado, Esc, folleto + PDF (200, `application/pdf`), filtros y acordeón de FAQ, formulario en línea (errores, foco y éxito), lightbox con teclado, protocolos, modal legal, enlace de WhatsApp, carga del mapa, historias, metodología activa por scroll, sheet móvil anclado y a ancho completo, tab bar que desplaza el contenedor interno con tab activa sincronizada, y **sin scroll horizontal a 390 y 320 px**.
- 0 errores de consola en desktop y móvil.
