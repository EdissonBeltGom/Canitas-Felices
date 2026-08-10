# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue el estándar [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto se adherirá a [Versionado Semántico](https://semver.org/lang/es/) (`MAYOR.MENOR.PARCHE`) a partir de su primera versión publicada formalmente.

> **Nota**: este proyecto aún no tiene una versión formal publicada (no existe un tag `v1.0.0` ni un despliegue de producción). Todo el trabajo realizado hasta ahora se documenta bajo `[Unreleased]`. La primera versión formal se etiquetará al cierre del Sprint 9, según lo definido en `docs/ROADMAP.md`. No se inventan versiones ni fechas futuras en este documento.

---

## [Unreleased]

### Added

**Sprint 4 — Páginas internas del sitio estático (en progreso)**
- `nosotros.html`: historia, misión, visión, valores (reutilizando `.why-card`/`.why__grid` de `cards.css` — sin duplicar el patrón) y CTA final. Contenido de referencia marcado explícitamente para revisión del negocio.
- `servicios.html`: detalle de los 6 servicios (imagen + descripción extendida + lista de puntos), alternando el layout izquierda/derecha (`.media-text--reverse`).
- `css/page-header.css`: encabezado compartido con breadcrumb, reutilizable en las páginas internas.
- `css/content-blocks.css`: bloque imagen+texto (`.media-text`) extraído de `nosotros.css` para compartirse entre `nosotros.html` y `servicios.html` sin duplicación.
- `css/nosotros.css`: estilos específicos de esta página (CTA, variante de 2 columnas para misión/visión).
- **Fix de navbar**: en páginas internas sin hero de pantalla completa, la navbar transparente quedaba con texto blanco sobre fondo blanco (ilegible). Se agregó la clase `.navbar--no-hero`, que fuerza el estado sólido desde el inicio sin depender del scroll.
- Navegación actualizada en las 3 páginas: "Nosotros" y "Servicios" (navbar y footer) ahora apuntan a sus páginas dedicadas en vez de a secciones ancla del Home.

**Sprint 1 — Home estático**
- Estructura completa de `index.html`: navbar, hero, sección "¿Por qué elegirnos?", servicios, sedes, galería, testimonios, contacto y footer.
- Sistema de estilos separado por componente: `styles.css`, `navbar.css`, `banner.css`, `cards.css`, `gallery.css`, `contact.css`, `footer.css`, `animations.css`, `responsive.css`.
- Módulos de JavaScript separados por responsabilidad: `navbar.js`, `gallery.js`, `whatsapp.js`, `animations.js`, `app.js`.
- Sistema de diseño inicial: paleta de color, tipografía (Fraunces + Plus Jakarta Sans), escala tipográfica, espaciados, sombras y radios, expresados como variables CSS.
- Navbar con cambio de estado al hacer scroll y menú móvil accesible (teclado, `aria-expanded`, cierre con `Escape`).
- Galería dinámica filtrable por sede (La Pampa / Campestre), con datos centralizados en `gallery.js`.
- Botón flotante de WhatsApp con visibilidad controlada por `IntersectionObserver` y registro centralizado de clics.
- Animaciones de entrada al hacer scroll (`IntersectionObserver` + atributos `data-animate`), con soporte de `prefers-reduced-motion`.
- Validación de formulario de contacto en cliente (nombre, correo, teléfono, mensaje) con mensajes de error accesibles y confirmación de envío simulada.
- Set completo de 13 íconos SVG propios (`img/iconos/`).
- Logotipo en dos variantes (`logo.svg`, `logo-blanco.svg`) y `favicon.ico` generado a partir del logotipo.
- 22 imágenes de referencia (ilustraciones de marca renderizadas como `.jpg`) para banner, servicios, sedes y testimonios, marcadas explícitamente como temporales.

