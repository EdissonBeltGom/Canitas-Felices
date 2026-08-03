/* =====================================================================
   CANITAS FELICES — utils.js
   Responsabilidad única: funciones de utilidad reutilizables, sin
   conocimiento de ningún componente específico del sitio.

   Este archivo debe cargarse ANTES que cualquier otro script que lo
   consuma (navbar.js, scroll.js, lightbox.js, loader.js, faq.js, etc.),
   ya que expone sus funciones en el namespace global único del proyecto:

     window.CanitasFelices.utils

   Se usa un único objeto global (en vez de módulos ES import/export)
   de forma consistente con ADR-004: el sitio debe poder abrirse con
   doble clic (file://) sin servidor ni bundler. Es la única variable
   global que este proyecto introduce; todo lo demás cuelga de ella.
   ===================================================================== */

(function () {
  'use strict';

  const NAMESPACE = (window.CanitasFelices = window.CanitasFelices || {});

  /**
   * Retrasa la ejecución de `fn` hasta que hayan pasado `wait` ms sin que
   * se vuelva a llamar. Útil para eventos de alta frecuencia donde solo
   * interesa el "valor final" (ej. resize, input de búsqueda).
   * @param {Function} fn
   * @param {number} wait - milisegundos de espera (por defecto 200)
   * @returns {Function}
   */
  function debounce(fn, wait) {
    const delay = typeof wait === 'number' ? wait : 200;
    let timeoutId;

    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Garantiza que `fn` se ejecute como máximo una vez cada `limit` ms,
   * sin importar cuántas veces se invoque en ese intervalo. Útil para
   * eventos continuos donde sí interesan actualizaciones intermedias
   * (ej. scroll, mousemove), a diferencia de debounce.
   * @param {Function} fn
   * @param {number} limit - milisegundos entre ejecuciones (por defecto 200)
   * @returns {Function}
   */
  function throttle(fn, limit) {
    const interval = typeof limit === 'number' ? limit : 200;
    let waiting = false;
    let pendingArgs = null;

    return function throttled(...args) {
      if (waiting) {
        // Guarda la llamada más reciente para ejecutarla al final del
        // intervalo, evitando perder el último estado (ej. posición
        // de scroll final) mientras se descartan las llamadas intermedias.
        pendingArgs = args;
        return;
      }

      fn.apply(this, args);
      waiting = true;

      window.setTimeout(() => {
        waiting = false;
        if (pendingArgs) {
          const argsToRun = pendingArgs;
          pendingArgs = null;
          throttled.apply(this, argsToRun);
        }
      }, interval);
    };
  }

  /**
   * Restringe un valor numérico a un rango [min, max].
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Indica si el usuario tiene activada la preferencia de sistema
   * "reducir movimiento". Los módulos de animación deben consultar esto
   * antes de animar, en vez de que cada uno repita su propia consulta
   * de media query (ya se aplica a nivel CSS global en styles.css; esta
   * función es el equivalente para decisiones que deben tomarse en JS,
   * ej. si vale la pena animar el conteo de un número o no).
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Bloqueo de scroll del body con contador de referencias.
   *
   * Varios componentes independientes (menú móvil, lightbox, loader)
   * pueden necesitar bloquear el scroll al mismo tiempo. Si cada uno
   * simplemente hiciera `body.style.overflow = 'hidden' / ''`, el que
   * se cierre primero desbloquearía el scroll aunque otro componente
   * todavía lo necesite bloqueado. El contador evita ese conflicto:
   * el scroll solo se restaura cuando TODOS los que lo bloquearon lo
   * liberan.
   */
  let lockCount = 0;

  function lockScroll() {
    lockCount += 1;
    if (lockCount === 1) {
      document.body.style.overflow = 'hidden';
    }
  }

  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Devuelve todos los elementos focusables visibles dentro de un
   * contenedor, en orden de tabulación. Base para implementar "focus
   * trap" en componentes modales (lightbox) — evita que Tab saque el
   * foco del modal hacia el contenido de fondo.
   * @param {HTMLElement} container
   * @returns {HTMLElement[]}
   */
  function getFocusableElements(container) {
    if (!container) {
      return [];
    }

    const SELECTOR = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(SELECTOR)).filter(
      (el) => el.offsetParent !== null // descarta elementos ocultos (display: none)
    );
  }

  /**
   * Atrapa el foco de teclado dentro de `container` mientras esté activo:
   * Tab en el último elemento vuelve al primero, y Shift+Tab en el primero
   * vuelve al último. Devuelve una función `release()` para desactivar la
   * trampa (debe llamarse siempre al cerrar el componente que la activó).
   * @param {HTMLElement} container
   * @returns {{release: Function}}
   */
  function trapFocus(container) {
    function handleKeydown(event) {
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeydown);

    return {
      release() {
        container.removeEventListener('keydown', handleKeydown);
      }
    };
  }

  // --- Exposición pública ---
  NAMESPACE.utils = {
    debounce,
    throttle,
    clamp,
    prefersReducedMotion,
    lockScroll,
    unlockScroll,
    getFocusableElements,
    trapFocus
  };
})();
