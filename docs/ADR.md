# ADR.md — Architecture Decision Records

> Registro oficial de decisiones de arquitectura del proyecto Hogar Canitas Felices. Este documento existe para que **cualquier persona pueda entender por qué el proyecto está construido como está**, sin depender de conocimiento implícito o de "preguntarle a quien lo hizo".

---

## 1. Introducción

### 1.1 ¿Qué es un ADR?

Un **Architecture Decision Record (ADR)** es un documento corto que captura una decisión de arquitectura importante, junto con su contexto y sus consecuencias. No es un documento de diseño exhaustivo — es una **fotografía del razonamiento** en el momento en que se tomó la decisión: qué problema había, qué alternativas se consideraron, por qué se eligió una sobre las otras, y qué se sabía que se ganaba y se perdía al hacerlo.

### 1.2 ¿Por qué se utiliza en este proyecto?

Hogar Canitas Felices se desarrolla por sprints, potencialmente por distintos colaboradores (humanos o agentes de IA) a lo largo del tiempo, y evolucionará hacia un stack tecnológico distinto al actual (Angular + backend por definir). Sin un registro explícito de decisiones:

- Se corre el riesgo de que alguien "corrija" una decisión intencional pensando que fue un descuido (ej. por qué `contact.css` existe fuera de la arquitectura original del Sprint 1).
- Las decisiones importantes (o sus razones) se olvidan con el tiempo, incluso para quien las tomó.
- Un colaborador nuevo no tiene forma de distinguir una restricción deliberada de una casualidad del código.

Los ADR resuelven esto convirtiendo el razonamiento arquitectónico en **documentación versionada**, tan importante como el código mismo.

### 1.3 Cómo registrar nuevas decisiones

1. Antes de implementar un cambio que afecte arquitectura, convenciones, estructura de carpetas, o que introduzca una dependencia nueva, se redacta el ADR **usando la plantilla oficial** (sección 2).
2. El ADR se registra con estado `Propuesto` mientras se discute o valida.
3. Una vez aceptado (por el usuario/product owner del proyecto), cambia a `Aprobado` — solo entonces se implementa el cambio correspondiente.
4. Si una decisión posterior reemplaza a una anterior, el ADR antiguo cambia a `Reemplazado`, indicando qué ADR lo sustituye — **nunca se borra un ADR**, incluso si ya no aplica.
5. Si una decisión deja de ser relevante sin ser reemplazada por otra (ej. una restricción que ya no aplica por cambio de alcance), se marca como `Obsoleto`, explicando por qué.

> Ver también `docs/CONTRIBUTING.md`, sección 5.3: todo Pull Request que se desvíe de la arquitectura documentada debe incluir su ADR correspondiente en el mismo cambio, no como promesa futura.

### 1.4 Convenciones de numeración

- Los ADR se numeran de forma secuencial y consecutiva: `ADR-001`, `ADR-002`, `ADR-003`, etc. — sin saltos, sin reutilizar números, incluso si un ADR queda obsoleto.
- El número se asigna en el momento de creación del ADR (aunque esté en estado `Propuesto`), no al momento de aprobación — así se evitan colisiones si dos decisiones se proponen en paralelo.
- El nombre de archivo, si se decide más adelante extraer cada ADR a su propio archivo (ver nota en sección 4), sigue el patrón `docs/adr/ADR-XXX-titulo-corto-en-kebab-case.md`. Por ahora, todos los ADR viven consolidados en este único documento, dado el tamaño actual del proyecto.

### 1.5 Estados posibles

| Estado | Significado |
|---|---|
| `Propuesto` | La decisión está en discusión, aún no se implementa. |
| `Aprobado` | La decisión fue aceptada y está (o debe estar) implementada. |
| `Reemplazado` | Una decisión posterior sustituye a esta; se indica cuál (`Reemplazado por ADR-XXX`). |
| `Obsoleto` | La decisión ya no aplica (ej. por cambio de alcance), sin que exista un reemplazo directo. |

---

## 2. Plantilla oficial de ADR

```markdown
## ADR-XXX: Título corto y descriptivo

- **Identificador**: ADR-XXX
- **Fecha**: AAAA-MM-DD
- **Estado**: Propuesto / Aprobado / Reemplazado por ADR-YYY / Obsoleto

### Contexto
[Situación en la que surge la necesidad de esta decisión. Qué estaba pasando, qué se estaba construyendo.]

### Problema
[La pregunta concreta que esta decisión responde. Formulada de forma neutral, sin insinuar la respuesta.]

### Alternativas consideradas
[Lista de opciones reales evaluadas, incluyendo "no hacer nada" o "mantener el estado actual" cuando aplique. Cada una con una frase de por qué se descartó, si corresponde.]

### Decisión tomada
[La opción elegida, en una frase clara y sin ambigüedad.]

### Justificación
[Por qué se eligió esta opción sobre las demás. Razonamiento, no solo afirmación.]

### Consecuencias positivas
[Qué se gana con esta decisión.]

### Consecuencias negativas
[Qué se sacrifica, qué limitación se acepta a cambio. Todo ADR tiene al menos una — si no hay ninguna, probablemente no era una decisión real.]

### Impacto en el proyecto
[Qué archivos, convenciones o sprints futuros se ven afectados por esta decisión.]

### Referencias
[Enlaces a otros documentos, ADR relacionados, o recursos externos relevantes.]
```

