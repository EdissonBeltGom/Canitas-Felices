/* =====================================================================
   CANITAS FELICES — faq.js
   Responsabilidad única: acordeón de preguntas frecuentes accesible.

   Componente construido y listo para usar en este sprint, pero SIN
   agregarse a index.html todavía (decisión aprobada explícitamente:
   no hay contenido de FAQ definido aún para el Home — ver
   docs/ROADMAP.md, Sprint 3). Este archivo no rompe nada al cargarse
   en una página sin ningún .faq: simplemente no encuentra nada que
   inicializar y no hace nada, igual que el resto de los módulos del
   sitio ante un componente ausente.

   Marcado esperado — ver el comentario de cabecera en faq.css.

   Comportamiento:
   - Solo un elemento abierto a la vez POR CADA .faq del documento
     (si hay varios acordeones independientes en una página, no se
     interfieren entre sí).
   - Click, Enter/Espacio (nativos de <button>) abren/cierran.
   - ArrowUp/ArrowDown mueven el foco entre preguntas del mismo
     acordeón; Home/End saltan a la primera/última.
   - Sin animación de altura medida por JS: la transición vive en CSS
     (grid-template-rows), ver faq.css.
   ===================================================================== */

(function () {
  'use strict';

  const NAMESPACE = (window.CanitasFelices = window.CanitasFelices || {});
  const CONTAINER_SELECTOR = '.faq';
  const ITEM_SELECTOR = '.faq__item';
  const TRIGGER_SELECTOR = '.faq__trigger';

  /**
   * Abre un item y cierra los demás dentro del mismo contenedor
   * (comportamiento "solo uno abierto a la vez").
   */
  function openItem(container, itemToOpen) {
    const items = container.querySelectorAll(ITEM_SELECTOR);

    items.forEach(function (item) {
      const trigger = item.querySelector(TRIGGER_SELECTOR);
      const panel = item.querySelector('.faq__panel');
      const shouldBeOpen = item === itemToOpen;

      item.classList.toggle('is-open', shouldBeOpen);
      if (trigger) {
        trigger.setAttribute('aria-expanded', String(shouldBeOpen));
      }
      if (panel) {
        // `inert` (no `hidden`): un panel oculto con `hidden` no puede
        // animarse (display:none es instantáneo). `inert` impide que
        // su contenido reciba foco/interacción mientras está colapsado,
        // sin bloquear la transición CSS de grid-template-rows.
        if (shouldBeOpen) {
          panel.removeAttribute('inert');
        } else {
          panel.setAttribute('inert', '');
        }
      }
    });
  }

  function closeItem(container, item) {
    // Cerrar es simplemente "abrir ninguno" — se reutiliza openItem
    // pasando un valor que no coincide con ningún item real.
    openItem(container, null);
  }

  function handleTriggerClick(container, item) {
    const isCurrentlyOpen = item.classList.contains('is-open');
    if (isCurrentlyOpen) {
      closeItem(container, item);
    } else {
      openItem(container, item);
    }
  }

  /**
   * Navegación por teclado entre preguntas (patrón WAI-ARIA Accordion):
   * ArrowUp/ArrowDown mueven el foco, Home/End saltan a los extremos.
   */
  function handleTriggerKeydown(event, triggers, currentIndex) {
    let targetIndex = null;

    switch (event.key) {
      case 'ArrowDown':
        targetIndex = (currentIndex + 1) % triggers.length;
        break;
      case 'ArrowUp':
        targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = triggers.length - 1;
        break;
      default:
        return; // No es una tecla de navegación: se deja el comportamiento nativo.
    }

    event.preventDefault();
    triggers[targetIndex].focus();
  }

  /**
   * Inicializa un contenedor .faq específico. Público (ver exposición
   * al final) para poder inicializar un acordeón agregado dinámicamente
   * después de la carga inicial de la página (ej. futuras páginas
   * internas, o contenido cargado por el CMS en la Era 2).
   * @param {HTMLElement} container
   */
  function initFaq(container) {
    if (!container) {
      return;
    }

    const items = Array.from(container.querySelectorAll(ITEM_SELECTOR));
    const triggers = items
      .map((item) => item.querySelector(TRIGGER_SELECTOR))
      .filter(Boolean);

    // Estado inicial: todo cerrado (coincide con aria-expanded="false"
    // ya presente en el HTML por defecto).
    items.forEach(function (item) {
      const panel = item.querySelector('.faq__panel');
      if (panel) {
        panel.setAttribute('inert', '');
      }
    });

    triggers.forEach(function (trigger, index) {
      const item = trigger.closest(ITEM_SELECTOR);

      trigger.addEventListener('click', function () {
        handleTriggerClick(container, item);
      });

      trigger.addEventListener('keydown', function (event) {
        handleTriggerKeydown(event, triggers, index);
      });
    });
  }

  /**
   * Inicialización automática: busca todos los .faq ya presentes en el
   * documento al momento en que este script corre (con `defer`, el DOM
   * ya está parseado). Si no hay ninguno, no hace nada — no es un error.
   */
  document.querySelectorAll(CONTAINER_SELECTOR).forEach(initFaq);

  // --- Exposición pública ---
  NAMESPACE.faq = { init: initFaq };
})();
