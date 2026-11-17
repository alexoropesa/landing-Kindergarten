# Design.md — Casa Alba Kindergarten

> **Fuente única de verdad del sistema visual.** Antes de crear o modificar cualquier página o sección, consulta este documento.
> Los tokens viven en `style.css` (bloque `:root`, sección `01 · TOKENS`). Si introduces un token, componente o variante nueva, **actualiza este archivo en el mismo cambio**.

**Origen del sistema**

| Capa | Fuente | Qué se toma |
|---|---|---|
| Estructura, layout y flujos UX | Mobbin (referencias citadas en `DECISIONS.md`) | Jerarquía de contenedores, densidad, grid, navegación, patrones de formulario, modales/drawers/bottom sheets |
| Estética (design tokens) | `podiumautomation.com` (CSS extraído de su hoja Webflow) | Colores, tipografía, escala, radios, bordes, sombras (ninguna), botones, inputs, easing |
| Extensiones propias | Este documento | Estados de error/éxito, sombras de overlays, tokens de app shell móvil — derivados para armonizar con Podium (regla de conflictos) |

---

## 1. Design Principles

1. **Papel cálido, tinta oscura, un solo acento.** Lienzo crema `#fefbf6`, texto `#252324`, acento amarillo `#ffec88`. El amarillo es *estado* (hover, selección, foco de marca), nunca decoración masiva. Excepción documentada: la sección de respiro "Manifiesto" usa `--color-paper-yellow` como fondo.
2. **Planitud editorial.** Superficies separadas por *hairlines* (1px al 20% de tinta) y cambios de tono, **no por sombras**. Las sombras solo existen en capas flotantes (modales, drawers, sheets, popovers).
3. **Tipografía que respira.** Una sola familia (Instrument Sans). Titulares a peso 400 con tracking negativo `-0.04em`; la jerarquía la dan el tamaño y el espacio, no el peso.
4. **Radios pequeños y consistentes.** 4px en controles, 8px en tarjetas/medios pequeños, 16px en medios grandes, 24px en contenedores hero y overlays.
5. **La fotografía es la protagonista.** La UI es neutra para que la dirección de arte (documental cálida, Portra 400) cargue la emoción.
6. **Movimiento con propósito.** Entradas sutiles (≤ 32px, ≤ 0.8s), easing Podium. Nada se anima si `prefers-reduced-motion: reduce`.
7. **Accesible por defecto.** Texto ≥ 16px en cuerpo, contraste WCAG AA verificado (tabla §2.6), objetivos táctiles ≥ 44×44px.

---

## 2. Color Tokens

### 2.1 Primitivos (extraídos de Podium)

| Token | Valor | Origen Podium |
|---|---|---|
| `--c-cream` | `#fefbf6` | `--_color---primary--white` |
| `--c-ink` | `#252324` | `--_color---primary--dark-grey` |
| `--c-black` | `#1a1a1a` | `--_color---primary--black` |
| `--c-yellow` | `#ffec88` | `--_color---primary--primary-yellow` |
| `--c-paper-yellow` | `#fffce0` | `--_color---primary--paper-yellow` |
| `--c-grey-750` | `#413e40` | greyscale 750 |
| `--c-grey-700` | `#535353` | greyscale 700 |
| `--c-grey-650` | `#625d60` | greyscale 650 |
| `--c-grey-550` | `#7a7772` | greyscale 550 |
| `--c-grey-450` | `#929191` | greyscale 450 |
| `--c-grey-350` | `#cecbbf` | greyscale 350 |
| `--c-grey-250` | `#dcd5cd` | greyscale 250 |
| `--c-grey-150` | `#ede8e4` | greyscale 150 |
| `--c-grey-100` | `#f6f3ee` | greyscale 100 |

### 2.2 Semánticos — fondos y superficies

| Token | Valor | Uso |
|---|---|---|
| `--color-canvas` | `--c-cream` | Fondo de página |
| `--color-surface` | `--c-grey-100` | Tarjetas, paneles, inputs en reposo sobre canvas |
| `--color-surface-2` | `--c-grey-150` | Hover de superficies, skeletons, placeholders de imagen |
| `--color-surface-accent` | `--c-paper-yellow` | Sección Manifiesto, chips informativos, fondo de éxito suave |
| `--color-surface-inverse` | `--c-ink` | Footer, lightbox, tab activa en móvil |
| `--color-overlay` | `rgb(26 26 26 / .48)` | Scrim de modales/drawers/sheets |

