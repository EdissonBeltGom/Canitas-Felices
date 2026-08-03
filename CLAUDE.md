# CLAUDE.md — Instrucciones permanentes del proyecto Hogar Canitas Felices

> **Nota de ubicación**: este archivo vive intencionalmente en la **raíz del proyecto** (no dentro de `docs/`), porque herramientas como Claude Code lo detectan automáticamente solo en esa ubicación. Es el único documento del set que rompe la convención de "todo en `docs/`", y lo hace a propósito — no lo muevas a `docs/` ni crees una copia duplicada ahí, para evitar que ambas versiones diverjan con el tiempo.

> Este es el documento operativo más importante del proyecto. No describe visión ni arquitectura (eso vive en `docs/PROJECT.md` y `docs/ARCHITECTURE.md`) — describe **cómo debe comportarse cualquier agente o desarrollador que escriba código en este repositorio, en cualquier sprint**. Se lee antes de escribir la primera línea de código de cada sesión de trabajo. Ante cualquier conflicto entre una instrucción puntual del usuario y este documento, se prioriza este documento salvo que el usuario apruebe explícitamente una excepción — y esa excepción debe registrarse como ADR.

---

## 1. Reglas absolutas (no negociables sin ADR)

Estas reglas no se rompen "por esta vez" ni "porque es más rápido". Si una tarea parece requerir romper una de estas reglas, la respuesta correcta es detenerse y proponer un ADR, no improvisar.

1. **Nunca utilizar Bootstrap, Tailwind ni ningún framework o librería de CSS.** Todo estilo se construye desde cero con CSS3 (Flexbox, Grid, variables CSS).
2. **Nunca escribir CSS dentro del HTML** (ni en `<style>` ni en atributos `style=""`), salvo en artefactos de generación dinámica claramente marcados como temporales y documentados como tal.
3. **Nunca escribir JavaScript embebido** (ni en `<script>` inline con lógica, ni en atributos `onclick=""` y similares). Todo JS vive en su archivo correspondiente bajo `js/`.
4. **Nunca usar tablas HTML (`<table>`) para maquetar layout.** Tablas solo para datos tabulares reales.
5. **Nunca usar imágenes de bancos externos, de internet, o con licencia de terceros como recurso final del sitio.** Todo recurso visual es propio o está explícitamente marcado como imagen de referencia temporal (ver ADR-005).
6. **Nunca cambiar la arquitectura ya definida** (estructura de carpetas, separación de responsabilidades por archivo, convenciones de nombres) sin registrar primero un ADR que lo justifique y sea aprobado.
7. **Nunca crear soluciones temporales sin marcarlas explícitamente como tales** (comentario en código + mención en el documento correspondiente, ej. `docs/ROADMAP.md` o `docs/CHANGELOG.md`). Una solución temporal no documentada es deuda técnica invisible, y eso está prohibido, no la deuda técnica en sí misma.
8. **Nunca introducir una dependencia externa nueva** (librería, framework, servicio de terceros, CDN) sin justificarla y registrarla como ADR antes de usarla.

---

## 2. Principios de código

### 2.1 Clean Code

- Nombres descriptivos siempre, en el idioma correcto según convención (ver `docs/ARCHITECTURE.md`, sección 2.5): inglés técnico para nombres de código, español para contenido/dominio de negocio.
- Funciones pequeñas, con una sola responsabilidad clara — si una función JS necesita un comentario para explicar "y también hace esto otro", probablemente debe dividirse.
- Evitar niveles de anidación profundos; preferir *early returns* (ya aplicado en `navbar.js`: `if (!navbar || !toggle || !menu) return;`).
- El código debe ser legible sin depender de comentarios para entender *qué* hace — los comentarios explican *por qué*, no *qué* (ver sección 2.4).

### 2.2 Principios SOLID (cuando aplican a JavaScript/futuro Angular)

- **Responsabilidad única**: ya aplicado estrictamente a nivel de archivo (ver tabla de `docs/ARCHITECTURE.md`, sección 2.2) — cada archivo CSS/JS tiene una única razón para cambiar.
- **Abierto/cerrado**: `gallery.js` es el ejemplo de referencia — agregar una nueva sede o fotografía no requiere modificar la lógica de renderizado, solo extender el objeto de datos `GALLERIES`.
- **Inversión de dependencias** (relevante desde el Sprint 7 en adelante): los componentes Angular dependerán de abstracciones (servicios inyectables vía `@Injectable`), no de implementaciones concretas de acceso a datos — para poder cambiar de datos mockeados a API real sin tocar componentes.
- No se fuerza la aplicación de SOLID donde no aporta valor real en JavaScript vanilla (ej. no se crean jerarquías de clases innecesarias en un sitio estático) — SOLID se aplica con criterio, no como dogma.

### 2.3 Modularidad y separación de responsabilidades

