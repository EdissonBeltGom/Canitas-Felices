# CONTRIBUTING.md — Guía de contribución

> Guía práctica para cualquier persona (o agente de IA) que vaya a contribuir código a este proyecto. Complementa a `CLAUDE.md` (que define **qué reglas nunca se rompen**) con el **cómo del día a día**: flujo de Git, formato, estructura y proceso de revisión. Si hay una contradicción entre este documento y `CLAUDE.md`, `CLAUDE.md` tiene prioridad.

---

## 1. Antes de empezar

Antes de escribir la primera línea de código:

1. Lee `docs/PROJECT.md` para entender la visión y el alcance actual del sprint en curso.
2. Lee `docs/ARCHITECTURE.md`, sección 2.2 (tabla de responsabilidad única por archivo) — antes de crear o modificar un archivo, verifica que corresponda.
3. Lee `docs/DESIGN_SYSTEM.md` si tu contribución incluye CSS — no declares valores fuera de los tokens ya definidos.
4. Revisa `CLAUDE.md` — especialmente la sección 1 (reglas absolutas) y el checklist de la sección 10.
5. Revisa `docs/ROADMAP.md` para confirmar que tu contribución corresponde al sprint actual, no a un sprint futuro adelantado sin planificación.

---

## 2. Convenciones de nombres

### 2.1 Archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| HTML | kebab-case | `index.html`, `sede-la-pampa.html` |
| CSS | kebab-case, nombre = componente | `navbar.css`, `contact.css` |
| JavaScript | kebab-case, nombre = responsabilidad | `gallery.js`, `whatsapp.js` |
| Imágenes | kebab-case, descriptivo del contenido | `sala-terapias.jpg`, `reloj-24h.svg` |
| Documentación | UPPERCASE.md (estándar de la industria) | `README.md`, `CHANGELOG.md` |

### 2.2 Código

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases CSS | BEM: `bloque__elemento--modificador` | `.service-card__title`, `.btn--primary` |
| Estados CSS | Prefijo `is-` / `has-` | `.is-active`, `.is-invalid` |
| IDs HTML | camelCase | `contactForm`, `whatsappFloat` |
| Atributos `data-*` | kebab-case | `data-animate="fade-up"` |
| Variables CSS | kebab-case con prefijo semántico | `--color-sky`, `--space-md` |
| Funciones JS | camelCase, verbo + sustantivo | `renderGallery()`, `validateField()` |
| Constantes JS | UPPER_SNAKE_CASE si son de configuración global | `GALLERIES`, `SCROLL_THRESHOLD` |

> No se aceptan contribuciones que introduzcan una convención de nombres distinta a la ya establecida sin haberla registrado antes como ADR (ver `docs/ADR.md`).

---

## 3. Formato del código

- **Indentación**: 2 espacios, sin tabs, en HTML/CSS/JS.
- **Comillas**: comillas dobles (`"`) en HTML, comillas simples (`'`) en JavaScript — consistente con el código ya existente.
- **Punto y coma**: siempre explícito en JavaScript, sin depender de la inserción automática (ASI).
- **Longitud de línea**: sin límite estricto, pero preferir cortar líneas largas de CSS (selectores múltiples, propiedades) por legibilidad.
- **Sin librerías de formateo automático configuradas aún** en el sitio estático (Prettier, ESLint) — se evaluará su incorporación como ADR antes del Sprint 7, ya que Angular sí las trae por convención.

---

## 4. Estructura del proyecto

Antes de agregar un archivo nuevo, ubícalo según esta estructura (ver detalle completo en `docs/ARCHITECTURE.md`, sección 2.3):

```
CanitasFelices/
├── CLAUDE.md
├── docs/            # Documentación técnica y funcional
├── index.html
├── css/             # Un archivo por componente visual
├── js/              # Un archivo por responsabilidad de comportamiento
├── img/             # Organizado por tipo de contenido (banner, servicios, sedes, etc.)
└── favicon.ico
```

**Regla de oro**: si no sabes dónde va un archivo nuevo, revisa primero si existe un componente similar ya documentado en `docs/ARCHITECTURE.md`. Si genuinamente es un caso nuevo, créalo siguiendo el mismo patrón (como se hizo con `contact.css`) y **documenta la adición** en el mismo cambio, no después.

---

## 5. Flujo de Git recomendado

