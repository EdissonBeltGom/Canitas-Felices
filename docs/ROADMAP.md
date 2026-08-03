# ROADMAP.md — Hogar Canitas Felices

> Planificación oficial del proyecto, dividida en 9 sprints (originalmente 8 — ver nota de reconciliación al final de este documento). Este documento responde **qué se construye en cada sprint y cómo se valida que quedó bien hecho** — no reemplaza a `PROJECT.md` (visión) ni a `ARCHITECTURE.md` (cómo), sino que los aterriza en el tiempo. Ningún sprint debe iniciar sin que el anterior cumpla sus criterios de aceptación.

---

## Resumen general

| Sprint | Nombre | Estado | Duración estimada |
|---|---|---|---|
| 1 | Home estático | ✅ Completado | 2 semanas |
| 2 | Documentación técnica y funcional | ✅ Completado | 1 semana |
| 3 | Funcionalidades JavaScript e interactividad | ✅ Completado | 2 semanas |
| 4 | Páginas internas del sitio estático | ⏳ Planificado | 2 semanas |
| 5 | Contenido real, formulario e integraciones | ⏳ Planificado | 2 semanas |
| 6 | Preparación de la migración | ⏳ Planificado | 1.5 semanas |
| 7 | Migración a Angular | ⏳ Planificado | 3 semanas |
| 8 | Backend (framework a definir) y CMS inicial | ⏳ Planificado | 4 semanas |
| 9 | Integración, calidad y lanzamiento | ⏳ Planificado | 2.5 semanas |

> Las duraciones son estimaciones de planificación (no compromisos contractuales) y asumen dedicación parcial/intermitente, consistente con un proyecto desarrollado de forma incremental. Se ajustarán con datos reales al cierre de cada sprint.

---

## Sprint 1 — Home estático ✅

**Objetivo**
Construir la página de inicio (Home) completa, responsive y funcional, usando exclusivamente HTML5, CSS3 y JavaScript ES6, estableciendo las convenciones de arquitectura, nomenclatura y diseño que regirán el resto del proyecto.

**Duración estimada**: 2 semanas

**Entregables**
- `index.html` completo y semántico.
- 9 archivos CSS separados por responsabilidad (`styles`, `navbar`, `banner`, `cards`, `gallery`, `contact`, `footer`, `animations`, `responsive`).
- 5 archivos JS separados por responsabilidad (`navbar`, `gallery`, `whatsapp`, `animations`, `app`).
- Set completo de íconos SVG propios (13 íconos).
- Logotipo (versión color + versión blanca) y favicon.
- Imágenes de referencia para banner, servicios, sedes y testimonios (marcadas explícitamente como temporales).

**Criterios de aceptación**
- El sitio se visualiza correctamente en móvil, tablet, portátil y monitor grande, sin scroll horizontal ni elementos rotos.
- Ningún archivo CSS o JavaScript está embebido en el HTML.
- La navbar cambia de estado correctamente al hacer scroll y el menú móvil funciona con teclado y mouse.
- La galería filtra correctamente por sede sin recargar la página.
- El formulario de contacto valida los 4 campos y muestra mensajes de error/éxito accesibles.
- Todas las rutas de imágenes referenciadas en el código corresponden a archivos existentes (verificado programáticamente).

**Dependencias**
Ninguna — es el punto de partida del proyecto.

**Riesgos**
- Confusión de nombres de carpeta entre entornos (ej. `css` vs `ccs`) — **materializado y resuelto** durante el sprint; se documenta como lección aprendida para `CONTRIBUTING.md`.
- Falta de fotografía real retrasando la percepción de "sitio terminado" — mitigado con imágenes de referencia claramente marcadas.

**Resultado esperado**
Una maqueta de producción real, no descartable, que sirve como referencia visual y funcional para todos los sprints siguientes, incluida la futura migración a Angular.

---

## Sprint 2 — Documentación técnica y funcional ✅