- Un componente visual = un archivo CSS + (si tiene comportamiento) un archivo JS. Esta regla ya está documentada exhaustivamente en `docs/ARCHITECTURE.md`, sección 2.2, y es de cumplimiento obligatorio.
- Antes de agregar código a un archivo existente, verificar contra esa tabla que la responsabilidad corresponde. Si no corresponde, crear un archivo nuevo (como ya ocurrió con `contact.css`), no forzarlo dentro de un archivo existente.
- Ningún archivo JS debe manipular estilos directamente vía `element.style.propiedad = valor` para lógica de presentación — los cambios visuales se controlan agregando/quitando clases CSS (patrón ya usado consistentemente: `.is-active`, `.is-open`, `.is-invalid`, `.is-visible`).

### 2.4 Comentarios

- Comentarios **únicamente cuando aportan valor**: explican una decisión no obvia, una limitación conocida, o el "por qué" de algo que a simple vista podría parecer innecesario (ej. el comentario en `contact.css` explicando por qué existe pese a no estar en la arquitectura original del Sprint 1).
- No comentar lo obvio (`// esto es un botón`).
- Todo comentario que marque una solución temporal, un `TODO`, o una limitación conocida debe seguir el formato ya usado en el proyecto: `// TODO: descripción clara de qué falta y por qué no se hizo ahora` (ver ejemplo real en `app.js`, función `submitForm`).

### 2.5 No duplicar código (DRY)

- Antes de escribir un bloque de CSS o JS nuevo, verificar si ya existe una utilidad, variable o patrón reutilizable (ver `docs/DESIGN_SYSTEM.md` para tokens, y las clases utilitarias ya definidas en `styles.css`).
- Si un mismo patrón visual se repite 3 o más veces sin una clase/token reutilizable detrás, es una señal de que falta abstraerlo — no de que hay que seguir copiando y pegando.
- Excepción consciente: la duplicación de navbar/footer entre páginas HTML estáticas (Sprint 4) es una duplicación **aceptada y documentada** en `docs/ROADMAP.md` como deuda técnica intencional, no una violación de esta regla — porque HTML estático puro no tiene mecanismo de *templating*, y resolverlo antes de tiempo (ej. con JS de inclusión) sería una solución temporal no justificada.

### 2.6 Consistencia entre archivos

- Todo nuevo CSS debe consumir las variables definidas en `styles.css` — nunca declarar un color, tamaño de fuente, espaciado o radio "a mano".
- Toda nueva clase CSS debe seguir la nomenclatura BEM ya establecida (ver `docs/ARCHITECTURE.md`, sección 2.5).
- Todo nuevo archivo JS debe seguir el patrón Module (IIFE) + `'use strict'` ya usado en los 5 archivos existentes, salvo que se documente una razón explícita para no hacerlo.

---

## 3. Responsive First

- Todo componente nuevo se diseña pensando primero en cómo se ve y funciona en móvil, y se expande hacia tablet/escritorio — no al revés.
- Todo layout se construye con Flexbox o CSS Grid, nunca con posicionamiento absoluto como mecanismo principal de estructura.
- Los breakpoints oficiales son los definidos en `docs/DESIGN_SYSTEM.md`, sección 7 — no se introducen breakpoints nuevos sin justificación y sin agregarlos a esa tabla.

## 4. Accesibilidad

- Cumplimiento mínimo WCAG AA en todo contenido nuevo (nivel objetivo formal en `docs/NFR.md`).
- Todo elemento interactivo debe ser operable por teclado, con estado `:focus-visible` visible.
- Toda imagen informativa lleva `alt` descriptivo; toda imagen decorativa lleva `alt=""`.
- Todo componente con estados dinámicos (tabs, acordeones, modales futuros) sigue el patrón WAI-ARIA correspondiente, no una implementación ad-hoc.
- Toda animación respeta `prefers-reduced-motion` — ya implementado globalmente en `styles.css`, no debe romperse al agregar animaciones nuevas fuera de ese sistema.

## 5. SEO

- Toda página nueva (Sprint 4 en adelante) debe tener sus propios metadatos (`title`, `description`, Open Graph) específicos a su contenido — nunca reutilizar los metadatos del Home.
- HTML semántico siempre: `header`, `nav`, `main`, `section`, `article`, `footer` con propósito real, no `div` genéricos donde exista una etiqueta semántica adecuada.
- Jerarquía de encabezados (`h1`–`h6`) coherente y única por página — un solo `h1` por página.
- El detalle técnico completo (sitemap, robots.txt, Schema.org) vive en `docs/NFR.md`, sección SEO, y se implementa formalmente en el Sprint 5.

---

## 6. Pensar siempre en la futura migración a Angular

Antes de escribir CSS o JS nuevo en la Era 1 (sitio estático), evaluar: **¿esta decisión facilita o dificulta su traducción a un componente Angular?**

