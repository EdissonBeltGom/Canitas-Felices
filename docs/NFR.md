# NFR.md — Requisitos No Funcionales (Non-Functional Requirements)

> Este documento define **cómo de bien** debe comportarse el sistema, en contraposición a `docs/PROJECT.md` y al contenido funcional del sitio, que definen **qué** hace. Es la referencia contra la cual se evalúa la calidad de cada entregable, en cada sprint — no un documento aspiracional para leer una vez y olvidar. Los criterios de aceptación de `docs/ROADMAP.md` que mencionan "cumple NFR" remiten directamente a las métricas de este documento.

---

## 1. Rendimiento

| Métrica | Objetivo | Herramienta de medición |
|---|---|---|
| Tiempo de carga inicial (First Contentful Paint) | < 1.8s en conexión 4G simulada | Lighthouse / PageSpeed Insights |
| Time to Interactive | < 3.5s en conexión 4G simulada | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse / Core Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse / Core Web Vitals |
| Peso total de la página de inicio | < 2.5 MB (incluyendo imágenes) en la versión con contenido/imágenes reales | DevTools Network |
| Lighthouse — Performance | ≥ 90 / 100 en escritorio, ≥ 80 / 100 en móvil | Lighthouse |

**Optimización de imágenes**
- Todas las imágenes de contenido (banner, servicios, sedes, testimonios) deben servirse en formato optimizado (JPEG comprimido u opcionalmente WebP con fallback) — a formalizar durante el Sprint 5 cuando se reemplacen las imágenes de referencia por fotografía real.
- Los íconos se mantienen en SVG (ya implementado desde el Sprint 1), por ser vectoriales y de tamaño mínimo sin pérdida de calidad en ninguna resolución.
- Toda imagen fuera del *viewport* inicial usa `loading="lazy"` — ya implementado en `index.html` para servicios, galería y testimonios.

**Lazy Loading**
- Imágenes bajo el pliegue (`fold`): `loading="lazy"` nativo (ya aplicado en el Sprint 1).
- La galería solo renderiza las imágenes de la sede actualmente seleccionada (ya implementado en `gallery.js`), no las 12 imágenes de ambas sedes simultáneamente.

**Minificación**
- No aplicada aún en el sitio estático (Sprint 1-4): se prioriza legibilidad del código durante el desarrollo activo por sprints.
- Antes del Sprint 5 (lanzamiento de contenido real) se evaluará introducir minificación de CSS/JS como parte del proceso de despliegue — sin alterar los archivos fuente legibles del repositorio, solo la versión servida en producción.
- A partir del Sprint 7 (Angular), la minificación es responsabilidad del proceso de build estándar del framework (`ng build --configuration production`), sin necesidad de configuración adicional.

---

## 2. Accesibilidad

| Criterio | Objetivo |
|---|---|
| Nivel WCAG | AA (mínimo), en la totalidad de páginas del sitio |
| Navegación por teclado | 100% de elementos interactivos operables sin mouse |
| Contraste de texto normal | ≥ 4.5:1 |
| Contraste de texto grande (≥18pt o ≥14pt bold) | ≥ 3:1 |
| Lighthouse — Accessibility | ≥ 95 / 100 |
| axe DevTools (o equivalente) | 0 errores críticos/serios |

**Detalle de implementación esperado**
- Todo elemento interactivo (`a`, `button`, `input`, `textarea`) debe exponer un estado `:focus-visible` perceptible — ya implementado globalmente en `styles.css`.
- Toda imagen informativa lleva `alt` descriptivo; toda imagen decorativa lleva `alt=""` — convención ya establecida y aplicada, incluida la generación dinámica de `alt` en `gallery.js`.
- Componentes con estado dinámico (tabs de galería, formulario) siguen el patrón WAI-ARIA correspondiente (`role`, `aria-selected`, `aria-controls`, `aria-describedby`) — ya implementado en el Sprint 1.
- Etiquetas ARIA se usan como refuerzo semántico, nunca como sustituto de HTML semántico nativo cuando existe una alternativa (ej. usar `<button>` real en vez de `<div role="button">`).
- Toda animación respeta `prefers-reduced-motion` — ya implementado globalmente.
- El `skip-link` ("Saltar al contenido principal") debe estar presente en toda página del sitio, no solo en el Home.

