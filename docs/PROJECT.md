# PROJECT.md — Hogar Canitas Felices

> Documento maestro del proyecto. Es la fuente de verdad sobre **qué** se está construyendo y **por qué**. Cualquier decisión de arquitectura, diseño o alcance debe ser trazable a este documento. Si una decisión tomada en un sprint contradice lo escrito aquí, este documento tiene prioridad y debe actualizarse de forma explícita (no silenciosa).

| Campo | Valor |
|---|---|
| Proyecto | Hogar Canitas Felices |
| Tipo | Sitio web corporativo → evolución a plataforma con CMS |
| Estado actual | Sprint 4 completado (páginas internas del sitio estático) |
| Stack objetivo final | Angular + backend por definir (ver sección 10) + panel administrativo |
| Última actualización | Cierre del Sprint 4 |
| Propietario del documento | Equipo de arquitectura del proyecto |

---

## 1. Visión del proyecto

Hogar Canitas Felices será la presencia digital oficial de un hogar geriátrico, y debe cumplir un rol que va más allá de "una página informativa": es, para muchas familias, el **primer punto de contacto emocional** con la decisión de confiar el cuidado de un ser querido a un tercero. Esa decisión rara vez es racional en primera instancia — es una decisión de confianza.

La visión de largo plazo es que Hogar Canitas Felices evolucione de un sitio estático a una **plataforma web con gestión de contenido (CMS)**, administrada por el propio personal del hogar geriátrico sin depender de un desarrollador para cada cambio (nuevas fotos, testimonios, servicios, sedes), construida sobre una arquitectura **Angular (frontend) + backend aún por definir + base de datos relacional**. El framework de backend no está decidido todavía: se evaluarán al menos Spring Boot (Java) y Python (con Flask u otro framework equivalente), formalizando la elección como ADR antes del Sprint 6 (ver sección 10 y `docs/ARCHITECTURE.md`). Se incluirá un panel administrativo separado del sitio público.

El proyecto se ejecuta de forma **incremental por sprints**, comenzando por una versión estática en HTML/CSS/JS vanilla (Sprint 1, ya completado) que sirve como maqueta funcional, de diseño y de contenido — de modo que la migración a Angular no sea un rediseño, sino una **traducción estructurada** de componentes ya validados visual y funcionalmente.

---

## 2. Objetivos generales

1. Construir un sitio web corporativo profesional, confiable y moderno para Hogar Canitas Felices, comparable en calidad visual y de experiencia a clínicas privadas, hospitales premium y hoteles de bienestar.
2. Sentar una base técnica sólida, documentada y modular que permita evolucionar el proyecto hacia Angular y hacia el backend que se seleccione **sin rediseñar ni reescribir desde cero**.
3. Establecer procesos, convenciones y documentación de nivel enterprise desde el inicio, evitando deuda técnica y decisiones improvisadas en sprints futuros.
4. Generar confianza en las familias que buscan un hogar geriátrico para sus seres queridos, mediante una comunicación visual y de contenido cálida, transparente y profesional.

---

## 3. Objetivos específicos

- Diseñar e implementar un Home completo, responsive y accesible, que comunique los valores de la marca (tranquilidad, confianza, profesionalismo, bienestar, calidez).
- Documentar la arquitectura, el sistema de diseño, las decisiones técnicas (ADR) y los requisitos no funcionales (NFR) **antes** de escribir código adicional, para que cada sprint parta de una base clara.
- Definir un roadmap (actualmente 9 sprints, tras la reconciliación del Sprint 3 — ver `docs/ROADMAP.md`) que cubra desde el Home estático hasta la evolución a una plataforma con backend y panel administrativo.
- Establecer convenciones de código, nombres, estructura de carpetas y flujo de trabajo Git que se mantengan constantes durante todo el proyecto.
- Preparar la base de contenido, imágenes y componentes de forma que la futura migración a Angular sea una tarea de **traducción de componentes**, no de rediseño.
- Garantizar desde el Sprint 1 buenas prácticas de SEO técnico, accesibilidad (WCAG) y rendimiento, en vez de tratarlas como mejoras posteriores.

---

## 4. Alcance

### 4.1 Dentro del alcance (proyecto completo, todos los sprints)

- Sitio web corporativo público (Home + páginas internas: Nosotros, Servicios, Sedes, Galería, Contacto, Blog/Noticias si aplica).
- Sistema de diseño documentado y reutilizable.
- Documentación técnica completa (arquitectura, ADR, NFR, roadmap, guías de contribución).
- Migración del frontend a Angular, manteniendo el diseño y la estructura de componentes ya validada.
- Backend (framework por definir — ver sección 10) con API REST para gestión de contenido (servicios, sedes, galería, testimonios, formulario de contacto).
- Panel administrativo (CMS) para que el personal del hogar geriátrico gestione contenido sin intervención de desarrollo.
- Integración con Google Maps (reemplazando el marcador de posición actual).
- Formulario de contacto conectado a un backend real (envío de correo o almacenamiento en base de datos).