- Preferir composición de clases BEM que mapeen limpiamente a un *selector* de componente (`service-card` → `app-service-card`).
- Mantener la lógica de datos (como `GALLERIES` en `gallery.js`) separada de la lógica de renderizado, de forma que reemplazar el origen de datos por un servicio HTTP no requiera reescribir cómo se pinta la UI.
- No usar manipulación directa y dispersa del DOM que sería difícil de replicar declarativamente en un *template* Angular (ej. evitar construir HTML como strings concatenados; el patrón ya usado en `gallery.js`, con `document.createElement` estructurado, es preferible y se mantiene).
- No introducir *build tools* o *bundlers* en la Era 1 — sería adelantar infraestructura que Angular ya provee, violando el principio de "preparar sin sobre-construir" (`docs/PROJECT.md`, sección 13).

## 7. Pensar siempre en la futura integración con un backend (framework por definir)

> El framework de backend aún no está decidido (candidatos: Spring Boot o Python/Flask — ver `docs/ARCHITECTURE.md`, sección 3.3; decisión formal vía ADR en el Sprint 6). Las reglas de esta sección aplican **sin importar cuál se elija** — son sobre cómo escribir el frontend hoy para no acoplarlo a las particularidades de un framework específico de backend.

- Toda estructura de datos local (como `GALLERIES`) debe diseñarse con una forma (*shape*) que sea razonable como respuesta JSON de una API REST futura — nombres de campo en `camelCase` o `snake_case` consistentes, sin mezclar convenciones.
- Toda validación de formulario implementada en el cliente (`app.js`) debe considerarse una **duplicación intencional** de la validación que existirá en el backend (con el mecanismo que corresponda al framework elegido: Bean Validation, Marshmallow/Pydantic, u otro) — no un reemplazo. No se debe asumir que la validación de cliente es suficiente para producción una vez exista backend.
- No se debe diseñar ninguna función del cliente asumiendo que "siempre" tendrá acceso directo y sin restricciones a los datos — pensar ya en la diferencia entre endpoints públicos y protegidos definida en `docs/ARCHITECTURE.md`, sección 3.5, aunque hoy no exista backend real ni se haya elegido su framework.

---

## 8. Flujo de trabajo con el usuario (aplicable a agentes de IA)

- **No entregar múltiples archivos o documentos en una sola respuesta salvo que el usuario lo pida explícitamente.** El proyecto se construye de forma incremental, con aprobación explícita entre archivos/documentos (patrón ya establecido y seguido durante los Sprints 1 y 2).
- Ante una tarea ambigua, proponer la interpretación más razonable y proceder, dejando explícita la decisión tomada — no bloquear el avance con preguntas evitables, pero tampoco improvisar sobre decisiones ya documentadas en `docs/PROJECT.md`/`docs/ARCHITECTURE.md`/`docs/DESIGN_SYSTEM.md`.
- Cuando se detecta un pendiente o inconsistencia no cubierto por la arquitectura actual (como ocurrió con `contact.css` o el ícono de WhatsApp de la navbar), señalarlo explícitamente al usuario en vez de resolverlo en silencio.
- Verificar de forma activa (no asumir) que las rutas de archivos referenciadas en el código correspondan a archivos reales antes de dar por completado un entregable — como se hizo al validar las 38 rutas de imágenes del Sprint 1.

## 9. Actualización de la documentación

- Todo cambio estructural (nuevo archivo, nueva convención, nueva dependencia, cambio de arquitectura) debe reflejarse en la documentación correspondiente **en el mismo sprint** en que ocurre, no de forma retroactiva.
- Un ADR se registra en el momento en que se toma la decisión, no al final del proyecto como ejercicio de reconstrucción histórica.
- `docs/CHANGELOG.md` se actualiza en cada entregable relevante, siendo fiel al estándar Keep a Changelog (ver `docs/CHANGELOG.md`).

---

## 10. Checklist rápido antes de dar por terminado cualquier entregable de código

- [ ] ¿El CSS/JS está en su archivo correspondiente, sin nada embebido en HTML?
- [ ] ¿Se usaron variables/tokens existentes en vez de valores "a mano"?
- [ ] ¿La nomenclatura sigue BEM (CSS) y las convenciones de `docs/ARCHITECTURE.md` (JS)?
- [ ] ¿Es responsive, probado mentalmente (o realmente) en los breakpoints oficiales?
- [ ] ¿Es accesible (teclado, `alt`, contraste, ARIA si aplica)?
- [ ] ¿No introduce frameworks CSS, librerías nuevas ni imágenes externas sin justificación?
- [ ] ¿Alguna decisión tomada aquí debería registrarse como ADR?
- [ ] ¿La documentación relevante quedó actualizada, o se dejó explícitamente señalado que falta actualizarla?

---

*Este documento se aplica desde este momento en adelante, en todos los sprints restantes del proyecto, sin excepción salvo ADR explícito.*

*Fin de CLAUDE.md.*