### 2.3 Bordes (hairlines)

| Token | Valor | Uso |
|---|---|---|
| `--color-line` | `color-mix(in hsl, #252324 20%, transparent)` | Bordes de inputs, separadores, acordeones, tarjetas |
| `--color-line-soft` | `color-mix(in hsl, #252324 10%, transparent)` | Separadores internos de tablas |
| `--color-line-faint` | `color-mix(in hsl, #252324 5%, transparent)` | Rayado de filas, fondos de iconos |
| `--color-line-inverse` | `color-mix(in hsl, #fefbf6 20%, transparent)` | Hairlines sobre fondo oscuro |
| `--color-line-strong` | `--c-ink` | Borde en hover/focus de inputs y botones terciarios |

### 2.4 Texto

| Token | Valor | Uso |
|---|---|---|
| `--color-text` | `--c-ink` | Texto principal y titulares |
| `--color-text-muted` | `--c-grey-650` | Párrafos secundarios, metadatos |
| `--color-text-subtle` | `--c-grey-550` | **Solo ≥ 18px o iconos** (contraste 4.4:1) |
| `--color-text-disabled` | `--c-grey-450` | Controles deshabilitados (exentos de AA) |
| `--color-text-inverse` | `--c-cream` | Texto sobre tinta/foto |
| `--color-text-inverse-muted` | `rgb(254 251 246 / .72)` | Texto secundario sobre tinta |

### 2.5 Acento y estados (extensión armonizada)

| Token | Valor | Uso |
|---|---|---|
| `--color-accent` | `--c-yellow` | Hover de botón primario, selección (chips/radio activos), subrayado de tab activa, highlight de texto |
| `--color-accent-ink` | `--c-ink` | Texto sobre acento |
| `--color-success` | `#3f6b4a` | Iconos/texto de éxito (salvia, armoniza con fotografía) |
| `--color-success-bg` | `#edf3ea` | Fondo de mensajes de éxito |
| `--color-error` | `#a8432a` | Texto/borde de error (terracota) |
| `--color-error-bg` | `#fbeee8` | Fondo de mensajes de error |
| `--color-focus` | `--c-ink` | Anillo de foco (2px + offset 2px) |
| `--color-star` | `#c99a1a` | Estrellas de calificación (amarillo oscurecido para contraste 3:1 sobre canvas) |
| `--color-whatsapp` | `#1f7a4d` | Solo el botón de WhatsApp (verde oscurecido para AA con texto crema) |

### 2.6 Contraste verificado (WCAG 2.1)

| Par | Ratio | Nivel |
|---|---|---|
| `#252324` sobre `#fefbf6` | 15.4:1 | AAA |
| `#625d60` sobre `#fefbf6` | 6.3:1 | AA |
| `#625d60` sobre `#f6f3ee` | 5.9:1 | AA |
| `#252324` sobre `#ffec88` | 13.6:1 | AAA |
| `#fefbf6` sobre `#252324` | 15.4:1 | AAA |
| `#a8432a` sobre `#fefbf6` | 5.8:1 | AA |
| `#3f6b4a` sobre `#fefbf6` | 5.9:1 | AA |
| `#fefbf6` sobre `#1f7a4d` | 5.3:1 | AA |
| Texto crema sobre foto | Garantizado con scrim `--gradient-photo` (≥ 60% tinta bajo el texto) | AA |

---

## 3. Typography

**Familia:** `--font-sans: "Instrument Sans", "Helvetica Neue", Arial, sans-serif` — variable, auto-hospedada (`assets/fonts/instrument-sans-latin-var.woff2`, 30 KB, `font-display: swap`, precargada). Fallback con `size-adjust` para minimizar CLS.

**Pesos:** `--fw-regular: 400` · `--fw-medium: 500` · `--fw-semibold: 600` (solo números de estadísticas y badges).

**Tracking:** `--ls-super-tight: -0.04em` (titulares) · `--ls-extra-tight: -0.03em` · `--ls-tighter: -0.02em` (subtítulos) · `--ls-tight: -0.01em` (botones/labels/texto grande) · `--ls-normal: 0` · `--ls-loose: 0.02em` (eyebrows en mayúsculas: `0.08em`, ver abajo).

