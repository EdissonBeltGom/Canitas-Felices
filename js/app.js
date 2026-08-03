/* =====================================================================
   CANITAS FELICES — app.js
   Responsabilidad única: inicialización general del sitio que no
   pertenece a ningún componente específico (hoy: solo el año dinámico
   del footer). La lógica del formulario vive en form.js; navbar,
   galería, lightbox, whatsapp, scroll-to-top, loader y animaciones se
   inicializan a sí mismos en sus propios archivos — app.js no los
   orquesta, cada uno es independiente.

   Nota: no se envuelve en un listener de DOMContentLoaded. Todos los
   scripts del sitio se cargan con `defer`, que ya garantiza que el DOM
   está completamente parseado antes de que cualquier script se
   ejecute — agregar DOMContentLoaded encima sería redundante.
   ===================================================================== */

(function () {
  'use strict';

  /**
   * AÑO DINÁMICO EN EL FOOTER
   * Evita tener que actualizar manualmente el "© 2026" cada enero.
   */
  function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  setCurrentYear();
})();