**Sprint 2 — Documentación técnica y funcional**
- `docs/PROJECT.md`: visión, objetivos, alcance, público objetivo, riesgos y definición de éxito del proyecto.
- `docs/ARCHITECTURE.md`: arquitectura actual y objetivo (Angular + backend por definir), con diagramas Mermaid, estructura de carpetas y convenciones.
- `docs/DESIGN_SYSTEM.md`: identidad visual, tokens de diseño, componentes y estados documentados a partir del código real del Sprint 1.
- `docs/ROADMAP.md`: planificación completa de 8 sprints con criterios de aceptación, dependencias y riesgos.
- `CLAUDE.md`: instrucciones permanentes de desarrollo, ubicado en la raíz del proyecto.
- `docs/CONTRIBUTING.md`: guía de contribución, convenciones y flujo de Git.
- `docs/CHANGELOG.md`: historial de cambios del proyecto (este documento).
- `README.md`: portada profesional del repositorio.
- `docs/ADR.md`: registro de las primeras 10 decisiones de arquitectura (ADR-001 a ADR-010).
- `docs/NFR.md`: requisitos no funcionales con métricas de calidad concretas y verificables.
- Validación responsive del sitio real (Sprint 1) en 4 anchos de pantalla (375px, 768px, 1024px, 1440px) más el estado abierto del menú móvil, confirmando el comportamiento definido en `responsive.css` y `navbar.js`.

**Sprint 3 — Funcionalidades JavaScript e interactividad**
- `js/utils.js`: módulo de utilidades compartidas (`debounce`, `throttle`, `clamp`, `prefersReducedMotion`, `lockScroll`/`unlockScroll` con contador de referencias, `trapFocus`/`getFocusableElements`), expuesto vía el namespace global `window.CanitasFelices` (ver ADR-011).
- `js/loader.js` + `css/loader.css`: pantalla de carga inicial con tiempo mínimo configurable, desaparición suave y fallback `<noscript>`.
- `navbar.js`: indicador de sección activa (scrollspy vía `IntersectionObserver`), scroll suave con manejo de foco accesible, bloqueo de scroll migrado a `utils.js`.
- `animations.js` / `animations.css`: nuevas variantes `scale` y `reveal`, soporte de `data-duration`/`data-delay` en milisegundos junto al sistema de pasos fijos ya existente.
- Hero: corrección de contraste del outline de foco sobre fondos oscuros (extendida también a tarjetas de sede, footer y lightbox), aparición progresiva del indicador de scroll, documentación de compatibilidad futura con un slider sin cambios de arquitectura.
- `js/scroll.js`: botón flotante "volver arriba", visible tras salir del Hero, con manejo de foco accesible al activarse.
- `whatsapp.js`: configuración centralizada (`CONFIG.phone`/`CONFIG.messages`), tooltip visual (CSS puro), unificación de los 4 enlaces de WhatsApp del sitio vía `data-whatsapp-template`.
- `js/lightbox.js` + `css/lightbox.css`: modal de galería a pantalla completa — navegación por teclado y flechas, cierre con Escape/clic afuera, zoom por clic, swipe táctil, precarga de imágenes cercanas, foco atrapado y devuelto al cerrar.
- `gallery.js`: integración con el lightbox (cada fotografía es operable por clic/teclado), precarga en segundo plano de la sede no visible.
- `js/form.js`: formulario de contacto separado de `app.js`, con estados de carga y error diferenciados del de éxito, y un punto único (`submitToApi`) preparado para la futura integración con el backend (ver ADR-007).
- `app.js`: reducido a inicialización general no ligada a ningún componente (año dinámico del footer); eliminado el envoltorio `DOMContentLoaded` redundante (los scripts ya cargan con `defer`).
- `js/faq.js` + `css/faq.css`: acordeón de preguntas frecuentes accesible (WAI-ARIA, un solo elemento abierto, navegación con flechas/Home/End, animación vía `grid-template-rows`), construido en el Sprint 3 y conectado al Home con 6 preguntas de referencia (ver `Changed` más abajo).

### Fixed
- N/A — no se han registrado correcciones formales aún; el proyecto está en su primera iteración de construcción.