---

## 3. Registro de decisiones

> Las siguientes 10 decisiones fueron tomadas durante la implementación del **Sprint 1** (sitio estático) y se formalizan retroactivamente como ADR durante el **Sprint 2** (documentación), ya que el proceso de ADR explícito se instauró en este mismo sprint de documentación. A partir de este punto, todo ADR nuevo se registra **antes** de su implementación, según el proceso descrito en la sección 1.3.

---

### ADR-001: Arquitectura inicial basada en HTML5, CSS3 y JavaScript antes de la migración a Angular

- **Identificador**: ADR-001
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El proyecto tiene como objetivo final una plataforma Angular + backend con panel administrativo, pero necesita un Home funcional, presentable y de calidad de producción desde el primer sprint, sin esperar a que la arquitectura completa (frontend, backend, base de datos) esté disponible.

**Problema**
¿Con qué tecnología se construye la primera versión visible y funcional del sitio, dado que la plataforma completa (Angular + backend) tomará varios sprints en estar lista?

**Alternativas consideradas**
- Iniciar directamente con Angular, aunque no exista backend ni contenido real todavía.
- Usar un generador de sitios estáticos (ej. Astro, Eleventy) como capa intermedia.
- Construir con HTML5, CSS3 y JavaScript ES6 puro, sin frameworks ni build tools.

**Decisión tomada**
Construir la primera versión del sitio con HTML5, CSS3 y JavaScript ES6 vanilla, sin frameworks de ningún tipo.

**Justificación**
Angular sin backend ni contenido real habría significado construir infraestructura (routing, servicios, build) para datos que todavía no existen — sobre-construcción prematura. Un generador de sitios estáticos habría introducido una dependencia y una curva de aprendizaje sin necesidad real en esta etapa. HTML/CSS/JS puro permite iterar rápido sobre diseño y contenido, sin ninguna barrera de tooling, y — si se diseña con disciplina (ver ADR-002, ADR-003, ADR-004) — se convierte en la especificación viva de los futuros componentes Angular, no en un prototipo desechable.

**Consecuencias positivas**
- Cero curva de aprendizaje o configuración para empezar a ver resultados visuales.
- El archivo `index.html` puede abrirse directamente en cualquier navegador, sin servidor ni build.
- Fuerza a resolver diseño, responsive y accesibilidad sin depender de abstracciones de framework.

**Consecuencias negativas**
- Duplicación de HTML (navbar, footer) inevitable al agregar páginas internas (ver Sprint 4 en `docs/ROADMAP.md`), al no existir un mecanismo de *templating* nativo.
- Ninguna gestión de estado ni *data binding* declarativo — toda interacción se maneja manualmente vía DOM (ver ADR-004).

**Impacto en el proyecto**
Define la totalidad de la estructura de `index.html`, `css/` y `js/` del Sprint 1, y condiciona directamente el diseño de `docs/ARCHITECTURE.md`, que documenta la migración de esta base a Angular como una traducción, no una reescritura.

**Referencias**
`docs/PROJECT.md` (sección "Restricciones"), `docs/ARCHITECTURE.md` (sección 1).

---

### ADR-002: Organización modular de archivos y carpetas

- **Identificador**: ADR-002
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
Con la decisión de ADR-001 tomada, era necesario definir cómo se organizarían los archivos del sitio estático para que no se convirtiera en un desorden difícil de mantener ni de migrar más adelante.

**Problema**
¿Cómo se estructuran las carpetas y archivos del proyecto para maximizar claridad, mantenibilidad y facilidad de una futura migración?

**Alternativas consideradas**
- Un único archivo CSS y un único archivo JS para todo el sitio ("todo en uno").
- Organización por tipo de página (ej. `home.css`, `contacto.css` mezclando todos los componentes de cada página).
- Organización por componente/responsabilidad, independientemente de en qué página aparezca cada componente.

**Decisión tomada**
Organizar el proyecto en carpetas `css/`, `js/`, `img/` en la raíz, con un archivo por componente/responsabilidad dentro de `css/` y `js/` (ver tabla completa en `docs/ARCHITECTURE.md`, sección 2.2), y `img/` subdividida por tipo de contenido (`banner/`, `servicios/`, `sedes/<sede>/`, `testimonios/`, `iconos/`, `logo/`).

**Justificación**
Un único archivo CSS/JS habría sido más rápido de escribir al inicio, pero se vuelve inmanejable a medida que crece el sitio, y no tiene ninguna relación estructural con cómo se organizan los componentes en Angular (donde cada componente tiene sus propios archivos). Organizar por página, en cambio, duplicaría estilos de componentes compartidos (navbar, botones) entre páginas. Organizar por componente es la opción que más se parece a la unidad de composición de Angular (un componente = un conjunto de archivos), reduciendo la distancia entre "sitio estático" y "aplicación Angular".

