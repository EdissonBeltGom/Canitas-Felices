/* =====================================================================
   CANITAS FELICES — scroll.js
   Responsabilidad única: botón flotante "volver arriba".

   Visibilidad: aparece una vez que el usuario descendió más allá del
   Hero (#inicio), usando IntersectionObserver sobre esa sección en vez
   de escuchar el evento scroll — coherente con el criterio de
   rendimiento ya aplicado en whatsapp.js y animations.js.

   Nota de duplicación intencional: este archivo repite un patrón muy
   similar al de whatsapp.js (mostrar/ocultar un botón flotante según
   scroll). Con solo 2 casos, CLAUDE.md (sección "no duplicar código")
   no lo considera aún candidato a abstraerse a utils.js — el umbral
   documentado es 3 repeticiones. Si aparece un tercer botón flotante,
   corresponde extraer un helper compartido.
   ===================================================================== */

(function () {
  'use strict';

  const BUTTON_ID = 'scrollTop';
  const HERO_ID = 'inicio';
  const VISIBLE_CLASS = 'scroll-top--visible';

  const button = document.getElementById(BUTTON_ID);
  const heroSection = document.getElementById(HERO_ID);

  if (!button) {
    return;
  }

  const utils = window.CanitasFelices && window.CanitasFelices.utils;

  function setVisible(isVisible) {
    button.classList.toggle(VISIBLE_CLASS, isVisible);
    button.setAttribute('aria-hidden', String(!isVisible));
    button.tabIndex = isVisible ? 0 : -1;
  }

  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Visible una vez que el Hero YA NO está en pantalla.
          setVisible(!entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    heroObserver.observe(heroSection);
  } else {
    // Sin Hero o sin soporte de IntersectionObserver: se deja siempre
    // visible para no perder la funcionalidad, en vez de ocultarla.
    setVisible(true);
  }

  function scrollToTop() {
    const reduceMotion = utils && typeof utils.prefersReducedMotion === 'function'
      ? utils.prefersReducedMotion()
      : false;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });

    // El botón desaparecerá apenas el Hero vuelva a estar en pantalla
    // (el propio IntersectionObserver de arriba lo oculta), así que el
    // foco no puede quedarse en él: se mueve al inicio real de la
    // página, con el mismo patrón accesible ya usado en navbar.js.
    if (heroSection) {
      heroSection.setAttribute('tabindex', '-1');
      heroSection.focus({ preventScroll: true });
      heroSection.addEventListener(
        'blur',
        function onBlur() {
          heroSection.removeAttribute('tabindex');
          heroSection.removeEventListener('blur', onBlur);
        },
        { once: true }
      );
    }
  }

  button.addEventListener('click', scrollToTop);
})();
