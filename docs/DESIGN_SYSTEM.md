# DESIGN_SYSTEM.md — Hogar Canitas Felices

> Sistema de diseño oficial del proyecto. Documenta la identidad visual y **todos los tokens ya implementados** en `css/styles.css` y archivos relacionados durante el Sprint 1, más los componentes aún no construidos (modales, dark mode) que deben respetar este mismo sistema cuando se implementen. Este documento es la fuente de verdad visual: si el código y este documento difieren, se corrige el que esté equivocado y se deja constancia de cuál era.

---

## 1. Identidad visual

Hogar Canitas Felices debe transmitir, en este orden de prioridad: **tranquilidad, confianza, profesionalismo, bienestar, calidez**. La dirección visual se inspira deliberadamente en clínicas privadas, hospitales premium y hoteles de bienestar — **no** en la estética institucional/fría típica de muchos sitios de geriátricos, ni en una estética infantil o "cute" que trivialice a los residentes.

Principios visuales aplicados:

- **Espacio generoso** sobre densidad de información — el usuario nunca debe sentir que está leyendo un formulario administrativo.
- **Fotografía como protagonista** (o, en su ausencia temporal, ilustración de marca consistente) — el texto acompaña a la imagen, no al revés.
- **Color usado con intención**: el azul cielo comunica calma; el verde queda reservado exclusivamente para acciones de WhatsApp (no se usa como color decorativo en otros contextos, para no diluir su significado de "acción de contacto directo").
- **Tipografía con carácter pero legible**: un serif cálido para titulares (Fraunces) transmite calidez humana sin perder seriedad; un sans-serif geométrico (Plus Jakarta Sans) garantiza legibilidad en cuerpos de texto largos, importante considerando que parte de la audiencia son personas mayores o de mediana edad con distintas capacidades visuales.

---

## 2. Paleta de colores

### 2.1 Paleta principal

| Token | Valor | Uso |
|---|---|---|
| `--color-sky` | `#4FA8DE` | Color de marca — CTAs primarios, acentos, bordes activos |
| `--color-sky-light` | `#E8F4FC` | Fondos suaves (íconos de tarjetas, chips) |
| `--color-sky-dark` | `#2E7DB8` | Hover de elementos azules, textos de énfasis sobre fondo claro |
| `--color-white` | `#FFFFFF` | Fondo base, texto sobre fondos oscuros |

### 2.2 Colores de apoyo

| Token | Valor | Uso |
|---|---|---|
| `--color-navy` | `#1B3A57` | Texto principal, navbar sólida, footer, títulos |
| `--color-navy-soft` | `#3D5A76` | Texto secundario / descripciones |
| `--color-gray-light` | `#F4F7FA` | Fondos alternos de sección (ritmo visual al hacer scroll) |
| `--color-gray-border` | `#DDE6ED` | Bordes y divisores sutiles |
| `--color-whatsapp` | `#25D366` | **Exclusivo** para acciones de WhatsApp |
| `--color-whatsapp-dark` | `#1EBA59` | Hover de elementos de WhatsApp |
| `--color-star` | `#F5B942` | Calificaciones (estrellas), acentos cálidos puntuales |

### 2.3 Regla de uso del color

> El verde (`--color-whatsapp`) **nunca** se usa como color decorativo o de estado genérico (ej. no se usa para "éxito" en formularios que no sean de WhatsApp) — está reservado semánticamente para no competir con su significado de "contactar por WhatsApp". El estado de éxito del formulario de contacto reutiliza este verde intencionalmente porque conceptualmente comunica lo mismo: "tu mensaje fue recibido, canal de comunicación exitoso".

### 2.4 Contraste y accesibilidad de color