### 4.2 Fuera del alcance (por ahora)

- Sistema de reservas o agendamiento en línea con disponibilidad en tiempo real.
- Portal de pagos o facturación en línea.
- Aplicación móvil nativa (iOS/Android).
- Sistema de historias clínicas o gestión médica de residentes (fuera del dominio de un sitio corporativo).
- Autenticación de usuarios finales (familias) — el panel administrativo es solo para personal interno.

> Cualquier funcionalidad fuera de este alcance que surja durante el desarrollo debe documentarse en **ROADMAP.md** como "futura" y no debe implementarse de forma improvisada dentro de un sprint no planificado para ello (ver `CLAUDE.md`, principio de "no crear soluciones temporales").

### 4.3 Público objetivo

| Segmento | Descripción | Necesidad principal |
|---|---|---|
| Hijos/as adultos de personas mayores (45-65 años) | Principal tomador de decisión; busca tranquilidad y evidencia de calidad de cuidado | Confianza, transparencia, facilidad de contacto |
| Familiares cercanos (hermanos, nietos) | Influyen en la decisión, comparten el sitio dentro de la familia | Claridad de información, fotos/galería |
| Personal médico o trabajadores sociales que refieren pacientes | Buscan validar la seriedad y profesionalismo del lugar | Información de servicios, credenciales, contacto directo |
| El propio adulto mayor (en algunos casos) | Participa en la decisión sobre su propio cuidado | Legibilidad, accesibilidad, tono respetuoso y no infantilizante |

### 4.4 Problema que resuelve

Actualmente, la elección de un hogar geriátrico suele basarse en recomendaciones informales, visitas presenciales sin contexto previo, o portales de terceros que no reflejan fielmente la identidad de cada institución. Las familias enfrentan:

- Dificultad para evaluar objetivamente la calidad y calidez de un lugar sin visitarlo primero.
- Falta de información clara y centralizada sobre servicios, sedes e instalaciones.
- Ansiedad e incertidumbre en un momento emocionalmente sensible, agravada por sitios web anticuados, poco profesionales o inexistentes.

Hogar Canitas Felices resuelve esto ofreciendo un canal digital propio, confiable y actualizado, que reduce la incertidumbre inicial y facilita el primer contacto (agendar visita, escribir por WhatsApp) sin fricción.

### 4.5 Beneficios

**Para las familias:**
- Acceso claro a información de servicios, sedes y testimonios antes de la primera visita presencial.
- Canales de contacto directo e inmediato (WhatsApp, formulario).
- Percepción de confianza y profesionalismo desde el primer contacto digital.

**Para Hogar Canitas Felices (negocio):**
- Canal propio de captación de nuevos residentes, no dependiente de terceros.
- Reducción de carga operativa en la atención de consultas iniciales repetitivas.
- Base tecnológica escalable: a futuro, el personal administrativo podrá actualizar contenido sin depender de un desarrollador para cada cambio.
- Diferenciación frente a competidores con presencia digital débil o inexistente.

---

## 5. Funcionalidades principales (alcance actual y próximos sprints inmediatos)

| Funcionalidad | Estado |
|---|---|
| Home responsive (navbar, hero, por qué elegirnos, servicios, sedes, galería por sede, testimonios, contacto, footer) | ✅ Completado (Sprint 1) |
| Documentación técnica completa (este set de documentos) | ✅ Completado (Sprint 2) |
| Navbar inteligente (scroll, menú móvil, sección activa, scroll accesible) | ✅ Completado (Sprint 3) |
| Animaciones de entrada al hacer scroll (6 variantes, duración/delay configurables) | ✅ Completado (Sprint 3) |
| Galería con lightbox (teclado, swipe, zoom, precarga) | ✅ Completado (Sprint 3) |
| Botón flotante y configuración centralizada de WhatsApp | ✅ Completado (Sprint 3) |
| Botón "volver arriba" | ✅ Completado (Sprint 3) |
| Formulario de contacto (validación, estados de carga/éxito/error) | ✅ Completado (Sprint 3) |
| Acordeón de FAQ accesible, con 6 preguntas de referencia en el Home | ✅ Completado (Sprint 3) |
| Pantalla de carga inicial | ✅ Completado (Sprint 3) |
| Páginas internas (Nosotros, Servicios detalle, Sedes detalle) | ✅ Completado (Sprint 4) |
| Formulario de contacto conectado a backend real | ⏳ Planificado (Sprint 5) |
| Integración con Google Maps | ⏳ Planificado (Sprint 5) |

## 6. Funcionalidades futuras (post-migración a Angular y al backend por definir)

