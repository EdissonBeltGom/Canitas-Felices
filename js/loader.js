/* =====================================================================
   CANITAS FELICES — loader.js
   Responsabilidad única: pantalla de carga inicial.

   Se oculta cuando se cumplen AMBAS condiciones:
   1) La página terminó de cargar (evento `load`: imágenes, fuentes, etc.)
   2) Pasó al menos MIN_DISPLAY_TIME desde que este script empezó a correr.

   El tiempo mínimo evita un "parpadeo" molesto en conexiones muy rápidas
   (loader que aparece y desaparece en 30ms), sin bloquear innecesariamente
   en conexiones lentas: nunca espera más de lo que la página ya tarda en
   cargar.
   ===================================================================== */

(function () {
  'use strict';

  const LOADER_ID = 'loader';
  const HIDDEN_CLASS = 'loader--hidden';
  const MIN_DISPLAY_TIME = 500; // ms — configurable: mínimo tiempo visible

  const loader = document.getElementById(LOADER_ID);

  if (!loader) {
    return;
  }

  const utils = window.CanitasFelices && window.CanitasFelices.utils;
  const startTime = Date.now();
  let hidden = false;

  // Bloquea el scroll mientras el loader es visible, usando el contador
  // compartido de utils.js (si está disponible) para no pisar el bloqueo
  // de otros componentes (ej. si el usuario logra interactuar muy rápido
  // con el menú móvil antes de que el loader termine de ocultarse).
  if (utils && typeof utils.lockScroll === 'function') {
    utils.lockScroll();
  }

  function hideLoader() {
    if (hidden) {
      return;
    }
    hidden = true;

    loader.classList.add(HIDDEN_CLASS);

    if (utils && typeof utils.unlockScroll === 'function') {
      utils.unlockScroll();
    } else {
      document.body.style.overflow = '';
    }

    // Espera a que termine la transición CSS antes de sacar el loader
    // del árbol de accesibilidad por completo (evita que lectores de
    // pantalla o Tab lo sigan considerando mientras se desvanece).
    const onTransitionEnd = function () {
      loader.hidden = true;
      loader.removeEventListener('transitionend', onTransitionEnd);
    };
    loader.addEventListener('transitionend', onTransitionEnd);

    // Fallback por si transitionend no dispara (ej. prefers-reduced-motion
    // deja la transición en ~0ms y el navegador podría no emitir el evento
    // de forma consistente): garantiza que el loader igual se oculte.
    window.setTimeout(function () {
      loader.hidden = true;
    }, 700);
  }

  function scheduleHide() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    window.setTimeout(hideLoader, remaining);
  }

  if (document.readyState === 'complete') {
    // La página ya terminó de cargar antes de que este script corriera
    // (ej. recursos en caché) — no hace falta esperar el evento `load`.
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide);
  }
})();