| Combinación | Ratio aproximado | Cumple WCAG AA (texto normal) |
|---|---|---|
| `--color-navy` sobre `--color-white` | ~11.8:1 | ✅ Sí (AAA) |
| `--color-navy-soft` sobre `--color-white` | ~6.5:1 | ✅ Sí |
| `--color-white` sobre `--color-sky` | ~2.3:1 | ⚠️ Solo para texto grande/bold (≥18pt) o iconografía, no para párrafos |
| `--color-white` sobre `--color-navy` | ~11.8:1 | ✅ Sí (AAA) |
| `--color-white` sobre `--color-whatsapp` | ~2.1:1 | ⚠️ Solo para iconografía/texto bold corto (botones), no párrafos |

> Regla derivada: **nunca** colocar párrafos de texto extenso en blanco sobre `--color-sky` o `--color-whatsapp` directamente — estos colores se usan para botones (texto corto, bold) o como fondo de iconografía, no como fondo de bloques de lectura.

---

## 3. Variables CSS (tokens completos)

Todas las variables viven en `:root`, definidas en `css/styles.css`, y se consumen en el resto de archivos — **ningún archivo CSS debe declarar un color, tamaño de fuente o espaciado "a mano"** fuera de estas variables.

```
/* Color */
--color-sky, --color-sky-light, --color-sky-dark, --color-white
--color-navy, --color-navy-soft, --color-gray-light, --color-gray-border
--color-whatsapp, --color-whatsapp-dark, --color-star

/* Tipografía */
--font-display, --font-body
--fs-xs, --fs-sm, --fs-base, --fs-md, --fs-lg, --fs-xl, --fs-2xl, --fs-3xl, --fs-4xl

/* Espaciado */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl, --space-2xl

/* Layout */
--container-width, --container-padding, --navbar-height

/* Bordes y sombras */
--radius-sm, --radius-md, --radius-lg, --radius-full
--shadow-sm, --shadow-md, --shadow-lg

/* Transiciones */
--transition-fast, --transition-base, --transition-slow
```

---

## 4. Tipografía

### 4.1 Familias tipográficas

| Token | Fuente | Uso |
|---|---|---|
| `--font-display` | Fraunces (serif, Google Fonts) | Titulares (`h1`–`h6`), eyebrow de secciones |
| `--font-body` | Plus Jakarta Sans (sans-serif, Google Fonts) | Cuerpo de texto, botones, formularios, navegación |

**Justificación del par tipográfico**: Fraunces aporta la calidez "editorial" que distingue a Hogar Canitas Felices de la estética clínica genérica, sin perder seriedad (es un serif contemporáneo, no ornamental). Plus Jakarta Sans garantiza máxima legibilidad en pantalla para cuerpos de texto largos y UI, con buen soporte de pesos intermedios.

### 4.2 Escala tipográfica

| Token | Tamaño | Uso típico |
|---|---|---|
| `--fs-xs` | 13px | Texto legal, metadatos, labels pequeños |
| `--fs-sm` | 15px | Texto secundario, botones, navegación |
| `--fs-base` | 16px | Cuerpo de texto por defecto |
| `--fs-md` | 18px | Subtítulos, texto destacado |
| `--fs-lg` | 22px | Títulos de tarjeta (`h3`) |
| `--fs-xl` | 28px | Títulos de sede |
| `--fs-2xl` | 36px | Títulos de sección (mínimo del `clamp()`) |
| `--fs-3xl` | 48px | Títulos de sección (máximo del `clamp()`) / hero (mínimo) |
| `--fs-4xl` | 60px | Título del hero (máximo del `clamp()`) |

> Los títulos de sección y el título del hero usan `clamp()` para escalar fluidamente entre `--fs-2xl`/`--fs-3xl` y `--fs-3xl`/`--fs-4xl` según el viewport, en vez de saltos abruptos por breakpoint.

### 4.3 Jerarquía y peso

| Elemento | Fuente | Peso | Line-height |
|---|---|---|---|
| `h1`–`h6` | `--font-display` | 600 | 1.2 |
| Cuerpo de texto | `--font-body` | 400 | 1.6 |
| Botones / labels | `--font-body` | 600–700 | 1 |
| Eyebrow (`.section__eyebrow`) | `--font-body` | 700, uppercase, `letter-spacing: 0.08em` | 1 |