**Objetivo**
Construir toda la documentación técnica y funcional del proyecto (`PROJECT.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `README.md`, `ADR.md`, `NFR.md`) antes de continuar desarrollando funcionalidad nueva, para evitar decisiones improvisadas en los sprints restantes.

**Duración estimada**: 1 semana

**Entregables**
- Los 10 documentos listados arriba, completos y con calidad enterprise.
- Registro inicial de 10 ADR (ADR-001 a ADR-010) documentando decisiones ya tomadas en el Sprint 1.
- `NFR.md` con métricas concretas y verificables de calidad.

**Criterios de aceptación**
- Cada documento cubre, como mínimo, todas las secciones solicitadas en su especificación original.
- No existe código HTML/CSS/JS dentro de ningún documento de esta lista (son documentos de especificación, no de implementación).
- Las decisiones documentadas en `ADR.md` son consistentes con lo ya implementado en el Sprint 1 (verificable contra el código real).
- `ROADMAP.md` (este documento) cubre los 8 sprints completos, sin dejar sprints futuros sin definir.
- Un colaborador nuevo podría, leyendo solo esta documentación, entender el propósito, la arquitectura y las convenciones del proyecto sin necesidad de leer el código primero.

**Dependencias**
Sprint 1 completado (la documentación describe y formaliza decisiones ya tomadas, no hipotéticas).

**Riesgos**
- Documentación que se desactualiza apenas empieza el Sprint 3 — mitigado estableciendo en `CLAUDE.md` la regla de actualizar documentación en el mismo sprint en que ocurre un cambio estructural.
- Exceso de documentación que nadie mantiene — mitigado priorizando documentos con uso operativo real (`CLAUDE.md`, `ADR.md`) sobre documentación decorativa.

**Resultado esperado**
Una base documental completa que actúa como fuente de verdad durante el resto del proyecto, reduciendo la dependencia de conocimiento implícito no escrito.

---

## Sprint 3 — Funcionalidades JavaScript e interactividad ✅

**Objetivo**
Convertir el Home estático del Sprint 1 en una experiencia moderna e interactiva, implementando todas las funcionalidades de comportamiento (navbar inteligente, animaciones, galería con lightbox, formulario, FAQ, loader) sin modificar la arquitectura, el sistema de diseño ni el contenido ya construidos.

**Duración estimada**: 2 semanas

**Entregables**
- `js/utils.js`: utilidades compartidas (`debounce`, `throttle`, `lockScroll`/`unlockScroll`, `trapFocus`), base del resto de módulos, expuestas vía el namespace global `window.CanitasFelices` (ver ADR-011).
- `js/loader.js` + `css/loader.css`: pantalla de carga inicial.
- `navbar.js` extendido: indicador de sección activa, scroll suave con foco accesible.
- `animations.js`/`animations.css` extendidos: variantes `scale`/`reveal`, `data-duration`/`data-delay`.
- Mejoras del Hero: corrección de contraste de foco, aparición progresiva completa, documentación de compatibilidad futura con un slider.
- `js/scroll.js`: botón "volver arriba".
- `whatsapp.js` extendido: configuración centralizada, tooltip.
- `js/lightbox.js` + `css/lightbox.css`: modal de galería completo.
- `gallery.js` extendido: integración con el lightbox, precarga de sede no visible.
- `js/form.js`: formulario separado de `app.js`, con estados de carga/error, preparado para API.
- `js/faq.js` + `css/faq.css`: acordeón accesible, construido y listo, **sin agregarse a `index.html`** (pendiente de contenido real, se usará en el Sprint 4).

**Criterios de aceptación**
- Ninguna funcionalidad nueva requirió modificar la arquitectura de archivos, el sistema de diseño (tokens de `DESIGN_SYSTEM.md`) ni romper compatibilidad con el HTML/CSS del Sprint 1.
- Todos los componentes interactivos cumplen: foco visible, ARIA correcto, operables por teclado (Tab, Shift+Tab, Escape, flechas según corresponda).
- El sitio sigue siendo funcional si JavaScript falla parcialmente (los 4 enlaces de WhatsApp y el envío nativo del formulario conservan un `href`/comportamiento de respaldo).
- Cada funcionalidad fue validada manualmente antes de continuar con la siguiente (ver el detalle de pruebas manuales entregado en el chat de desarrollo de este sprint).
- Toda decisión de arquitectura nueva (namespace global) quedó registrada como ADR (ADR-011) antes de darse por completada.

**Dependencias**
Sprint 1 (arquitectura, sistema de diseño y HTML/CSS base sobre los que se implementó todo) y Sprint 2 (documentación de referencia, especialmente `ARCHITECTURE.md` y `CLAUDE.md`, consultada activamente durante la implementación).

**Riesgos**
- Que las nuevas variantes de animación o el sistema de temporización personalizado (`data-duration`/`data-delay`) generaran una segunda convención en conflicto con la ya documentada (`data-animate`) — mitigado extendiendo la convención existente en vez de introducir una paralela (decisión validada explícitamente antes de implementar).
- Que la comunicación entre módulos JS (necesaria por primera vez en este sprint) llevara a introducir múltiples variables globales sueltas — mitigado con el namespace único `window.CanitasFelices` (ADR-011).
- Que este sprint no estuviera contemplado en la numeración original de `ROADMAP.md` — **materializado**: se ejecutó sin número de sprint asignado y se reconcilió la numeración completa (Sprints 4–9) después de completarlo, en vez de antes. Queda documentado aquí como lección para sprints futuros: todo trabajo nuevo debe registrarse en este documento *antes* de ejecutarse, no después.

**Resultado esperado**
El mismo Home del Sprint 1, visualmente idéntico, pero completamente interactivo: navegación inteligente, animaciones fluidas, galería profesional con lightbox, formulario con estados reales, y una base de utilidades (`utils.js`) y un componente FAQ listos para los sprints siguientes.

---

## Sprint 4 — Páginas internas del sitio estático ⏳

**Objetivo**
Extender el sitio estático más allá del Home, construyendo las páginas internas necesarias para que el sitio sea un producto completo de cara al público: Nosotros, Servicios (detalle), Sedes (detalle por sede).

**Duración estimada**: 2 semanas

**Entregables**
- `nosotros.html`, `servicios.html` (o detalle por servicio, a definir según necesidad de SEO), `sedes.html` (o detalle por sede: `sede-la-pampa.html`, `sede-campestre.html`).
- Componentes compartidos (navbar, footer) reutilizados sin duplicar CSS/JS — evaluación de si requieren extraerse a includes o mantenerse duplicados conscientemente (limitación conocida del HTML estático sin *build tool*, a documentar como ADR si aplica).
- Actualización de la navegación del Home para enlazar correctamente a las nuevas páginas.

**Criterios de aceptación**
- Cada página nueva sigue exactamente el mismo sistema de diseño documentado en `DESIGN_SYSTEM.md`, sin introducir estilos ad-hoc.
- La navegación (navbar, footer, breadcrumbs si aplican) es consistente entre todas las páginas del sitio.
- Cada página tiene sus propios metadatos SEO (`title`, `description`, Open Graph) específicos a su contenido — no se reutiliza el meta del Home.
- Todas las páginas nuevas pasan los mismos criterios de responsive y accesibilidad ya validados en el Sprint 1.

**Dependencias**
Sprint 1 (sistema de diseño y componentes base), Sprint 2 (documentación de referencia) y Sprint 3 (los módulos JS ya construidos — `navbar.js`, `utils.js`, `animations.js`, etc. — se reutilizan tal cual en las páginas nuevas, vía los mismos `<script>`, sin duplicar lógica).

**Riesgos**
- Duplicación de código (navbar/footer) entre páginas al no existir un sistema de *templating* en HTML estático puro — riesgo real y esperado en esta fase; se documentará como deuda técnica intencional que se resuelve naturalmente en la migración a Angular (Sprint 7), no antes.
- Inconsistencia de contenido/tono entre páginas escritas en momentos distintos — mitigado con una guía de tono de contenido a incorporar en este sprint si no existe aún.

**Resultado esperado**
Un sitio estático multi-página, completo desde la perspectiva de un visitante, listo para recibir contenido y datos de contacto reales en el Sprint 5.

---

## Sprint 5 — Contenido real, formulario e integraciones ⏳

**Objetivo**
Reemplazar el contenido e imágenes de referencia por contenido real de Hogar Canitas Felices, conectar el formulario de contacto a un servicio de envío funcional, e integrar Google Maps en reemplazo del marcador de posición.

**Duración estimada**: 2 semanas

**Entregables**
- Fotografías reales en todas las rutas actualmente ocupadas por imágenes de referencia.
- Textos definitivos revisados por el negocio (no placeholder).
- Formulario de contacto conectado a un servicio de envío de correo (o backend mínimo transitorio) — solución explícitamente marcada como transitoria si el backend definitivo (Sprint 8) aún no existe.
- Integración de Google Maps embebido, reemplazando `.contact__map-placeholder`.
- Auditoría y corrección de SEO técnico (sitemap.xml, robots.txt, datos estructurados Schema.org).

**Criterios de aceptación**
- Ninguna imagen del sitio contiene el watermark "Imagen de referencia — reemplazar por fotografía real".
- El formulario de contacto entrega los mensajes a un canal real y verificable (correo, hoja de cálculo, o similar) — probado con un envío real de extremo a extremo.
- El mapa de Google Maps muestra la ubicación correcta de al menos una sede, es interactivo y respeta el diseño (`border-radius`, proporciones) definido en `contact.css`.
- Lighthouse (SEO) reporta un puntaje igual o superior al definido en `NFR.md`.

**Dependencias**
Sprint 4 (páginas internas donde también aplican imágenes y contenido reales) y disponibilidad de material fotográfico/textual por parte del negocio (riesgo ya identificado en `PROJECT.md`).

**Riesgos**
- Retraso por falta de entrega de fotografías/textos reales por parte del cliente — mitigado permitiendo lanzar por secciones (ej. Home con fotos reales, páginas internas aún con referencia) en vez de bloquear todo el sprint.
- Límites de cuota gratuita en el servicio de envío de formulario elegido — a evaluar según volumen esperado antes de decidir la solución transitoria.

**Resultado esperado**
Un sitio listo para producción desde la perspectiva de contenido y funcionalidad de contacto, sin backend propio todavía.

---

## Sprint 6 — Preparación de la migración ⏳

**Objetivo**
Auditar el sitio estático existente, definir formalmente el contrato de API REST, y tomar las decisiones arquitectónicas pendientes (base de datos, autenticación, estructura de proyecto Angular) antes de iniciar la migración.

**Duración estimada**: 1.5 semanas

**Entregables**
- Auditoría de componentes: inventario completo de cada bloque visual del sitio estático mapeado a su futuro componente Angular.
- Especificación OpenAPI del contrato de API REST previsto en `ARCHITECTURE.md`.
- ADR formalizando: **framework de backend** (Spring Boot vs. Python/Flask u otro — ver `ARCHITECTURE.md`, sección 3.3), motor de base de datos, herramienta de migraciones, estrategia de almacenamiento de tokens JWT, versión de Angular a utilizar.
- Modelo de datos definitivo (esquema con tipos, índices, restricciones) a partir del diagrama entidad-relación preliminar de `ARCHITECTURE.md`.

**Criterios de aceptación**
- Cada componente visual identificado en el sitio estático tiene un nombre de componente Angular propuesto y documentado (ej. `ServiceCardComponent`).
- El contrato OpenAPI cubre el 100% de los endpoints listados en `ARCHITECTURE.md`, sección 3.5.
- Todas las decisiones pendientes marcadas como "a definir en ADR" en `ARCHITECTURE.md` quedan resueltas y registradas.
- El equipo (o agente) que ejecute el Sprint 7 puede iniciar sin bloqueos de decisión arquitectónica.

**Dependencias**
Sprint 5 completado (el contenido y la estructura del sitio deben estar estables antes de auditar componentes para migrar).

**Riesgos**
- Sub-estimar la complejidad de trasladar la lógica de `gallery.js` (filtrado por sede) a un servicio Angular con datos remotos — mitigado dedicando tiempo explícito de diseño a este componente en particular.
- Decisiones de base de datos tomadas sin considerar el volumen real de datos esperado — mitigado documentando supuestos de volumen en el ADR correspondiente.

**Resultado esperado**
Un plan de migración sin ambigüedades, que convierte el Sprint 7 en un ejercicio de implementación disciplinada en vez de diseño sobre la marcha.

---

## Sprint 7 — Migración a Angular ⏳

**Objetivo**
Reconstruir el frontend como aplicación Angular, replicando fielmente el diseño, contenido y comportamiento ya validados en el sitio estático, consumiendo datos mockeados o estáticos como paso intermedio antes de conectar con el backend real (Sprint 8).

**Duración estimada**: 3 semanas

**Entregables**
- Proyecto Angular inicializado según la estructura definida en `ARCHITECTURE.md`, sección 4.
- Todos los componentes identificados en el Sprint 6 implementados y funcionando con datos mockeados.
- Sistema de diseño trasladado a Angular (variables CSS reutilizadas sin cambios, o adaptadas a la estrategia de estilos de Angular que se decida — global styles vs. estilos por componente).
- Routing funcional entre Home y páginas internas.

**Criterios de aceptación**
- La aplicación Angular es visualmente indistinguible del sitio estático para un usuario final (paridad visual verificada componente por componente).
- Todos los criterios de accesibilidad y responsive ya validados en Sprints 1 y 3 se mantienen sin regresión.
- El código Angular sigue las convenciones de nomenclatura ya establecidas (adaptadas al framework) sin reinterpretar el sistema de diseño.
- Lighthouse (rendimiento, accesibilidad) no retrocede respecto a la línea base del sitio estático.

**Dependencias**
Sprint 6 completado (contrato de componentes y decisiones arquitectónicas resueltas).

**Riesgos**
- Tentación de "mejorar" o rediseñar componentes durante la migración en vez de replicarlos — riesgo explícitamente prohibido por `CLAUDE.md` ("no cambiar la arquitectura definida" sin ADR); se mitiga con revisión de paridad visual antes de cerrar el sprint.
- Curva de aprendizaje de Angular si el equipo ejecutor no tiene experiencia previa — mitigado con la documentación exhaustiva ya construida como referencia.

**Resultado esperado**
Una aplicación Angular funcional y visualmente fiel al sitio original, lista para conectarse a un backend real.

---

## Sprint 8 — Backend y CMS inicial ⏳

**Objetivo**
Construir el backend (en el framework decidido durante el Sprint 6 — Spring Boot o Python/Flask, según ADR) con API REST funcional, base de datos, autenticación, y un panel administrativo inicial (CMS) que permita gestionar servicios, sedes, galería y testimonios.

**Duración estimada**: 4 semanas

**Entregables**
- Proyecto de backend, en el framework decidido en el Sprint 6, con la estructura en capas definida en `ARCHITECTURE.md`.
- Endpoints REST completos según el contrato OpenAPI del Sprint 6.
- Base de datos con migraciones versionadas y datos semilla (seed data) para desarrollo.
- Autenticación JWT funcional para el panel administrativo.
- Módulo/aplicación administrativa en Angular (lazy-loaded) con formularios CRUD para servicios, sedes, galería y testimonios.
- Frontend público (Sprint 7) migrado de datos mockeados a datos reales vía API.

**Criterios de aceptación**
- Todos los endpoints públicos responden sin autenticación; todos los endpoints administrativos rechazan solicitudes sin JWT válido.
- El panel administrativo permite crear, editar y eliminar al menos: un servicio, una sede, una imagen de galería y un testimonio — validado de extremo a extremo (creación en el panel visible inmediatamente en el sitio público).
- Las validaciones de backend (mecanismo específico según el framework elegido — Bean Validation, Marshmallow/Pydantic, u otro) son consistentes con las ya implementadas en el cliente durante el Sprint 1 (mismas reglas, no contradictorias).
- Cobertura de pruebas automatizadas mínima definida en `NFR.md` para controladores y servicios críticos.

**Dependencias**
Sprint 7 completado (frontend Angular listo para consumir la API en vez de datos mockeados).

**Riesgos**
- Alcance del CMS creciendo más allá de lo definido en `PROJECT.md` ("Funcionalidades futuras") durante el desarrollo — mitigado revisando el alcance contra `PROJECT.md` antes de aceptar nuevas features dentro de este sprint.
- Seguridad insuficiente en la primera versión del panel administrativo — mitigado con revisión explícita contra `NFR.md`, sección Seguridad, antes de considerar el sprint cerrado.

**Resultado esperado**
Una plataforma completa (frontend público + backend + CMS) funcionando de extremo a extremo en un entorno de desarrollo/staging.

---

## Sprint 9 — Integración, calidad y lanzamiento ⏳

**Objetivo**
Consolidar la integración completa frontend-backend, ejecutar pruebas de calidad exhaustivas, contenerizar la aplicación y desplegarla en producción.

**Duración estimada**: 2.5 semanas

**Entregables**
- `Dockerfile` para frontend y backend, `docker-compose.yml` para orquestación local/staging.
- Pipeline de despliegue (CI/CD) documentado, al menos en su versión inicial.
- Entorno de producción desplegado en el proveedor de nube decidido (ADR pendiente de Sprint 6/8).
- Checklist de `NFR.md` verificado íntegramente contra el entorno de producción real (no solo desarrollo).
- Documentación actualizada (`README.md`, `CHANGELOG.md` con la primera versión formal) reflejando el estado de lanzamiento.

**Criterios de aceptación**
- La aplicación es accesible públicamente en su dominio de producción, con HTTPS activo.
- Todos los objetivos de calidad definidos en `NFR.md` (rendimiento, accesibilidad, SEO, seguridad) se cumplen en el entorno de producción, no solo en desarrollo.
- El panel administrativo es funcional y accesible únicamente para usuarios autenticados en producción.
- `CHANGELOG.md` refleja la primera versión formal del proyecto (ej. `1.0.0`) siguiendo el estándar Keep a Changelog.
- Existe un procedimiento documentado de rollback en caso de fallo post-despliegue.

**Dependencias**
Sprint 8 completado (backend y CMS funcionales en entorno de desarrollo/staging).

**Riesgos**
- Diferencias de comportamiento entre entorno de desarrollo y producción (variables de entorno, CORS, certificados) — mitigado con un entorno de staging que replique producción antes del lanzamiento final.
- Falta de plan de monitoreo post-lanzamiento — mitigado incorporando observabilidad básica (logs, métricas mínimas) como parte de los entregables de este sprint, no como una fase posterior no planificada.

**Resultado esperado**
Hogar Canitas Felices en producción: sitio público, backend y panel administrativo funcionando de forma estable, documentada y mantenible, cumpliendo la definición de éxito del proyecto establecida en `PROJECT.md`.

---

## Gestión de cambios sobre este roadmap

- Si un sprint no cumple sus criterios de aceptación al cierre, no se avanza al siguiente sin una decisión explícita documentada (extender el sprint actual vs. mover el criterio incumplido al backlog del siguiente, con justificación).
- Cualquier sprint nuevo no contemplado aquí debe agregarse a este documento **antes** de ejecutarse, no ejecutarse informalmente.
- Este roadmap se revisa y actualiza al cierre de cada sprint para reflejar duraciones reales vs. estimadas, y ajustar sprints futuros si es necesario.

### Nota de reconciliación (Sprint 3)

El Sprint 3 (funcionalidades JavaScript e interactividad) se ejecutó **sin haber sido agregado primero a este documento**, incumpliendo la regla anterior — el brief que lo inició no traía número de sprint asignado, y no se pausó a reconciliarlo contra el roadmap de 8 sprints ya aprobado antes de empezar. Al notarlo, se presentaron 3 opciones para resolverlo (mantener el Sprint 3 original intacto y tratar el trabajo como ampliación del Sprint 1; insertarlo como un sprint intermedio sin renumerar; o redefinir el Sprint 3 y correr en cascada todo lo siguiente). Se eligió la tercera: el Sprint 3 original ("Páginas internas del sitio estático") pasó a ser el **Sprint 4**, y todos los sprints posteriores se corrieron un número (el roadmap pasó de 8 a 9 sprints). La renumeración se propagó a `PROJECT.md`, `ARCHITECTURE.md`, `ADR.md`, `NFR.md`, `CLAUDE.md`, `CONTRIBUTING.md` y `README.md` — ver `CHANGELOG.md` para el detalle completo de archivos afectados.

---

*Fin de ROADMAP.md.*