- Panel administrativo (CMS) con autenticación para personal interno.
- Gestión de contenido dinámico: servicios, sedes, galería, testimonios, banner del hero — editable sin tocar código.
- Gestión de mensajes de contacto recibidos (bandeja interna).
- Sistema de roles y permisos dentro del panel administrativo (ej. editor de contenido vs. administrador).
- Blog o sección de noticias/actividades.
- Analítica interna de visitas y conversiones (agendamientos, clics en WhatsApp).
- Internacionalización (i18n) si el negocio se expande a otras regiones.
- Modo oscuro (dark mode) — el sistema de diseño ya se preparará para esto desde `DESIGN_SYSTEM.md`, aunque no se implemente en el corto plazo.

---

## 7. Roadmap de alto nivel

> El detalle completo de cada sprint (objetivos, entregables, criterios de aceptación, riesgos) vive en `ROADMAP.md`. Aquí solo se resume la progresión general.

| Fase | Sprints | Resultado |
|---|---|---|
| **Fase 1 — Fundacional** | Sprint 1 | Home estático funcional en HTML/CSS/JS (completado) |
| **Fase 2 — Documentación y consolidación** | Sprint 2 | Documentación técnica completa (completado) |
| **Fase 3 — Interactividad** | Sprint 3 | Funcionalidades JavaScript completas sobre el Home: navbar inteligente, animaciones, galería con lightbox, formulario, FAQ, loader (completado) |
| **Fase 4 — Expansión del sitio estático** | Sprint 4–5 | Páginas internas, contenido real, formulario conectado, SEO/accesibilidad reforzados |
| **Fase 5 — Preparación de migración** | Sprint 6 | Auditoría de componentes, definición de arquitectura Angular, contratos de API |
| **Fase 6 — Migración a Angular** | Sprint 7 | Reconstrucción del frontend como aplicación Angular, manteniendo diseño y contenido |
| **Fase 7 — Backend y CMS** | Sprint 8 | Backend (framework decidido en Sprint 6), API REST, base de datos, panel administrativo inicial |
| **Fase 8 — Integración y lanzamiento** | Sprint 9 | Integración completa frontend-backend, pruebas, despliegue en producción |

---

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Contenido real (fotos, textos legales, datos de sedes) no está disponible a tiempo | Alta | Medio | Uso de contenido/imágenes de referencia claramente marcadas como temporales (ya aplicado en Sprint 1); no bloquear desarrollo por falta de contenido final |
| La migración a Angular termine reescribiendo en vez de traduciendo el diseño | Media | Alto | Mantener `ARCHITECTURE.md` y `DESIGN_SYSTEM.md` como contratos vinculantes desde el Sprint 1; nomenclatura BEM ya pensada para mapear a componentes Angular |
| Falta de definición de alcance del panel administrativo hasta el Sprint 8 | Media | Alto | Documentar requisitos funcionales del CMS desde `ROADMAP.md` y `PROJECT.md`, revisarlos antes del Sprint 6 |
| Decisiones técnicas tomadas de forma improvisada durante sprints de desarrollo | Media | Alto | Todo cambio de arquitectura debe registrarse como ADR antes de implementarse (ver `ADR.md`) |
| Requisitos no funcionales (rendimiento, accesibilidad) tratados como secundarios frente a la velocidad de entrega | Media | Medio | `NFR.md` como checklist obligatorio de revisión al cierre de cada sprint |
| Dependencia de un único desarrollador/agente para mantener consistencia entre sprints | Alta | Medio | Documentación exhaustiva (`CLAUDE.md`, `CONTRIBUTING.md`) que permita a cualquier colaborador retomar el proyecto sin conocimiento implícito |

---

## 9. Restricciones

- **Sin frameworks CSS** (Bootstrap, Tailwind, etc.) en la fase estática — HTML5, CSS3 y JavaScript ES6 puro, por decisión explícita de arquitectura (ver ADR-001).
- **Sin imágenes de bancos externos o de internet** — todo recurso visual debe ser propio o generado como referencia explícitamente marcada como temporal (ver ADR-005).
- El diseño y la estructura de componentes definidos en la fase estática **no deben romperse** al migrar a Angular; cualquier cambio estructural debe pasar primero por un ADR.
- El proyecto debe permanecer **desplegable como sitio estático** durante todas las fases previas al Sprint 7 (sin dependencias de build complejas que impidan una vista previa simple en navegador).
- El panel administrativo (CMS) no debe exponer funcionalidad al público sin autenticación — es una restricción de seguridad no negociable desde el diseño.

---

## 10. Tecnologías previstas