**Verificación**
Antes de cerrar cualquier sprint que module HTML/CSS/JS visible, se debe ejecutar al menos una auditoría automatizada (Lighthouse o axe) más una verificación manual de navegación por teclado (Tab, Shift+Tab, Enter, Escape) sobre los componentes nuevos o modificados.

---

## 3. Responsive

| Breakpoint | Rango | Objetivo de compatibilidad |
|---|---|---|
| Celular pequeño | ≤ 380px | Sin overflow horizontal, texto legible sin zoom |
| Celular | ≤ 767px | Layout de una columna, navegación por menú hamburguesa |
| Tablet | 768px – 1024px | Layout intermedio (2-3 columnas según componente) |
| Portátil | 1024px – 1200px | Layout casi completo, ajustes menores de columnas |
| Monitor grande | > 1200px | Layout completo, `max-width` de contenedor respetado |

(Breakpoints oficiales detallados en `docs/DESIGN_SYSTEM.md`, sección 7 — este documento remite a esa fuente única, no la duplica).

**Compatibilidad con dispositivos**
- Móviles: iOS Safari (últimas 2 versiones mayores), Chrome Android (últimas 2 versiones mayores).
- Tablets: iPadOS Safari, Chrome Android en tablet.
- Escritorio: ver sección 4 (Compatibilidad de navegadores).

**Criterio de aceptación transversal**: ningún componente debe producir scroll horizontal no intencional en ningún breakpoint oficial, verificado manualmente además de con herramientas automatizadas.

---

## 4. Compatibilidad

| Navegador | Versión mínima soportada |
|---|---|
| Google Chrome | Últimas 2 versiones mayores |
| Mozilla Firefox | Últimas 2 versiones mayores |
| Safari (macOS / iOS) | Últimas 2 versiones mayores |
| Microsoft Edge (Chromium) | Últimas 2 versiones mayores |

- No se garantiza soporte para Internet Explorer (cualquier versión) — decisión coherente con el uso de JavaScript ES6, CSS Grid y `IntersectionObserver`, todos sin soporte en IE.
- Todo uso de una API de navegador relativamente reciente (`IntersectionObserver`, `prefers-reduced-motion`) debe incluir un *fallback* funcional para navegadores sin soporte — ya implementado en `animations.js` y `whatsapp.js` (Sprint 1).

---

## 5. Seguridad

### 5.1 Buenas prácticas para frontend (aplicable desde el Sprint 1)

- Ninguna credencial, clave de API o dato sensible se almacena en el código del cliente en ningún momento del proyecto, incluida la fase estática.
- Todo enlace externo (`target="_blank"`) incluye `rel="noopener noreferrer"` — ya aplicado consistentemente en redes sociales y WhatsApp del Sprint 1.
- No se ejecuta contenido dinámico no confiable (ej. no se usa `innerHTML` con datos no controlados por el propio código — `gallery.js` construye el DOM con `document.createElement`, no con concatenación de strings HTML, evitando riesgo de inyección incluso si el origen de datos cambiara a una API externa).

### 5.2 Protección de formularios

- Validación de cliente (ya implementada en `app.js`) se trata como mejora de experiencia, **nunca** como control de seguridad suficiente — toda validación se duplicará obligatoriamente en el backend cuando este exista (ver `CLAUDE.md`, sección 7).
- Antes de conectar el formulario a un servicio de envío real (Sprint 5), se debe evaluar protección anti-spam básica (ej. *honeypot* field, o el mecanismo anti-abuso que ofrezca el servicio de envío elegido).
- El backend futuro (framework por definir, ver `docs/ADR.md`, ADR-007) debe implementar *rate limiting* en el endpoint de contacto público, para prevenir abuso.