**Line-height:** `--lh-1-0: 1` · `--lh-1-1: 1.1` · `--lh-1-2: 1.2` · `--lh-1-3: 1.3` · `--lh-1-5: 1.5`.

### Escala (desktop Podium → fluida con `clamp()` de 320px a 1440px)

| Token | Desktop | Mobile (≤479) | Peso | LH | Tracking | Uso |
|---|---|---|---|---|---|---|
| `--fs-display` | 96px (6rem) | 44px | 400 | 1.0 | -0.04em | Manifiesto (respiro B) |
| `--fs-h1` | 68px (4.25rem) | 40px | 400 | 1.1 | -0.04em | H1 del hero |
| `--fs-h2` | 56px (3.5rem) | 34px | 400 | 1.1 | -0.04em | Títulos de sección |
| `--fs-h3` | 40px (2.5rem) | 28px | 400 | 1.1 | -0.04em | Título de panel/tab, cifras |
| `--fs-h4` | 32px (2rem) | 24px | 500 | 1.2 | -0.02em | Subtitle-1 Podium: títulos de tarjeta grande, modales |
| `--fs-h5` | 24px (1.5rem) | 20px | 500 | 1.2 | -0.02em | Subtitle-2: títulos de tarjeta |
| `--fs-h6` | 20px (1.25rem) | 18px | 500 | 1.2 | -0.02em | Subtitle-3: preguntas FAQ, títulos de pasos |
| `--fs-quote` | 32px | 22px | 500 | 1.3 | -0.01em | Citas de testimonios destacados |
| `--fs-lg` | 20px | 18px | 400 | 1.5 | -0.01em | Lead / subtítulo de hero |
| `--fs-md` | 18px | 17px | 400 | 1.5 | -0.01em | Párrafos de sección |
| `--fs-base` | 16px | 16px | 400 | 1.5 | 0 | **Cuerpo mínimo (NFR-03)** |
| `--fs-sm` | 14px | 14px | 400/500 | 1.5 | 0 | Labels, metadatos, ayudas |
| `--fs-xs` | 12px | 12px | 500 | 1.2 | 0.08em upper | Eyebrows, badges (nunca párrafos) |
| `--fs-button` | 18px | 16px | 500 | 1.0 | -0.01em | Botón primario (button-1) |
| `--fs-button-sm` | 14px | 14px | 500 | 1.0 | -0.01em | Botón terciario/icono (button-3) |

**Reglas**
- Un solo `<h1>` por página. Secciones con `<h2>`; tarjetas `<h3>`.
- Eyebrow (`.eyebrow`): `--fs-xs`, mayúsculas, `0.08em`, `--color-text-muted`, con viñeta de 6px `--color-accent` + borde tinta.
- `text-wrap: balance` en titulares, `text-wrap: pretty` en párrafos. Ancho de lectura máx. `--measure: 62ch`.
- Números de estadísticas: `font-variant-numeric: tabular-nums`, `--fs-h3` a peso 400 (como los titulares Podium). `--fw-semibold` queda reservado a badges.

---

## 4. Spacing System

Base 4px. Tokens `--space-*`:

| Token | px | Uso típico |
|---|---|---|
| `--space-1` | 4 | Gap icono-texto mínimo |
| `--space-2` | 8 | Gap de chips, padding de badges |
| `--space-3` | 12 | Padding horizontal botón terciario, gap de labels |
| `--space-4` | 16 | Padding de inputs, gap de formulario, gutter móvil |
| `--space-5` | 20 | Padding de acordeón (Podium 1.25rem) |
| `--space-6` | 24 | Padding de tarjeta, gap de grid |
| `--space-8` | 32 | Padding de modal/form (Podium intake 2rem), gap de columnas |
| `--space-10` | 40 | **Gutter global desktop (Podium global-padding 2.5rem)** |
| `--space-12` | 48 | Separación título-contenido de sección |
| `--space-16` | 64 | Gap entre bloques grandes |
| `--space-20` | 80 | Padding sección xsmall / tablet |
| `--space-24` | 96 | Padding sección small |
| `--space-30` | 120 | Padding sección medium (desktop, por defecto) |
| `--space-40` | 160 | Padding sección large (respiros) |