| Capa | Sprint 1–6 (actual) | Sprint 7–9 (objetivo) |
|---|---|---|
| Frontend | HTML5, CSS3 (BEM, variables CSS, Grid/Flexbox), JavaScript ES6 vanilla | Angular (última versión LTS estable al momento de la migración), TypeScript |
| Backend | No aplica (sitio estático) | **Por definir** — candidatos en evaluación: Spring Boot (Java) o Python (Flask u otro framework equivalente). Decisión formal vía ADR durante el Sprint 6 (ver `docs/ARCHITECTURE.md`) |
| Base de datos | No aplica | Base de datos relacional (PostgreSQL o MySQL, a definir en ADR durante Sprint 6) |
| Autenticación | No aplica | Spring Security + JWT (a confirmar en ADR) |
| Tipografía | Google Fonts (Fraunces + Plus Jakarta Sans) | Se mantiene |
| Control de versiones | Git | Se mantiene |
| Contenerización | No aplica en fase estática | Docker (preparación desde Sprint 6, implementación en Sprint 8–9) |
| Despliegue | Hosting estático simple | Nube (proveedor a definir en ADR — AWS, GCP o Azure) |

---

## 11. Arquitectura objetivo

> El detalle completo vive en `ARCHITECTURE.md`. Aquí se resume la intención arquitectónica de alto nivel.

- **Arquitectura por capas**, con separación estricta entre presentación (frontend), lógica de negocio (backend) y persistencia (base de datos).
- **Frontend desacoplado del backend** desde el diseño: el frontend estático actual ya consume "datos" a través de estructuras JavaScript locales (ver `js/gallery.js`), de forma que reemplazarlas por llamadas a una API REST sea un cambio de fuente de datos, no de arquitectura de componentes.
- **API REST** como contrato único de comunicación entre Angular y el backend, independientemente del framework que se elija.
- **CMS como aplicación administrativa separada** del sitio público (misma API, distinta interfaz y distinto nivel de acceso).
- Arquitectura preparada para **contenerización con Docker** y despliegue en la nube desde el Sprint 8.

---

## 12. Convenciones generales

- Idioma del contenido visible al usuario: **español**.
- Idioma de nombres de archivos, clases CSS, variables y funciones: **inglés técnico** cuando corresponda a convenciones de código (ej. `navbar`, `is-active`), y **español** cuando corresponda a contenido o dominio del negocio (ej. `la-pampa`, `campestre`, nombres de servicios).
- Nomenclatura CSS: metodología **BEM** (`bloque__elemento--modificador`), ya aplicada consistentemente desde el Sprint 1.
- Un componente visual = un archivo CSS y, cuando aplique, un archivo JS de responsabilidad única (ver `ARCHITECTURE.md`).
- Toda decisión que se desvíe de estas convenciones debe registrarse como ADR antes de implementarse.

## 13. Principios de desarrollo

1. **Claridad sobre brevedad**: preferir código explícito y legible sobre soluciones ingeniosas pero difíciles de mantener.
2. **Consistencia sobre preferencia individual**: seguir las convenciones ya establecidas, incluso si un colaborador tiene una preferencia distinta.
3. **Documentar antes de decidir de forma improvisada**: cambios de arquitectura pasan por ADR, no por decisiones puntuales dentro de un commit.
4. **Responsive first y accesibilidad no negociable**: no son mejoras opcionales, son requisitos desde el primer sprint.
5. **Preparar sin sobre-construir**: dejar la puerta abierta a Angular y al backend que se seleccione, sin implementar infraestructura que no se necesita todavía (evitar over-engineering en la fase estática).
6. **Sin soluciones temporales silenciosas**: si algo es un placeholder o una solución provisional, debe quedar explícitamente marcado (como ya se hizo con las imágenes de referencia del Sprint 1).

---

## 14. Definición de éxito del proyecto

El proyecto se considerará exitoso cuando se cumplan, de forma verificable, los siguientes criterios:

- El sitio público comunica de forma clara y medible (a través de feedback cualitativo de usuarios de prueba) los valores de confianza, calidez y profesionalismo definidos en la visión.
- El sitio cumple los requisitos no funcionales definidos en `NFR.md` (rendimiento, accesibilidad, SEO, compatibilidad).
- La migración a Angular se realiza **sin rediseñar** el sitio ni renegociar el sistema de diseño ya validado.
- El panel administrativo permite al personal de Hogar Canitas Felices actualizar contenido (servicios, sedes, galería, testimonios) sin intervención de un desarrollador.
- La documentación (`ARCHITECTURE.md`, `ADR.md`, `NFR.md`, `CLAUDE.md`) sigue siendo la referencia válida y actualizada durante todos los sprints, sin discrepancias entre lo documentado y lo implementado.
- El proyecto puede ser retomado por un colaborador nuevo (humano o agente de IA) usando únicamente la documentación, sin depender de conocimiento implícito no escrito.

---

*Fin de PROJECT.md.*