**Consecuencias positivas**
- Cada archivo tiene una razón de cambio clara y única (ver `docs/ARCHITECTURE.md`, principio de responsabilidad única).
- Facilita la futura extracción 1:1 de cada archivo CSS a los estilos de su componente Angular equivalente.
- Reduce el riesgo de "archivo gigante" que nadie quiere tocar.

**Consecuencias negativas**
- Más archivos que gestionar desde el día uno, incluso cuando el sitio era muy pequeño (Sprint 1 inicial).
- Requiere disciplina activa: sin revisión, es fácil que alguien agregue código al archivo "más cercano" en vez del correcto (mitigado por el checklist de `docs/CONTRIBUTING.md`).

**Impacto en el proyecto**
Estructura base de carpetas de todo el proyecto (ver `docs/ARCHITECTURE.md`, sección 2.3) y condiciona la estructura de carpetas objetivo de Angular (sección 4 del mismo documento).

**Referencias**
`docs/ARCHITECTURE.md` (secciones 2.2 y 2.3), `docs/CONTRIBUTING.md` (sección 4).

---

### ADR-003: Uso de CSS separado por componente

- **Identificador**: ADR-003
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
Derivado de ADR-002, específicamente para la capa de estilos: el sitio requiere un sistema de diseño consistente (colores, tipografía, espaciado) aplicado a múltiples componentes visuales distintos (navbar, hero, tarjetas, galería, formulario, footer).

**Problema**
¿Cómo se estructura el CSS para que sea mantenible, evite duplicación, y no dependa de un framework externo (restricción ya fijada en `docs/PROJECT.md`)?

**Alternativas consideradas**
- Un framework CSS utilitario (Tailwind) para evitar escribir CSS custom.
- Un preprocesador (Sass/Less) con arquitectura de partials.
- CSS3 puro con variables nativas (custom properties) y un archivo por componente.

**Decisión tomada**
CSS3 puro, sin preprocesador ni framework, con variables CSS nativas centralizadas en `styles.css` y un archivo por componente (`navbar.css`, `banner.css`, `cards.css`, `gallery.css`, `contact.css`, `footer.css`), más `animations.css` y `responsive.css` como capas transversales.

**Justificación**
Un framework utilitario (Tailwind) fue descartado explícitamente en `docs/PROJECT.md` como restricción del proyecto — genera HTML con clases utilitarias difíciles de mapear a un sistema de diseño propio y añade una dependencia de build. Un preprocesador habría requerido herramientas de compilación, contradiciendo la simplicidad buscada en ADR-001. Las variables CSS nativas ya ofrecen el beneficio principal que se buscaría en Sass (tokens centralizados) sin necesitar herramientas adicionales, y son directamente compatibles con cualquier framework futuro (incluido Angular, que las consume igual que cualquier CSS).

**Consecuencias positivas**
- Cero dependencias de build para trabajar con estilos.
- Tokens de diseño centralizados y reutilizables (ver `docs/DESIGN_SYSTEM.md`), consumidos consistentemente por todos los archivos de componente.
- Migración a Angular no requiere "traducir" de un lenguaje de preprocesador a CSS estándar — ya es CSS estándar.

**Consecuencias negativas**
- Sin anidamiento nativo de selectores (a diferencia de Sass), lo que puede hacer algunos selectores más repetitivos.
- Sin *mixins* o funciones reutilizables más allá de lo que CSS nativo permite (`calc()`, `clamp()`, variables) — cualquier lógica más compleja debe resolverse con JavaScript o duplicación deliberada.

**Impacto en el proyecto**
Define los 9 archivos CSS del Sprint 1 y la totalidad del sistema de tokens documentado en `docs/DESIGN_SYSTEM.md`.

**Referencias**
`docs/DESIGN_SYSTEM.md` (sección 3, Variables CSS), `docs/PROJECT.md` (sección "Restricciones").

---

### ADR-004: JavaScript modular

- **Identificador**: ADR-004
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El sitio requiere comportamiento interactivo (navbar con scroll, galería filtrable, animaciones, formulario, WhatsApp flotante) sin backend ni framework de frontend todavía.

**Problema**
¿Cómo se organiza el JavaScript del sitio para que sea mantenible, sin contaminar el scope global, y razonablemente preparado para su futura traducción a servicios/componentes Angular?

**Alternativas consideradas**
- Un único archivo `main.js` con todas las funciones.
- Uso de un framework ligero (ej. Alpine.js) para manejar interactividad declarativa.
- JavaScript ES6 vanilla, modularizado por archivo (un archivo = una responsabilidad), usando el patrón *Module* (IIFE).

**Decisión tomada**
JavaScript ES6 vanilla sin librerías, con un archivo por responsabilidad (`navbar.js`, `gallery.js`, `whatsapp.js`, `animations.js`, `app.js`), cada uno envuelto en una función autoejecutable (IIFE) con `'use strict'`.