---

## 5. Espaciado

Escala de espaciado basada en `rem`, usada consistentemente para padding, margin y `gap`:

| Token | Valor | Uso típico |
|---|---|---|
| `--space-xs` | 0.5rem (8px) | Separación entre ícono y texto, gaps pequeños |
| `--space-sm` | 1rem (16px) | Separación entre elementos relacionados |
| `--space-md` | 1.5rem (24px) | Padding interno de tarjetas, gaps de grid |
| `--space-lg` | 2.5rem (40px) | Separación entre bloques dentro de una sección |
| `--space-xl` | 4rem (64px) | Padding vertical de sección en móvil |
| `--space-2xl` | 6rem (96px) | Padding vertical de sección en escritorio |

**Regla**: nunca usar valores de espaciado arbitrarios (`padding: 13px`) — si la escala no cubre un caso, se evalúa agregar un nuevo token en vez de romper la escala puntualmente.

---

## 6. Sistema de Grid

- **CSS Grid** para composiciones bidimensionales: grids de tarjetas (`why__grid`, `services__grid`, `locations__grid`, `testimonials__grid`), galería en mosaico, footer.
- **Flexbox** para composiciones unidimensionales: navbar, botones con íconos, formularios.
- **Nunca tablas** para layout (solo para datos tabulares reales, que no existen actualmente en el sitio).
- Contenedor centralizado: `.section__container` — `max-width: var(--container-width)` (1200px) + `padding-inline: var(--container-padding)` (fluido, `clamp(1.25rem, 4vw, 3rem)`).

### 6.1 Columnas por componente (escritorio → móvil)

| Componente | Escritorio | Tablet (≤1024px) | Móvil (≤767px) |
|---|---|---|---|
| Why cards | 4 columnas | 2 columnas | 1 columna |
| Service cards | 3 columnas | 2 columnas | 1 columna |
| Location cards | 2 columnas | 2 columnas | 1 columna |
| Testimonial cards | 3 columnas | 1 columna | 1 columna |
| Gallery grid | 4 columnas (mosaico) | 3 columnas | 2 columnas |
| Footer | 4 columnas | 3 columnas | 1 columna |
| Contact grid | 2 columnas (1.1fr / 0.9fr) | 1 columna | 1 columna |

---

## 7. Sistema de breakpoints

| Breakpoint | Rango | Dispositivo objetivo |
|---|---|---|
| Monitor grande | > 1200px | Escritorio estándar y grande |
| Portátil | 1024px – 1200px | Laptops |
| Tablet | 768px – 1024px | Tablets horizontales/verticales |
| Menú móvil (activación hamburguesa) | ≤ 900px | Punto de quiebre específico de navegación |
| Celular | ≤ 767px | Móviles estándar |
| Celular pequeño | ≤ 380px | Móviles de pantalla reducida |

> Estos breakpoints están implementados en `css/responsive.css`, cargado al final para garantizar precedencia en cascada sin depender de `!important`.

---

## 8. Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(27, 58, 87, 0.06)` | Reposo de tarjetas, botones primarios |
| `--shadow-md` | `0 8px 24px rgba(27, 58, 87, 0.10)` | Hover de tarjetas, navbar con scroll |
| `--shadow-lg` | `0 20px 48px rgba(27, 58, 87, 0.16)` | Botón flotante de WhatsApp, menú móvil abierto |

> Todas las sombras usan el tono `--color-navy` como base (en vez de negro puro), para mantener coherencia cromática incluso en las sombras.

---

## 9. Border radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8px | Inputs, botones pequeños, chips |
| `--radius-md` | 16px | Tarjetas estándar |
| `--radius-lg` | 28px | Tarjetas grandes (sedes), formulario de contacto |
| `--radius-full` | 999px | Botones tipo píldora, avatares, botón flotante |