**Ritmo vertical de secciones:** `--section-pad: clamp(64px, 9vw, 120px)`; respiros `--section-pad-lg: clamp(80px, 12vw, 160px)`.
**Gutter:** `--gutter: clamp(16px, 4vw, 40px)` (16px en 320px — requisito; 40px desde 1000px).

---

## 5. Layout Rules

- **Contenedor:** `.container { max-width: var(--container-max) /* 1440px */; padding-inline: var(--gutter); margin-inline: auto; }` → ancho de contenido máximo 1360px (= `--container--large` de Podium, 85rem).
- **Full-bleed:** las secciones pueden tener fondo/imagen a 100vw (`.section--bleed`, respiro A, footer); su contenido interno vuelve a `.container`.
- **Contenedores estrechos:** `--container-md: 900px` (FAQ cabecera, manifiesto), `--container-sm: 768px` (textos legales).
- **Grid:** 12 columnas, `gap: var(--space-6)` (24px) desktop, 16px móvil. Patrones: split 5/7 (admisiones), 6/6 (programas), 4×3 tarjetas, mosaico 2fr/1fr/1fr (galería).
- **Breakpoints (Podium):**
  | Nombre | Rango | Notas |
  |---|---|---|
  | `mobile-s` | ≤ 479px | 1 columna, tipografía mínima |
  | `mobile` | ≤ 767px | **App shell nativo** (ver §9) |
  | `tablet` | 768–991px | Topbar compacta, grids 2 col |
  | `desktop` | ≥ 992px | Topbar completa, grids completos |
  | `wide` | ≥ 1440px | Contenido fijo a 1440, fondos full-bleed |
- **Navegación:** desktop = topbar sticky 72px (logo · anclas · CTA "Agendar visita"). Tablet = topbar 64px con anclas reducidas + CTA. Mobile = header compacto 56px + tab bar inferior 64px (+ safe-area).
- **Anclas:** `scroll-margin-top: calc(var(--header-h) + 16px)` en cada sección.

---

## 6. Visual Effects

### Radios (Podium)
| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 4px | Botones, inputs, chips, badges, tabs segmentadas, nav links |
| `--radius-sm` | 8px | Tarjetas, miniaturas, popovers, tooltips |
| `--radius-md` | 16px | Imágenes de contenido, paneles de programa, tarjetas destacadas |
| `--radius-lg` | 24px | Hero inset, modales, drawers (lado interior), bottom sheets (esquinas superiores) |
| `--radius-pill` | 999px | Avatares, indicador de paso, FAB WhatsApp, grabber de sheet |

### Sombras (extensión — Podium es plano)
| Token | Valor | Uso |
|---|---|---|
| `--shadow-none` | `none` | Todo componente en el flujo |
| `--shadow-hairline` | `0 0 0 1px var(--color-line)` | Alternativa a borde sin afectar layout |
| `--shadow-pop` | `0 1px 2px rgb(37 35 36 / .06), 0 8px 24px rgb(37 35 36 / .10)` | Popover WhatsApp, menú, toast |
| `--shadow-overlay` | `0 24px 64px rgb(26 26 26 / .22)` | Modales, drawers, sheets |

### Outlines y foco
- `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }` en todos los interactivos.
- Sobre fondo oscuro/foto: `outline-color: var(--c-cream)`.

### Elevación (z-index)
`--z-base: 0` · `--z-sticky: 50` (header) · `--z-tabbar: 60` · `--z-fab: 70` · `--z-overlay: 100` (dialog usa top layer) · `--z-toast: 200`.

### Fotografía
- `--gradient-photo: linear-gradient(180deg, rgb(26 26 26 / 0) 35%, rgb(26 26 26 / .62) 100%)` bajo texto sobre imagen.
- Placeholder: `background: var(--color-surface-2)` + `aspect-ratio` fijo → **CLS = 0**.

---

## 7. Component Guidelines