### 5.3 Preparación para HTTPS

- El sitio debe servirse exclusivamente sobre HTTPS en cualquier entorno de staging o producción, desde el primer despliegue real (Sprint 5 en adelante) — no se considera aceptable HTTP sin cifrar ni siquiera de forma temporal.
- Todo recurso propio (fuentes, imágenes) debe cargarse también sobre HTTPS, evitando contenido mixto que los navegadores bloquean o marcan como inseguro.

### 5.4 Cabeceras de seguridad futuras (a implementar en el despliegue de producción, Sprint 9)

| Cabecera | Propósito |
|---|---|
| `Content-Security-Policy` | Restringir orígenes de scripts, estilos e imágenes permitidos |
| `X-Content-Type-Options: nosniff` | Prevenir *MIME sniffing* |
| `X-Frame-Options: DENY` (o `frame-ancestors` en CSP) | Prevenir *clickjacking* |
| `Strict-Transport-Security` | Forzar HTTPS en visitas futuras del navegador |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limitar información de referer enviada a terceros |

> Estas cabeceras se configuran a nivel de servidor/infraestructura (Nginx, proveedor de nube), no en el código del sitio — se documentan aquí como requisito, su implementación concreta se define en el Sprint 9.

---

## 6. SEO

| Elemento | Estado | Sprint de implementación completa |
|---|---|---|
| HTML semántico (`header`, `nav`, `main`, `section`, `footer`) | ✅ Implementado | Sprint 1 |
| Un `h1` único por página | ✅ Implementado (Home) | Sprint 1 (extendido a páginas internas en Sprint 4) |
| Meta `title` / `description` por página | ✅ Implementado (Home, con contenido de referencia) | Contenido definitivo en Sprint 5 |
| Open Graph básico | ✅ Implementado (Home) | Contenido definitivo en Sprint 5 |
| `sitemap.xml` | ⏳ Pendiente | Sprint 5 |
| `robots.txt` | ⏳ Pendiente | Sprint 5 |
| Datos estructurados (Schema.org, tipo `LocalBusiness` o `MedicalOrganization` según corresponda) | ⏳ Pendiente | Sprint 5 |
| URLs amigables (sin parámetros técnicos, en español, coherentes con el contenido) | ⏳ Pendiente (aplica desde Sprint 4, páginas internas) | Sprint 4 |
| Lighthouse — SEO | Objetivo ≥ 95 / 100 | Verificado desde Sprint 1, formal desde Sprint 5 |

---

## 7. Mantenibilidad

- Código modular por responsabilidad única (ver `docs/ARCHITECTURE.md`, sección 2.2) — verificable objetivamente contra la tabla de responsabilidad por archivo.
- Convenciones de nombres consistentes (BEM, camelCase, kebab-case según corresponda) — ver `docs/ARCHITECTURE.md`, sección 2.5, y `docs/CONTRIBUTING.md`, sección 2.
- Documentación obligatoria y actualizada en el mismo sprint en que ocurre un cambio estructural (ver `CLAUDE.md`, sección 9) — el incumplimiento de esta regla se considera una regresión de calidad, no un detalle menor.
- Objetivo cualitativo: un colaborador nuevo (humano o agente de IA) debe poder ubicar dónde corresponde un cambio, sin necesidad de preguntar, usando únicamente `docs/ARCHITECTURE.md` como referencia, en el 100% de los casos cubiertos por la tabla de responsabilidad única.

---

## 8. Escalabilidad