---

## 10. Componentes

### 10.1 Botones

| Variante | Clase | Fondo | Texto | Uso |
|---|---|---|---|---|
| Primario | `.btn--primary` | `--color-sky` (hover: `--color-sky-dark`) | Blanco | Acción principal (Agendar visita, Enviar mensaje) |
| Outline | `.btn--outline` | Transparente, borde `--color-gray-border` | `--color-navy` | Acción secundaria (Conocer instalaciones) |
| WhatsApp | `.btn--whatsapp` | `--color-whatsapp` (hover: `--color-whatsapp-dark`) | Blanco | Exclusivo para iniciar conversación de WhatsApp |

Estados comunes a todos los botones: `border-radius: --radius-full`, elevación (`translateY(-2px)` + sombra) al hover, transición `--transition-fast`.

### 10.2 Inputs (formulario de contacto)

| Estado | Estilo |
|---|---|
| Reposo | Fondo `--color-gray-light`, borde transparente |
| Focus | Borde `--color-sky`, fondo `--color-white`, sin `outline` nativo (reemplazado visualmente) |
| Inválido (`.form__group.is-invalid`) | Borde `#E0554F`, fondo `#FDEEED`, mensaje de error visible |
| Placeholder | `--color-navy-soft` a 60% de opacidad |

### 10.3 Cards

Cuatro familias documentadas, todas comparten radios/sombras/transiciones del sistema pero difieren en composición:

| Familia | Composición | Interacción |
|---|---|---|
| Why card | Ícono circular + título + texto | Elevación al hover |
| Service card | Imagen + título + texto + link | Zoom de imagen + elevación al hover |
| Location card | Imagen de fondo completa + overlay degradado + texto sobre imagen | Zoom de imagen al hover |
| Testimonial card | Estrellas + cita + autor con avatar | Elevación al hover |

### 10.4 Navbar

- Transparente sobre el hero (texto/logo en blanco); pasa a `.navbar--scrolled` (fondo blanco con blur, texto navy) al superar 60px de scroll.
- Altura: `--navbar-height` (84px) en reposo, 72px en estado scrolled.
- Menú móvil: panel deslizante desde la derecha (`.is-open`), activo desde el breakpoint de 900px.

### 10.5 Footer

- Fondo `--color-navy`, texto blanco con distintos niveles de opacidad para jerarquía (85% cuerpo, 65-75% enlaces, 55% línea legal).
- Grid de 4 columnas (marca, enlaces, contacto, redes) con proporciones desiguales (`1.6fr 1fr 1.2fr 1fr`).

### 10.6 Modales

> **No implementado aún** (no hay modales en el Sprint 1). Cuando se requiera un modal (ej. confirmación, vista ampliada de galería), debe seguir estos lineamientos ya definidos por consistencia:
> - Fondo del overlay: `rgba(27, 58, 87, 0.7)` (navy semitransparente, consistente con los overlays ya usados en hero y location cards).
> - Contenedor del modal: `--radius-lg`, `--shadow-lg`, fondo `--color-white`.
> - Cierre accesible por `Escape` y clic fuera del contenedor (mismo patrón ya usado en `navbar.js` para el menú móvil).

### 10.7 Galería

- Tabs tipo píldora (`--radius-full`), estado activo en `--color-sky`.
- Grid en mosaico (algunos elementos ocupan 2×2) en vez de cuadrícula uniforme, para dar variedad editorial.
- Hover: zoom de imagen + overlay + caption con `transform`/`opacity`.
- Transición de contenido entre sedes animada (`.is-entering`), no un cambio brusco.

### 10.8 Iconografía

