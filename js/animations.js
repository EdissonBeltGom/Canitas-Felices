/* =====================================================================
   CANITAS FELICES — animations.js
   Responsabilidad única: animaciones al hacer scroll.
   Observa todos los elementos [data-animate] y agrega la clase
   .is-visible (definida en animations.css) cuando entran en el viewport.

   Variantes soportadas vía data-animate: fade-up, fade-in, fade-left,
   fade-right, zoom-in, scale, reveal.

   Personalización opcional por elemento (valores en milisegundos):
     data-duration="600"   → sobreescribe --transition-slow para ese elemento
     data-delay="150"      → sobreescribe el delay (alternativa libre a
                              los pasos fijos de data-animate-delay)
   ===================================================================== */

(function () {
  'use strict';

  const ANIMATE_SELECTOR = '[data-animate]';
  const VISIBLE_CLASS = 'is-visible';

  const animatedElements = Array.from(document.querySelectorAll(ANIMATE_SELECTOR));

  if (animatedElements.length === 0) {
    return;
  }

  /**
   * Aplica data-duration/data-delay (ms) como variables CSS inline,
   * si el elemento las especifica. No hace nada si el atributo no
   * está presente o no es un número válido — el elemento simplemente
   * usa los valores por defecto del design system.
   */
  function applyCustomTiming(element) {
    const duration = Number(element.dataset.duration);
    if (Number.isFinite(duration) && duration > 0) {
      element.style.setProperty('--animate-duration', duration + 'ms');
    }

    const delay = Number(element.dataset.delay);
    if (Number.isFinite(delay) && delay >= 0) {
      element.style.setProperty('--animate-delay', delay + 'ms');
    }
  }

  animatedElements.forEach(applyCustomTiming);

  // Si el usuario prefiere movimiento reducido, mostramos todo de una vez
  // sin animar, en vez de observar el scroll innecesariamente.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    animatedElements.forEach(function (element) {
      element.classList.add(VISIBLE_CLASS);
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Navegadores muy antiguos sin soporte: mostramos todo directamente
    // para no dejar contenido oculto de forma permanente.
    animatedElements.forEach(function (element) {
      element.classList.add(VISIBLE_CLASS);
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, observerInstance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(VISIBLE_CLASS);
          // Una vez que el elemento apareció, dejamos de observarlo:
          // la animación de entrada solo debe ocurrir una vez.
          observerInstance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px' // Dispara un poco antes de que el elemento toque el borde inferior.
    }
  );

  animatedElements.forEach(function (element) {
    observer.observe(element);
  });
})();