### Botones (`.btn`)
| Variante | Altura | Padding X | Fondo | Texto | Borde | Hover |
|---|---|---|---|---|---|---|
| `.btn--primary` | 48px | 24px | `--c-ink` | `--c-cream` | none | fondo `--color-accent`, texto tinta (barrido de abajo arriba 300ms) |
| `.btn--accent` | 48px | 24px | `--color-accent` | tinta | none | fondo tinta, texto crema (CTA sobre foto) |
| `.btn--secondary` | 48px | 24px | transparent | tinta | 1px `--color-line` | borde tinta |
| `.btn--tertiary` | 40px | 12px | transparent | tinta | 1px `--color-line` | fondo tinta, texto crema |
| `.btn--ghost-inverse` | 48px | 24px | transparent | crema | 1px `--color-line-inverse` | fondo crema, texto tinta |
| `.btn--link` | auto | 0 | — | tinta | subrayado 1px | opacidad .6 |
| `.btn--icon` | 40×40 (44 en móvil) | 0 | transparent | tinta | 1px `--color-line` | borde+fondo `--color-accent` |

Todos: `--radius-xs`, `--fs-button`, `--fw-medium`, `--ls-tight`, icono 20px con gap 8px. Press: escala 0.97 (Motion). Tamaño `--sm`: 40px alto, `--fs-button-sm`. `--block`: ancho 100%.

### Inputs (`.field`)
- Label arriba (`--fs-sm`, `--fw-medium`, tinta), requerido con `*` en `--color-text-muted`.
- Control: alto 48px, padding 0 16px, fondo `--color-canvas`, borde 1px `--color-line`, `--radius-xs`, texto `--fs-base` (16px evita zoom iOS).
- Hover: borde `--c-grey-550`. Focus: borde tinta + `box-shadow: 0 0 0 3px var(--color-accent)`.
- Error: borde `--color-error`, mensaje `--fs-sm` en `--color-error` con icono, `aria-invalid="true"` + `aria-describedby`.
- Ayuda: `--fs-sm` `--color-text-muted`.
- Checkbox: 20×20, borde 1px tinta 20%, `--radius-xs`; marcado = fondo tinta + check crema. Objetivo táctil del label ≥ 44px.
- Chips de selección (`.choice`): alto 44px, borde `--color-line`, `--radius-xs`; hover borde `--color-accent`; seleccionado fondo `--color-accent` + borde accent (= `button-radio` Podium).
- Segmented control (`.segmented`): grupo de `.choice` con `role="radiogroup"`.

### Tarjetas (`.card`)
Fondo `--color-surface`, sin borde ni sombra, `--radius-sm` (pequeñas) o `--radius-md` (con imagen), padding `--space-6`. Hover (si clicable): fondo `--color-surface-2` + imagen escala 1.04 (Motion).

### Tabs (`.tabs`)
- **Primarias (programas):** texto `--fs-h6` 500, color `--color-text-muted` → activo tinta; indicador inferior 2px tinta que se desliza (Motion); hairline inferior `--color-line`. Patrón MasterClass.
- **Subtabs (`.tabs--segmented`):** pastillas 40px `--radius-xs`, activo fondo `--color-accent`. Patrón Sketch Events.
- ARIA: `role="tablist"`/`tab`/`tabpanel`, flechas ←/→, Home/End.

### Acordeón (`.accordion`) — Podium
Ítem con `border-bottom: 1px solid var(--color-line)`; botón 100%, padding 20px 0, texto `--fs-h6`; icono "+" 24px que rota 45°; hover: fondo `--color-accent` se revela detrás (barrido). Contenido `--fs-md`, máx 670px, padding-bottom 24px.

### Tablas (`.table`)
Cabecera `--fs-xs` eyebrow, filas 48px mínimo, separadores `--color-line-soft`, columna hora `tabular-nums` 500. En móvil la tabla se convierte en lista (`display: grid` por fila).

### Modales (`dialog.overlay--modal`)
Ancho 560px (form) / 720px (contenido), `--radius-lg`, fondo canvas, `--shadow-overlay`, scrim `--color-overlay`. Header 64px con título `--fs-h6` y botón icono cerrar; cuerpo con scroll interno; footer sticky con acciones (patrón Zillow/Care.com). Indicador de pasos arriba.

### Drawers (`dialog.overlay--drawer`)
Desde la derecha, ancho `min(560px, 100vw)`, alto 100dvh, radio interno `--radius-lg` en esquinas izquierdas.

### Bottom sheets (≤767px, todas las overlays)
Pegado abajo, ancho 100%, `max-height: 92dvh`, radios superiores `--radius-lg`, grabber 36×4px `--c-grey-350`, arrastrar hacia abajo > 120px o velocidad > 0.5 cierra. Footer de acciones sticky con `padding-bottom: env(safe-area-inset-bottom)`.