- Arquitectura desacoplada entre origen de datos y lógica de renderizado (ver ADR-004 en `docs/ADR.md`), que permite escalar de datos locales a API REST sin reescribir componentes visuales.
- API REST versionada (`/api/v1/...`, prevista en `docs/ARCHITECTURE.md`, sección 3.5) para permitir evolución sin romper clientes existentes.
- Preparación para Angular: estructura de componentes ya mapeable (ver `docs/ARCHITECTURE.md`, sección 3.2).
- Preparación para backend (framework por definir): principios de capas, DTOs/schemas y autenticación ya documentados de forma agnóstica (ver `docs/ARCHITECTURE.md`, sección 3.3).
- Preparación para Docker: estrategia de *multi-stage builds* prevista para frontend y backend (ver `docs/ARCHITECTURE.md`, sección 5).
- Preparación para despliegue en la nube: variables de entorno para toda configuración sensible desde el primer sprint de backend, sin credenciales hardcodeadas en ningún momento del proyecto.

---

## 9. Observabilidad futura

> No implementado en la fase estática (Sprint 1-4) por no existir backend ni tráfico real que monitorear — planificado formalmente para los Sprints 7-8.

- **Registro de errores (frontend)**: se evaluará la incorporación de una herramienta de *error tracking* (ej. Sentry o equivalente) a partir del Sprint 7 (Angular), para capturar errores de JavaScript en producción no detectados en desarrollo.
- **Analítica**: se evaluará una herramienta de analítica web (respetuosa de la privacidad, con consentimiento si aplica según jurisdicción) a partir del Sprint 5, para medir tráfico real, clics en WhatsApp/agendar visita, y tasa de completado del formulario de contacto — métricas directamente relacionadas con los beneficios de negocio definidos en `docs/PROJECT.md`.
- **Monitoreo de disponibilidad (uptime)**: a implementar en el Sprint 9, junto con el despliegue en producción — verificación periódica de que el sitio y la API responden correctamente.
- **Logs de backend**: estructurados (formato consistente, niveles de severidad) desde el primer sprint de backend (Sprint 8), no como práctica añadida después de un incidente.

Cualquier herramienta de observabilidad que se incorpore debe evaluarse contra `CLAUDE.md`, regla 8 (justificación de dependencias nuevas) y registrarse como ADR antes de integrarse.

---

## 10. Objetivos de calidad — resumen ejecutivo

| Dimensión | Métrica clave | Objetivo | Sprint de cumplimiento formal |
|---|---|---|---|
| Rendimiento | Lighthouse Performance (escritorio) | ≥ 90 | Sprint 1 (verificable ya) |
| Rendimiento | Lighthouse Performance (móvil) | ≥ 80 | Sprint 5 (con imágenes reales optimizadas) |
| Accesibilidad | Lighthouse Accessibility | ≥ 95 | Sprint 1 (verificable ya) |
| Accesibilidad | Nivel WCAG | AA | Sprint 1, extendido a páginas nuevas en Sprint 4 |
| SEO | Lighthouse SEO | ≥ 95 | Sprint 5 (contenido y metadatos definitivos) |
| Responsive | 0 casos de overflow horizontal no intencional | 100% de breakpoints oficiales | Sprint 1 (verificable ya) |
| Seguridad | HTTPS activo en producción | 100% del tráfico | Sprint 5 (primer despliegue real) |
| Seguridad | Cabeceras de seguridad configuradas | 100% de las listadas en sección 5.4 | Sprint 9 |
| Mantenibilidad | Cumplimiento de la tabla de responsabilidad única de archivos | 100% | Continuo, verificado en cada PR (ver `docs/CONTRIBUTING.md`) |

> Este resumen no reemplaza el detalle de cada sección — es un panel de control rápido para revisión al cierre de cada sprint, contrastando el estado real contra el objetivo antes de dar un sprint por cerrado (ver también `docs/ROADMAP.md`, criterios de aceptación por sprint).

---

*Fin de NFR.md — con este documento se completa el set de documentación técnica y funcional definido para el Sprint 2 (`docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, `CLAUDE.md`, `docs/CONTRIBUTING.md`, `docs/CHANGELOG.md`, `README.md`, `docs/ADR.md`, `docs/NFR.md`). Pendiente de tu aprobación final.*