**Justificación**
Un único archivo `main.js` habría repetido el problema que ADR-002/003 ya resolvieron para CSS: falta de separación de responsabilidades. Alpine.js (u otra librería similar) fue descartado porque introduce una dependencia y una sintaxis declarativa en el HTML (atributos `x-data`, etc.) que no es JavaScript "puro" y que no se traduce directamente a Angular — sería aprender un patrón intermedio innecesario. El patrón *Module* (IIFE) es JavaScript estándar sin dependencias, evita contaminar el `scope` global (relevante porque los 5 archivos se cargan como `<script>` clásicos, no como módulos ES con `import`/`export`, para máxima compatibilidad sin necesidad de servidor con MIME types configurados), y su lógica de datos separada de la lógica de DOM (ver `gallery.js`) facilita conceptualmente la futura división en servicios (datos) y componentes (DOM/template) de Angular.

**Consecuencias positivas**
- Cada archivo es independiente y fácil de razonar de forma aislada.
- Sin contaminación de variables globales entre archivos.
- La estructura de datos centralizada en `gallery.js` (`GALLERIES`) ya anticipa la forma de un futuro servicio Angular que consuma una API REST.

**Consecuencias negativas**
- Sin *type checking* (a diferencia de TypeScript, que sí se usará en Angular) — errores de tipo solo se detectan en tiempo de ejecución.
- Sin sistema de módulos ES real (`import`/`export`) en esta fase, por la restricción de compatibilidad mencionada arriba — se evaluará como ADR aparte si se introduce un *bundler* mínimo antes de Angular, pero no está planeado (ver ADR-001, "preparar sin sobre-construir").

**Impacto en el proyecto**
Define los 5 archivos JS del Sprint 1 y el patrón de diseño documentado en `docs/ARCHITECTURE.md`, sección 2.4.

**Referencias**
`docs/ARCHITECTURE.md` (sección 2.4, Patrones de diseño aplicados), `CLAUDE.md` (sección 2.6).

---

### ADR-005: Estrategia de almacenamiento de imágenes mediante recursos locales

- **Identificador**: ADR-005
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El sitio necesita imágenes (banner, servicios, sedes, testimonios, íconos, logo) desde el Sprint 1, pero no existía fotografía real de Hogar Canitas Felices disponible al momento de construir el Home.

**Problema**
¿De dónde provienen las imágenes del sitio, considerando que no hay fotografía real disponible, y que el proyecto tiene una restricción explícita de no usar imágenes de bancos externos o de internet?

**Alternativas consideradas**
- Usar fotografías de bancos de imágenes gratuitos (ej. Unsplash, Pexels) como marcador temporal.
- Dejar las rutas de imagen vacías/rotas hasta contar con fotografía real.
- Generar ilustraciones vectoriales propias (SVG/JPG) como imágenes de referencia, explícitamente marcadas como temporales, almacenadas localmente en `img/`.

**Decisión tomada**
Todas las imágenes del sitio son recursos locales dentro de `img/`, organizados por tipo de contenido. Donde no existe fotografía real (Sprint 1), se generan ilustraciones de marca propias (con la paleta y tipografía del sistema de diseño), renderizadas como `.jpg`, con un watermark visible ("Imagen de referencia — reemplazar por fotografía real").

**Justificación**
Usar bancos de imágenes gratuitos fue descartado por decisión explícita del proyecto (`docs/PROJECT.md`, restricciones) — mostrar fotos de un lugar que no es el geriátrico real sería, además de un posible problema de licencia, un problema de honestidad hacia las familias que visitan el sitio. Dejar rutas rotas habría impedido validar el diseño real del sitio (composición, proporciones, legibilidad de texto sobre imagen). Generar ilustraciones propias con marca de agua explícita permite validar el 100% del diseño visual sin necesidad de fotografía real, sin arriesgar que una imagen de referencia se confunda con una final y termine publicada por error.

**Consecuencias positivas**
- Cero riesgo de infracción de derechos de autor de imágenes de terceros.
- El diseño completo del sitio es evaluable visualmente desde el Sprint 1, sin bloquear el desarrollo por falta de fotografía.
- El watermark hace explícita la naturaleza temporal de cada imagen, reduciendo el riesgo de que se publiquen por accidente en producción.

**Consecuencias negativas**
- El sitio no transmite el 100% de su impacto emocional/de confianza real hasta que se reemplacen las imágenes (una limitación reconocida, no oculta).
- Genera trabajo adicional de reemplazo en el Sprint 5, que debe planificarse y no darse por hecho automáticamente.

**Impacto en el proyecto**
Define el contenido actual de `img/banner/`, `img/servicios/`, `img/sedes/`, `img/testimonios/`; genera un criterio de aceptación explícito en el Sprint 5 de `docs/ROADMAP.md` ("ninguna imagen contiene el watermark").

**Referencias**
`docs/ROADMAP.md` (Sprint 5), `docs/PROJECT.md` (sección "Restricciones").

---

### ADR-006: Preparación para migración futura a Angular

- **Identificador**: ADR-006
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El proyecto tiene como visión de largo plazo convertirse en una aplicación Angular (ver `docs/PROJECT.md`), pero se construye inicialmente como sitio estático (ADR-001). Existe el riesgo de que ambas fases se traten como proyectos desconectados, obligando a un rediseño en la migración.