- Estilo: **línea/trazo**, esquinas redondeadas (`stroke-linecap: round`, `stroke-linejoin: round`), grosor consistente 2.2–2.4px sobre un `viewBox` de 48×48 (o 24×24 para elementos pequeños como estrellas).
- Todos los íconos son SVG propios (no de bancos de íconos de terceros), coherente con la restricción de "sin recursos externos de internet" (ver ADR-005).
- Color contextual: navy sobre fondos claros; blanco (vía `filter: brightness(0) invert(1)`) sobre fondos oscuros/de color — evita mantener dos archivos SVG por ícono.

---

## 11. Estados de interacción

### 11.1 Hover

- Botones y tarjetas: elevación sutil (`translateY(-2px)` a `-6px` según el elemento) + aumento de sombra (`--shadow-sm` → `--shadow-md`).
- Imágenes dentro de tarjetas: `scale(1.06)`–`scale(1.1)` con `overflow: hidden` en el contenedor.
- Enlaces de navegación: subrayado animado (`width: 0 → 100%`).
- Nunca se usa únicamente el color como indicador de hover en elementos interactivos pequeños (íconos) — siempre se acompaña de un cambio de tamaño, fondo o elevación, para no depender solo de la percepción del color.

### 11.2 Focus

- Todo elemento interactivo (`a`, `button`, `input`, `textarea`) tiene un estado `:focus-visible` explícito: `outline: 3px solid var(--color-sky-dark)` con `outline-offset: 3px`.
- Se usa `:focus-visible` (no `:focus`) para no mostrar el anillo de foco en interacciones de mouse/touch, solo en navegación por teclado — evita ruido visual sin sacrificar accesibilidad.

---

## 12. Accesibilidad

- **Contraste**: ver tabla en sección 2.4; ningún texto de lectura extensa se coloca en combinaciones por debajo de AA.
- **Navegación por teclado**: `.skip-link` para saltar al contenido principal; `Escape` cierra el menú móvil; el orden de tabulación sigue el orden visual/DOM sin `tabindex` positivo en ningún elemento.
- **`prefers-reduced-motion`**: todas las animaciones (scroll, hero, pulso de WhatsApp) se desactivan globalmente si el usuario lo solicita a nivel de sistema operativo.
- **Etiquetas ARIA**: tabs de galería siguen el patrón WAI-ARIA (`role="tablist"`, `aria-selected`, `aria-controls`); formulario con `aria-describedby` en cada campo hacia su mensaje de error asociado.
- **Texto alternativo**: toda imagen decorativa usa `alt=""`; toda imagen informativa tiene `alt` descriptivo (ver convención ya aplicada en `gallery.js`, que genera `alt` combinando caption + nombre de sede).

> El detalle normativo completo (nivel WCAG objetivo, checklist de cumplimiento) vive en `NFR.md`, sección Accesibilidad — este documento define el **cómo visual**, `NFR.md` define el **cuánto/qué nivel** es aceptable.

---

## 13. Dark mode (preparado, no implementado)

Aunque no se implementa en el Sprint 1, el sistema de tokens ya está estructurado para soportarlo sin refactor mayor:

- Todos los colores están centralizados en variables CSS en `:root` — la implementación futura solo requiere redefinir esas variables dentro de `@media (prefers-color-scheme: dark)` o una clase `.dark-mode` en `<html>`, sin tocar los archivos de componente (`cards.css`, `navbar.css`, etc.), que ya consumen exclusivamente variables y nunca colores hardcodeados.
- Recomendación para cuando se implemente: no invertir mecánicamente los colores — el azul cielo como fondo principal se sentiría "apagado" en dark mode; se recomienda evaluar un navy más oscuro como base con el azul cielo como acento, manteniendo el verde de WhatsApp sin cambios (es un color funcional, no decorativo).
- Esta sección se ampliará con tokens concretos (`--color-sky` en su variante dark, etc.) cuando el dark mode se planifique formalmente en un sprint futuro — no forma parte del alcance actual (ver `PROJECT.md`, sección "Fuera del alcance").

---

*Fin de DESIGN_SYSTEM.md.*