### Lightbox (`dialog.overlay--lightbox`)
Fondo `--c-black`, imagen `contain`, contador `1 / 6`, botones icono inversos, teclado ←/→/Esc, swipe por scroll-snap.

### Badges (`.badge`)
Alto 24px, padding 0 8px, `--fs-xs` 500 upper, `--radius-xs`. Variantes: neutro (`--color-surface-2`), acento (`--color-accent`), éxito, inverso.

### Stepper (`.stepper`)
Círculos 24px `--radius-pill` con número `--fs-xs`; activo tinta/crema; completado acento con check; conectores 1px `--color-line`.

### FAB WhatsApp (`.wa-fab`)
56×56 `--radius-pill`, `--color-whatsapp`, icono crema 28px, `--shadow-pop`. Popover 320px `--radius-sm` con mensaje prellenado y CTA. En móvil se sitúa sobre la tab bar (`bottom: calc(var(--tabbar-h) + 16px)`).

### Toast (`.toast`)
Inverso (tinta/crema), `--radius-sm`, `--shadow-pop`, 4s, `role="status"`.

### Estrellas (`.stars`)
5 × 16px, color `--color-star`, `aria-label="5 de 5 estrellas"`.

### Mapa (facade)
Panel `--color-surface` con patrón de calles SVG y pin; botón "Cargar mapa interactivo" inserta el `<iframe>` de Google Maps (`loading="lazy"`). Siempre visible el enlace "Cómo llegar".

---

## 8. Interaction States

| Estado | Regla |
|---|---|
| Hover | Solo en `@media (hover: hover)`. Duración `--dur-fast: 200ms` (color/borde), `--dur-base: 300ms` (barridos), easing `--ease-podium: cubic-bezier(.645,.045,.355,1)` |
| Focus | `:focus-visible` anillo 2px tinta offset 2px; inputs: borde tinta + halo 3px acento |
| Active/press | `transform: scale(.97)` 120ms (Motion, solo botones/chips/tarjetas clicables) |
| Disabled | Fondo `--color-surface-2`, texto `--color-text-disabled`, `cursor: not-allowed`, sin hover; `aria-disabled` |
| Loading | Botón mantiene ancho, texto → "Enviando…" + spinner 16px (borde 2px currentColor), `aria-busy="true"` |
| Selected | Fondo `--color-accent` + texto tinta (chips, subtabs, días del calendario); tab primaria: indicador 2px |
| Error | Borde `--color-error`, mensaje bajo el campo, resumen con `role="alert"` en el primer error al enviar, foco al primer campo inválido |
| Success | Panel `--color-success-bg`, icono check `--color-success` 40px, título `--fs-h4`, resumen de la solicitud, acciones siguientes |
| Empty | (Galería sin cargar) placeholder `--color-surface-2` con aspect-ratio fijo |

**Motion tokens:** `--dur-fast: 200ms` · `--dur-base: 300ms` · `--dur-slow: 600ms` · `--dur-reveal: 800ms` · `--ease-podium` · `--ease-out: cubic-bezier(.22,1,.36,1)` (entradas). Distancia de reveal máx. 32px. Stagger 0.08s.

**Reparto de librerías (nunca sobre la misma propiedad del mismo elemento):**
- **GSAP + ScrollTrigger:** reveals de secciones (`[data-reveal]`), stagger de grupos (`[data-stagger]`), parallax del hero (`.hero__img`, `.hero__video`) y del respiro A (`.breath-a__media`), palabras del manifiesto (`.manifesto__word`) y objeto (`.breath-b__object`), metodología fijada (opacidad de `.method__frame picture`), contador de cifras (`[data-count]`).
- **Motion:** microinteracciones (press/hover de `.btn`, `.choice`, imagen interna de `.card`), indicador de tabs, transición de paneles, apertura/cierre de overlays y sheets (+ drag), acordeón (altura), pasos del formulario, popover WhatsApp, toasts.

---

## 9. Responsive Rules

### Desktop (≥ 992px)
Topbar sticky 72px, contenido 1360px máx., grids completos, mosaico de galería, metodología con columna de imagen fijada (pin), FAQ a dos columnas, overlays como modal/drawer, vídeo ambiental en hero.