**Problema**
¿Qué decisiones deben tomarse durante la fase estática para que la migración a Angular sea una traducción de componentes y no una reescritura de diseño?

**Alternativas consideradas**
- No planificar la migración durante la fase estática; abordarla como un proyecto nuevo cuando llegue el momento.
- Construir la fase estática con Angular en mente solo a nivel de intención, sin convenciones concretas que lo garanticen.
- Establecer convenciones concretas y verificables (nomenclatura BEM, responsabilidad única por archivo, separación de datos y renderizado) que mapeen directamente a la arquitectura de componentes de Angular.

**Decisión tomada**
Adoptar convenciones concretas durante la fase estática — nomenclatura BEM, un componente visual = un archivo CSS + un archivo JS, y separación estricta entre datos (`GALLERIES` en `gallery.js`) y lógica de renderizado — diseñadas explícitamente para minimizar la reinterpretación de diseño al migrar a Angular.

**Justificación**
No planificar la migración habría sido coherente con "avanzar rápido ahora", pero contradice la visión de largo plazo del proyecto y genera alto riesgo de retrabajo costoso. Tener la intención sin convenciones concretas es insuficiente — las buenas intenciones no sobreviven la presión de un sprint con plazos ajustados sin un checklist objetivo detrás. Las convenciones concretas elegidas (BEM, responsabilidad única, separación de datos/renderizado) tienen la ventaja de aportar valor **incluso si la migración a Angular nunca ocurriera** — son buenas prácticas de todas formas — por lo que no es una apuesta unidireccional.

**Consecuencias positivas**
- El sitio estático funciona como especificación viva y validada de los futuros componentes Angular.
- Reduce significativamente el riesgo identificado en `docs/PROJECT.md` ("la migración a Angular termine reescribiendo en vez de traduciendo el diseño").
- Las convenciones adoptadas mejoran la calidad del sitio estático de forma independiente a la migración futura.

**Consecuencias negativas**
- Mayor esfuerzo inicial en el Sprint 1 comparado con escribir CSS/JS sin ninguna convención (ej. sin BEM, todo en un archivo).
- Riesgo de "over-engineering" si las convenciones se aplican de forma dogmática en casos donde no aportan valor real — mitigado por el principio "SOLID con criterio, no como dogma" (`CLAUDE.md`, sección 2.2).

**Impacto en el proyecto**
Condiciona la totalidad del código del Sprint 1 y la especificación de la Era 2 completa en `docs/ARCHITECTURE.md`, sección 3.

**Referencias**
`docs/ARCHITECTURE.md` (secciones 1 y 3.2), `CLAUDE.md` (sección 6).

---

### ADR-007: Preparación para backend — decisión de framework diferida

- **Identificador**: ADR-007
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El proyecto evolucionará hacia una plataforma con backend real (API REST, base de datos, autenticación, CMS), pero al momento de este registro **el framework de backend no está decidido** — se evalúan al menos Spring Boot (Java) y Python (Flask u otro framework equivalente). Sin embargo, el frontend estático (Sprint 1 en adelante) ya se está escribiendo, y necesita lineamientos para no acoplarse innecesariamente a las particularidades de un framework de backend específico antes de que exista esa decisión.

**Problema**
¿Cómo se prepara el frontend hoy para una futura integración de backend, sin comprometerse prematuramente a un framework específico y sin bloquear el desarrollo actual a la espera de esa decisión?

**Alternativas consideradas**
- Elegir el framework de backend ahora (en el Sprint 1-2), antes de tener el contrato de API definido con detalle.
- No pensar en el backend en absoluto durante la fase estática, y resolver la integración completa en el Sprint 8.
- Definir principios de preparación agnósticos de framework (forma de los datos, separación cliente/servidor, validación duplicada, endpoints públicos vs. protegidos) ahora, y diferir la elección del framework específico a un ADR posterior en el Sprint 6, con criterios de decisión ya esbozados.

**Decisión tomada**
Se definen principios de preparación para backend agnósticos de framework (ver `docs/ARCHITECTURE.md`, sección 3.3, y `CLAUDE.md`, sección 7) desde ahora. La elección formal entre Spring Boot y Python/Flask (u otra alternativa que surja) se difiere explícitamente a un ADR dedicado durante el Sprint 6, una vez exista el contrato de API REST completo (OpenAPI) y se pueda evaluar con información real de alcance.

**Justificación**
Elegir el framework ahora, sin el contrato de API definido ni el modelo de datos formalizado, habría sido una decisión prematura basada en preferencia más que en información — precisamente el tipo de decisión improvisada que este proyecto busca evitar (`CLAUDE.md`, regla 6). Ignorar el backend por completo durante la fase estática habría arriesgado que el frontend se diseñara de forma incompatible con cualquier backend razonable (ej. asumiendo acceso irrestricto a datos, sin distinguir endpoints públicos de protegidos). Definir principios agnósticos ahora, y diferir la elección específica, permite avanzar sin bloqueos y sin comprometerse antes de tiempo.