> Este proyecto aún no tiene un repositorio remoto compartido por equipo en el Sprint 1-2, pero el flujo se define desde ahora para que su adopción sea inmediata en cuanto exista colaboración real.

### 5.1 Estrategia de ramas

- `main` — rama estable, siempre desplegable. Nunca se hace commit directo aquí.
- `develop` — rama de integración de los sprints en curso (opcional en fases muy tempranas del proyecto; obligatoria a partir del Sprint 6).
- `feature/<nombre-descriptivo>` — una rama por funcionalidad o componente nuevo. Ejemplo: `feature/gallery-filter`, `feature/contact-form-validation`.
- `fix/<nombre-descriptivo>` — corrección de errores. Ejemplo: `fix/navbar-mobile-menu-overflow`.
- `docs/<nombre-descriptivo>` — cambios exclusivos de documentación. Ejemplo: `docs/architecture-md`.

### 5.2 Convención de mensajes de commit

Se recomienda [Conventional Commits](https://www.conventionalcommits.org/) desde el inicio, para que el futuro `CHANGELOG.md` pueda generarse de forma semi-automática:

```
tipo(alcance): descripción breve en presente

[cuerpo opcional explicando el porqué, no el qué]
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

Ejemplos:
```
feat(gallery): agregar filtrado dinámico por sede
fix(navbar): corregir menú móvil que no cerraba con Escape
docs(architecture): documentar contrato de API REST previsto
```

### 5.3 Pull Requests

- Todo cambio a `main` (o `develop`, según la fase del proyecto) pasa por un Pull Request — nunca merge directo, incluso trabajando en solitario, para mantener un historial de decisiones revisable.
- El PR debe describir: **qué** cambia, **por qué** (referenciando el sprint o issue correspondiente), y **cómo se validó** (ver checklist de la sección 6).
- Si el PR introduce una desviación de la arquitectura o convenciones documentadas, debe incluir el ADR correspondiente en el mismo PR, no como una promesa de "lo documento después".

### 5.4 Revisiones

- Ningún PR se aprueba solo por "funciona visualmente" — debe revisarse contra el checklist de `CLAUDE.md`, sección 10.
- Si quien revisa es un agente de IA distinto de quien implementó, debe releer `CLAUDE.md` y `docs/ARCHITECTURE.md` como parte de la revisión, no asumir contexto de la conversación anterior.
- Las revisiones priorizan: consistencia arquitectónica > estilo de código > preferencia personal. No se bloquea un PR por una preferencia de estilo no documentada en las convenciones oficiales.

---

## 6. Checklist antes de subir cambios

Antes de abrir un Pull Request (o considerar terminada una tarea):

- [ ] El código sigue las convenciones de nombres de la sección 2.
- [ ] No hay CSS ni JavaScript embebido en HTML.
- [ ] No se usaron valores "a mano" donde ya existe un token en `docs/DESIGN_SYSTEM.md`.
- [ ] El componente nuevo (si aplica) está documentado en `docs/ARCHITECTURE.md`, sección 2.2.
- [ ] Se probó visualmente en al menos un breakpoint móvil y uno de escritorio.
- [ ] Se verificó accesibilidad básica: navegación por teclado y `alt` en imágenes nuevas.
- [ ] No se introdujeron frameworks CSS, librerías JS o imágenes externas sin ADR previo.
- [ ] Si se creó una solución temporal, está marcada explícitamente como tal (comentario `TODO` + mención en `docs/CHANGELOG.md` o `docs/ROADMAP.md`).
- [ ] La documentación relevante quedó actualizada en el mismo cambio (no en un PR futuro separado).
- [ ] El mensaje de commit sigue Conventional Commits.

---

## 7. Buenas prácticas adicionales

- Prefiere cambios pequeños y frecuentes sobre PRs enormes difíciles de revisar — un componente nuevo, una corrección, o una sección de documentación por PR, no varios a la vez sin relación entre sí.
- Si vas a apartarte de un patrón ya establecido en el código (por ejemplo, un archivo JS que no siga el patrón IIFE de los demás), justifícalo explícitamente en el PR y evalúa si amerita un ADR.
- Ante la duda entre "resolverlo ahora de forma rápida" o "documentarlo y resolverlo bien", prioriza documentar — este proyecto está optimizado para evitar decisiones improvisadas (ver `CLAUDE.md`, regla 7).

---

*Fin de CONTRIBUTING.md.*