### Tablet (768–991px)
Topbar 64px con CTA; anclas visibles desde 900px (si no, solo CTA + menú en "Más"); grids a 2 columnas; metodología apilada sin pin; galería en mosaico 2 columnas; overlays modal/drawer.

### Mobile (≤ 767px) — **App shell nativo**
- `html, body { height: 100%; overflow: hidden }`; `.app` es grid `56px / 1fr / 64px`; **solo `#main` hace scroll** (`overflow-y: auto; overscroll-behavior: contain`).
- Header compacto 56px: logo + botón icono "Folleto".
- Tab bar inferior 64px + `env(safe-area-inset-bottom)`: Inicio · Programas · **Visita** (central, acento) · FAQ · Contacto. Iconos 24px + label `--fs-xs` (11–12px, sin mayúsculas). Activa sincronizada con la sección visible.
- Todas las overlays = bottom sheets.
- Carrusel táctil con scroll-snap para galería y testimonios (FR-04), con contador.
- Tablas → listas; FAQ una columna; filtros en scroll horizontal.
- Sin vídeo (solo póster) para ahorrar datos.
- Objetivos táctiles ≥ 44px; inputs 16px.

### Mobile-S (≤ 479px)
Tipografía al mínimo de `clamp()`, CTAs del hero a ancho completo y apilados, 1 columna en todo.

---

## 10. Patrones añadidos durante la implementación

Variantes introducidas y justificadas. Úsalas antes de crear otras nuevas.

| Patrón | Regla |
|---|---|
| `.chip--glass` | Chip informativo sobre foto: fondo crema al 14%, borde `--color-line-inverse`, `backdrop-filter: blur(8px)`, punto de 8px `--color-accent` con halo de 4px. Puede envolver texto (`max-width: 100%`). |
| Paso activo (metodología) | **Nunca se atenúa texto con `opacity`** (rompe AA). Paso inactivo: titular `--color-text-muted` e icono sobre `--color-surface-2`. Paso activo: titular `--color-text` e icono sobre `--color-accent`. Transición `--dur-slow`. |
| Barra de progreso sobre medio | Segmentos de 3px `--radius-pill`, crema al 40%; activos en crema sólida. |
| Medio en drawer | La imagen lleva `aspect-ratio: 16/10` y `--radius-md` **sobre el `<img>`**, no sobre un contenedor con `overflow: hidden` (evita colapsos de altura en contenedores flex/grid con scroll). |
| Selector de días (`.day`) | Tarjeta de 72px de alto mínimo: día de la semana en eyebrow y fecha en `--fs-base` 500. Seleccionado = `--color-accent`. 4 visibles en desktop y 3 en móvil, con scroll-snap. |
| Resumen (`.summary`) | Lista `dt`/`dd` con hairlines `--color-line-soft`; valor alineado a la derecha en 500. |
| Respiro A | Full-bleed, alto `clamp(360px, 42vw, 680px)`, medio con sangrado vertical de -12% para el parallax, pie de foto `--fs-sm` sobre vidrio oscuro. |
| Respiro B | Fondo `--color-surface-accent`, padding `--section-pad-lg`, texto `--fs-display` con ancho máx. `17ch`, objeto PNG recortado (≤ 320px) como único acento. |
| Carruseles móviles | `margin-inline: calc(var(--gutter) * -1)` + `padding-inline: var(--gutter)` para sangrar al borde y mantener el gutter al inicio. Tarjetas al 84–86% del ancho para insinuar la siguiente. |
| Overlays | El panel es **flex en columna**: header y footer `flex: none`, cuerpo `flex: 1 1 auto` con scroll interno. El grabber se centra con `align-self`. En el paso de éxito se oculta el footer de acciones. |

### Carga de la capa de movimiento
El contenido nunca depende de la animación: todo es visible sin JS. GSAP + ScrollTrigger y Motion se cargan **en la primera interacción** (scroll, rueda, toque, puntero o teclado). Los reveals solo se aplican a elementos que siguen **por debajo del pliegue** en ese momento, así que no hay parpadeos.

### Registro de cambios
- **v1.0 (2026-11-17):** sistema inicial a partir de los tokens de Podium + extensiones (§2.5, §6).
- **v1.1 (2026-11-17):** patrones del §10; la metodología pasa de opacidad a color (accesibilidad); los overlays pasan de grid a flex.