**Consecuencias positivas**
- El frontend actual (`gallery.js`, `app.js`) ya tiene una forma de datos y de validación razonable para conectarse a cualquiera de los dos candidatos sin retrabajo significativo.
- La decisión de framework se tomará con más información (contrato de API real) en vez de anticipadamente.
- Evita que el proyecto "se case" con un framework antes de necesitarlo, coherente con el principio de preparar sin sobre-construir.

**Consecuencias negativas**
- Algunas decisiones de detalle (ej. estructura exacta de carpetas del backend) quedan pendientes hasta el Sprint 6, lo que podría percibirse como ambigüedad si no se comunica bien (mitigado documentando explícitamente el estado "por definir" en todos los documentos relevantes, no dejándolo implícito).
- Requiere un ADR adicional en el Sprint 6 dedicado exclusivamente a esta elección, en vez de resolverlo todo en este registro.

**Impacto en el proyecto**
Afecta `docs/ARCHITECTURE.md` (sección 3.3), `docs/ROADMAP.md` (Sprint 6, entregable de ADR de framework de backend), y `CLAUDE.md` (sección 7). Este ADR quedará en estado `Reemplazado` por el ADR que se registre en el Sprint 6 cuando se tome la decisión definitiva de framework — no antes.

**Referencias**
`docs/ARCHITECTURE.md` (sección 3.3, tabla comparativa Spring Boot vs. Python), `docs/ROADMAP.md` (Sprint 6).

---

### ADR-008: Diseño Mobile First y Responsive

- **Identificador**: ADR-008
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El sitio debe funcionar correctamente en celular, tablet, portátil y monitor grande (requisito explícito de `docs/PROJECT.md`), y una parte relevante del público objetivo (familiares que consultan el sitio en momentos informales, posiblemente desde el celular durante o después de una visita presencial) accede probablemente desde dispositivos móviles.

**Problema**
¿Se diseña el CSS pensando primero en escritorio y "adaptando hacia abajo", o pensando primero en móvil y "expandiendo hacia arriba"?

**Alternativas consideradas**
- Desktop-first: diseñar para escritorio y usar *media queries* `max-width` para adaptar hacia pantallas menores.
- Mobile-first: diseñar la base para móvil y usar *media queries* `min-width` para expandir hacia pantallas mayores.
- Sin metodología explícita, resolviendo cada componente de forma ad-hoc según se necesite.

**Decisión tomada**
Mobile-first como principio de diseño (definido en `CLAUDE.md`, sección 3), aunque la implementación técnica actual de `responsive.css` usa *media queries* `max-width` cargadas al final de la cascada (ver nota de consecuencias negativas).

**Justificación**
Mobile-first obliga a resolver primero el caso más restrictivo (pantalla pequeña, menos espacio, posible conexión más lenta), lo que generalmente produce interfaces más simples y con mejor jerarquía de contenido — es más fácil añadir complejidad para pantallas grandes que quitarla de un diseño pensado para escritorio. Es también el enfoque recomendado por defecto en el ecosistema Angular/Material y en la mayoría de guías de diseño responsive modernas.

**Consecuencias positivas**
- Fuerza priorización de contenido: lo que se decide mostrar primero en móvil es, por definición, lo más importante.
- Mejor experiencia base para el segmento de usuarios que accede desde celular.

**Consecuencias negativas**
- **Inconsistencia técnica reconocida**: el CSS base de los componentes (`cards.css`, `gallery.css`, etc.) está escrito asumiendo grids de escritorio (ej. `grid-template-columns: repeat(4, 1fr)` en `why__grid`), y `responsive.css` usa `max-width` para *reducir* columnas en pantallas menores — es decir, la **implementación actual es técnicamente desktop-first en su cascada**, aunque el resultado final sea responsive y usable en todos los dispositivos. Esto se documenta aquí de forma honesta como una desviación entre el principio (mobile-first) y la implementación (cascada `max-width`), sin ocultarlo. Se evaluará corregir esta inconsistencia técnica en un sprint futuro si se considera de valor, registrándolo como un nuevo ADR si se decide cambiar el enfoque de la cascada CSS.

**Impacto en el proyecto**
Afecta la totalidad de `css/responsive.css` y las reglas de `CLAUDE.md`, sección 3.

**Referencias**
`css/responsive.css`, `docs/DESIGN_SYSTEM.md` (sección 7, Breakpoints).

---

### ADR-009: Uso de HTML semántico y criterios de accesibilidad

- **Identificador**: ADR-009
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
El público objetivo incluye potencialmente al propio adulto mayor (ver `docs/PROJECT.md`, público objetivo), y en general personas con distintas capacidades visuales, motoras y de familiaridad tecnológica. El proyecto además tiene como restricción explícita evitar `<table>` para layout y priorizar buenas prácticas desde el inicio.

**Problema**
¿Qué nivel de accesibilidad y semántica HTML se implementa desde el Sprint 1, considerando que agregarla retroactivamente en sprints posteriores suele ser más costoso que construirla desde el inicio?