### Changed
- `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `CLAUDE.md` y `README.md`: corregido el framework de backend de "Spring Boot" (decisión asumida) a **"por definir"**, con Spring Boot y Python/Flask como candidatos en evaluación. La decisión formal se tomará por ADR durante el Sprint 5.
- `docs/ARCHITECTURE.md`: tabla de responsabilidad por archivo, diagrama de capas y estructura de carpetas actualizados con los 7 archivos JS y 3 archivos CSS nuevos del Sprint 3.
- `app.js`: comportamiento sin cambios visibles, pero se quitó el envoltorio `DOMContentLoaded` (redundante con `defer`) y toda la lógica de formulario, ahora en `form.js`.
- `whatsapp.js`: los 4 enlaces de WhatsApp del sitio ahora derivan su `href` de una configuración centralizada en tiempo de ejecución (con el `href` original del HTML como *fallback* si el script no carga).
- **Reconciliación de numeración de sprints**: el Sprint 3 (funcionalidades JavaScript) se ejecutó sin haberse agregado primero a `docs/ROADMAP.md`, incumpliendo la propia regla de gobernanza del proyecto. Se corrigió redefiniendo el Sprint 3 con su contenido real y renumerando en cascada todos los sprints posteriores (el antiguo Sprint 3 "Páginas internas" pasó a ser el Sprint 4, y así sucesivamente hasta el Sprint 9). El roadmap pasó de 8 a 9 sprints. Cambio propagado a `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/NFR.md`, `CLAUDE.md`, `docs/CONTRIBUTING.md` y `README.md`. Ver la nota de reconciliación al final de `docs/ROADMAP.md` para el detalle completo.
- **Nombre de marca actualizado**: "Canitas Felices" → "Hogar Canitas Felices" en la totalidad del sitio (título, metadatos, navbar, footer, testimonios, alt de imágenes, mensajes de WhatsApp) y de la documentación (`docs/PROJECT.md`, `README.md`, `docs/ADR.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, `CLAUDE.md`). No se renombró la carpeta del proyecto (`CanitasFelices/`) ni los comentarios de cabecera técnicos de cada archivo CSS/JS — son identificadores de código, no el nombre de marca mostrado al público.
- **Número de WhatsApp/teléfono actualizado**: primero a `+57 300 225 8378`, luego al número definitivo `+57 322 851 9039`, en `js/whatsapp.js` (`CONFIG.phone`) y en los 5 enlaces `wa.me`/`tel:` del HTML (navbar, hero, footer — llamada y WhatsApp, botón flotante).
- **Correo actualizado** de `contacto@canitasfelices.com` a `contacto@hogarcanitasfelices.com` (footer, href y texto visible).
- **Tarjeta de Alimentación**: se quitó la palabra "personalizados" del texto — los menús son balanceados, no personalizados por residente.
- **`navbar.js`**: el listener de `resize` ahora usa `utils.debounce()` (150ms) en vez de ejecutarse en cada evento.
- **FAQ conectado al Home**: la sección `#faq` (Preguntas frecuentes) se agregó entre Testimonios y Contacto, con 6 preguntas de referencia (marcadas explícitamente en el HTML como contenido a validar por el negocio, mismo criterio que las imágenes del Sprint 1). Enlace "Preguntas" agregado a la navbar.
- **Fotos reales de la Sede Campestre**: las 6 imágenes de referencia (`fachada`, `patio-interno`, `habitacion`, `sala-comun`, `huerta`, `comedor`) reemplazadas por fotografías reales, optimizadas a 1200px de ancho y compresión JPEG progresiva (calidad 65, ~57% más livianas que el original).
- **Banner del Hero actualizado** con fotografía real de la fachada (antes: ilustración de referencia), optimizada a 1920×1080 y 360 KB.
- **Formulario de contacto conectado a envío real**: `js/form.js` ahora envía los mensajes a través de [Web3Forms](https://web3forms.com) hacia `contacto@hogarcanitasfelices.com`, reemplazando la simulación de red del Sprint 3. Se mantiene el hook `debugForceError` para seguir probando el estado de error sin gastar cupo de envíos reales.

### Deprecated / Removed / Security
- N/A — sin elementos que reportar en estas categorías hasta la fecha.

---

## Formato de las entradas (referencia para futuras actualizaciones)

Cada nueva versión publicada debe agregarse **encima** de las anteriores (orden cronológico inverso), siguiendo esta estructura:

```
## [MAYOR.MENOR.PARCHE] - AAAA-MM-DD

### Added
- Para funcionalidades nuevas.

### Changed
- Para cambios en funcionalidad ya existente.

### Deprecated
- Para funcionalidades que seguirán existiendo pero se eliminarán pronto.

### Removed
- Para funcionalidades eliminadas en esta versión.

### Fixed
- Para corrección de errores.

### Security
- Para vulnerabilidades corregidas.
```

Reglas de mantenimiento:

- No se documentan cambios internos sin impacto observable (ej. renombrar una variable interna sin efecto funcional) — este changelog es para humanos, no un log de commits.
- Toda entrada debe ser comprensible sin necesidad de leer el código o el PR asociado.
- La sección `[Unreleased]` se mantiene siempre al tope, acumulando cambios hasta el próximo corte de versión formal.
- Al publicar una versión formal, el contenido de `[Unreleased]` se mueve a una nueva sección versionada y fechada, y `[Unreleased]` queda vacía para el siguiente ciclo.

---

*Fin de CHANGELOG.md.*