**Alternativas consideradas**
- Tratar la accesibilidad como una mejora a implementar "cuando haya tiempo", priorizando velocidad de entrega del diseño visual.
- Cumplir accesibilidad de forma mínima/superficial (solo `alt` en imágenes, sin ARIA ni foco gestionado).
- Tratar accesibilidad como requisito no negociable desde el Sprint 1: HTML semántico, ARIA donde corresponda, gestión de foco, contraste validado, soporte de `prefers-reduced-motion`.

**Decisión tomada**
Accesibilidad como requisito no negociable desde el Sprint 1 (ver `CLAUDE.md`, sección 4, y `docs/DESIGN_SYSTEM.md`, sección 12), con nivel objetivo WCAG AA (formalizado con métricas concretas en `docs/NFR.md`).

**Justificación**
Tratar la accesibilidad como mejora posterior es la causa más común de que nunca se implemente realmente — una vez el sitio "funciona" para el caso general, rara vez se revisita con el mismo rigor. Cumplirla de forma mínima no habría sido coherente con el público objetivo real del proyecto (incluye explícitamente al adulto mayor, no solo a sus hijos). Tratarla como requisito desde el inicio tiene mayor costo inmediato pero evita una deuda técnica difícil de pagar retroactivamente (agregar ARIA y gestión de foco a un sitio ya construido sin esos criterios suele requerir reescribir componentes, no solo añadir atributos).

**Consecuencias positivas**
- El sitio es usable por teclado, con lectores de pantalla, y respeta preferencias de movimiento reducido desde el día uno.
- Reduce el riesgo legal/reputacional asociado a un sitio de salud/cuidado poco accesible.
- Establece un estándar objetivo (WCAG AA) contra el cual medir, en vez de una noción subjetiva de "suficientemente accesible".

**Consecuencias negativas**
- Mayor tiempo de desarrollo por componente (ej. implementar el patrón WAI-ARIA completo de tabs en la galería, en vez de un `onclick` simple).
- Requiere revisión activa y continua — la accesibilidad se puede romper fácilmente con cambios futuros descuidados si no se mantiene disciplina (mitigado por el checklist de `CLAUDE.md`, sección 10).

**Impacto en el proyecto**
Afecta la totalidad del HTML del sitio y establece el criterio de aceptación de accesibilidad presente en cada sprint de `docs/ROADMAP.md`.

**Referencias**
`docs/DESIGN_SYSTEM.md` (sección 12), `docs/NFR.md` (sección Accesibilidad).

---

### ADR-010: Estrategia de SEO técnico desde el inicio del proyecto

- **Identificador**: ADR-010
- **Fecha**: 2026-08-01
- **Estado**: Aprobado

**Contexto**
Hogar Canitas Felices depende de ser encontrado por familias que buscan activamente un hogar geriátrico — el sitio no tiene valor si no es descubrible. El proyecto se construye por sprints, con contenido real llegando recién en el Sprint 5.

**Problema**
¿Se implementa SEO técnico desde el Sprint 1 (sobre contenido de referencia) o se pospone hasta el Sprint 5, cuando el contenido real esté disponible?

**Alternativas consideradas**
- Posponer todo SEO hasta el Sprint 5, cuando exista contenido definitivo, para no tener que revisar metadatos dos veces.
- Implementar SEO técnico (estructura semántica, metadatos, Open Graph) desde el Sprint 1, aunque el contenido específico se actualice después.
- Ignorar SEO como responsabilidad de un especialista externo fuera del alcance de este proyecto.

**Decisión tomada**
Implementar SEO técnico estructural desde el Sprint 1 (HTML semántico, un `h1` por página, metadatos `title`/`description`/Open Graph ya presentes en `index.html`, aunque su contenido textual se refine en sprints posteriores), dejando el SEO de contenido más avanzado (sitemap, robots.txt, Schema.org) formalmente planificado para el Sprint 5 en `docs/ROADMAP.md`.

**Justificación**
Posponer todo el SEO técnico habría significado construir el HTML del Sprint 1 sin pensar en su estructura semántica, y luego tener que revisar/reescribir esa estructura en el Sprint 5 — más costoso que hacerlo bien desde el inicio. La estructura semántica y los metadatos base no dependen del contenido final, solo de la arquitectura de información de la página — por lo que implementarlos ahora no genera retrabajo real más adelante, solo actualización de texto. Ignorar el SEO como fuera de alcance habría sido incoherente con el objetivo de negocio explícito del proyecto (captación de nuevos residentes vía canal propio, ver `docs/PROJECT.md`, sección Beneficios).

**Consecuencias positivas**
- La estructura semántica correcta ya está validada desde el Sprint 1, sin deuda técnica de SEO estructural pendiente.
- El Sprint 5 puede enfocarse en SEO de contenido (sitemap, Schema.org, palabras clave reales) sin tener que arreglar problemas estructurales de fondo primero.

**Consecuencias negativas**
- Los metadatos actuales (`title`, `description`) están escritos sobre contenido y estructura de información aún no validados con el negocio real, por lo que es probable que requieran ajuste de texto (no de estructura) en el Sprint 5.
- No existen todavía `sitemap.xml`, `robots.txt` ni datos estructurados Schema.org — están correctamente diferidos al Sprint 5, no implementados parcialmente de forma apresurada ahora.

**Impacto en el proyecto**
Afecta el `<head>` de `index.html` y establece el criterio de aceptación de SEO del Sprint 5 en `docs/ROADMAP.md`.

**Referencias**
`docs/NFR.md` (sección SEO), `docs/ROADMAP.md` (Sprint 5), `CLAUDE.md` (sección 5).

---

---

### ADR-011: Namespace global único para comunicación entre módulos IIFE

- **Identificador**: ADR-011
- **Fecha**: 2026-08-02
- **Estado**: Aprobado

**Contexto**
El sprint de funcionalidades JavaScript introdujo la primera necesidad real de que un archivo JS consuma código de otro (`navbar.js`, `loader.js`, `scroll.js`, `gallery.js`, `form.js` necesitan usar `utils.js`; `gallery.js` necesita invocar `lightbox.js`). Hasta este punto (Sprint 1), cada archivo era autocontenido y esto nunca se había necesitado.

**Problema**
¿Cómo comparten código y se comunican los archivos JS entre sí, dado que ADR-004 ya descartó `import`/`export` (módulos ES) por compatibilidad con abrir el sitio vía `file://` sin servidor?

**Alternativas consideradas**
- Adoptar módulos ES (`import`/`export`) para este caso puntual, aceptando romper la compatibilidad `file://` documentada en ADR-004 y en `README.md`.
- Múltiples variables globales sueltas, una por módulo que necesite exponer algo (ej. `window.utilsDebounce`, `window.lightboxOpen`).
- Un único objeto global de namespace (`window.CanitasFelices`), con cada módulo colgando su API pública de una propiedad propia (`CanitasFelices.utils`, `CanitasFelices.lightbox`, `CanitasFelices.form`, `CanitasFelices.faq`).

**Decisión tomada**
Un único objeto global `window.CanitasFelices`, inicializado de forma idempotente al inicio de cualquier archivo que lo necesite (`window.CanitasFelices = window.CanitasFelices || {}`), con cada módulo exponiendo su API bajo su propia propiedad.

**Justificación**
Adoptar módulos ES habría contradicho ADR-004 sin registrar formalmente por qué se abandona esa decisión — y de hecho el problema de compatibilidad `file://` que motivó ADR-004 sigue vigente, no desapareció. Múltiples variables globales sueltas técnicamente funcionan, pero es exactamente lo que la regla "no utilizar variables globales" (`CLAUDE.md` §2.3) busca evitar — cada nueva variable es una fuente adicional de posibles colisiones de nombres. Un único namespace introduce **una sola** variable global para todo el proyecto, y dentro de ella la organización por módulo (`CanitasFelices.utils`, `CanitasFelices.lightbox`, etc.) preserva la misma separación de responsabilidades que ya existe a nivel de archivo.

**Consecuencias positivas**
- Cero variables globales sueltas adicionales — solo una, documentada y predecible.
- Los módulos que consumen otros (ej. `gallery.js` usando `CanitasFelices.lightbox`) lo hacen con verificación defensiva (`if (lightbox && typeof lightbox.open === 'function')`), preservando el patrón "Fail-safe defaults" ya establecido (ADR-004): si un módulo no cargó, los demás no se rompen.
- El patrón es trivialmente descartable al migrar a Angular: cada propiedad del namespace se convierte en un servicio inyectable independiente: el namespace nunca se vuelve una dependencia estructural profunda.

**Consecuencias negativas**
- Depende estrictamente del **orden de carga** de los `<script>` en `index.html`: un módulo que use `CanitasFelices.utils` debe cargar después de `utils.js`. Esto ya se documentó explícitamente como comentario de cabecera en cada archivo que lo requiere, pero es una responsabilidad manual, no verificada automáticamente por ninguna herramienta en esta fase del proyecto.
- Si el proyecto creciera mucho más en la Era 1 (más módulos interdependientes de los que hay hoy), este patrón se volvería menos manejable que un sistema de módulos real — señal de que, en ese escenario, correspondería reconsiderar ADR-004 con su propio registro, no forzar más namespace.

**Impacto en el proyecto**
Afecta `js/utils.js`, `js/lightbox.js`, `js/form.js`, `js/faq.js` (los módulos que exponen API pública), y a cualquier consumidor (`navbar.js`, `loader.js`, `scroll.js`, `gallery.js`). Se documenta también en `docs/ARCHITECTURE.md` §2.4.

**Referencias**
ADR-004 (JavaScript modular), `docs/ARCHITECTURE.md` §2.4, `CLAUDE.md` §2.3.

---

## 4. Nota sobre la evolución de este documento

Este documento consolida todos los ADR en un único archivo mientras el proyecto es de tamaño manejable. Si el número de ADR crece significativamente (aproximadamente más de 25-30 registros), se evaluará —mediante su propio ADR— dividir este archivo en `docs/adr/ADR-XXX-titulo.md` individuales, manteniendo este archivo como índice. Ese cambio de formato no altera el contenido ni la numeración ya asignada.

---

*Fin de ADR.md.*
