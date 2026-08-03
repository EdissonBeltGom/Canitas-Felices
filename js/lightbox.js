/* =====================================================================
   CANITAS FELICES — lightbox.js
   Responsabilidad única: modal de galería a pantalla completa.

   Expone una API pública mínima en window.CanitasFelices.lightbox para
   que cualquier otro módulo (hoy: gallery.js) pueda abrirlo sin que
   este archivo necesite conocer de dónde vienen las imágenes:

     CanitasFelices.lightbox.open(photos, startIndex)

   donde `photos` es un arreglo de { src, caption } y `startIndex` es
   la posición inicial dentro de ese arreglo.

   Construye su propio DOM una sola vez (al cargar el script) y lo deja
   oculto con el atributo `hidden`, siguiendo el mismo patrón ya usado
   en loader.js para no interferir con el árbol de accesibilidad
   mientras no está en uso.
   ===================================================================== */

(function () {
  'use strict';

  const NAMESPACE = (window.CanitasFelices = window.CanitasFelices || {});
  const utils = NAMESPACE.utils;

  const VISIBLE_CLASS = 'lightbox--visible';
  const ZOOMED_CLASS = 'lightbox__img--zoomed';
  const SWIPE_THRESHOLD = 50; // px mínimos para considerar un swipe horizontal

  let photos = [];
  let currentIndex = 0;
  let lastFocusedElement = null;
  let focusTrap = null;

  /* ---------------------------------------------------------------------
     Construcción del DOM (una sola vez)
     --------------------------------------------------------------------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Galería de imágenes ampliada');
  lightbox.hidden = true;

  lightbox.innerHTML = [
    '<div class="lightbox__overlay" data-lightbox-action="close"></div>',
    '<button type="button" class="lightbox__close" aria-label="Cerrar galería">',
    '  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    '</button>',
    '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Imagen anterior">',
    '  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    '</button>',
    '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Imagen siguiente">',
    '  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    '</button>',
    '<figure class="lightbox__figure">',
    '  <img class="lightbox__img" src="" alt="" data-lightbox-action="zoom">',
    '  <figcaption class="lightbox__caption"></figcaption>',
    '</figure>',
    '<p class="lightbox__counter" aria-live="polite"></p>'
  ].join('');

  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector('.lightbox__img');
  const captionEl = lightbox.querySelector('.lightbox__caption');
  const counterEl = lightbox.querySelector('.lightbox__counter');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const overlayEl = lightbox.querySelector('.lightbox__overlay');

  /* ---------------------------------------------------------------------
     Preload de imágenes cercanas
     --------------------------------------------------------------------- */
  function preload(index) {
    if (!photos[index]) {
      return;
    }
    const img = new Image();
    img.src = photos[index].src;
  }

  function preloadNeighbors(index) {
    preload((index + 1) % photos.length);
    preload((index - 1 + photos.length) % photos.length);
  }

  /* ---------------------------------------------------------------------
     Render del slide actual
     --------------------------------------------------------------------- */
  function renderCurrent() {
    const photo = photos[currentIndex];
    if (!photo) {
      return;
    }

    imgEl.classList.remove(ZOOMED_CLASS);
    imgEl.src = photo.src;
    imgEl.alt = photo.caption;
    captionEl.textContent = photo.caption;
    counterEl.textContent = (currentIndex + 1) + ' / ' + photos.length;

    preloadNeighbors(currentIndex);
  }

  function goTo(index) {
    currentIndex = (index + photos.length) % photos.length; // navegación cíclica
    renderCurrent();
  }

  function goNext() {
    goTo(currentIndex + 1);
  }

  function goPrev() {
    goTo(currentIndex - 1);
  }

  /* ---------------------------------------------------------------------
     Apertura / cierre
     --------------------------------------------------------------------- */
  function open(photoList, startIndex) {
    if (!Array.isArray(photoList) || photoList.length === 0) {
      return;
    }

    photos = photoList;
    currentIndex = startIndex || 0;
    lastFocusedElement = document.activeElement;

    lightbox.hidden = false;
    renderCurrent();

    // Un frame después de quitar `hidden`, para que la transición de
    // opacidad sí se ejecute (si se agregara la clase en el mismo frame
    // en que se quita `hidden`, el navegador podría no animar el cambio).
    window.requestAnimationFrame(function () {
      lightbox.classList.add(VISIBLE_CLASS);
    });

    if (utils && typeof utils.lockScroll === 'function') {
      utils.lockScroll();
    }

    if (utils && typeof utils.trapFocus === 'function') {
      focusTrap = utils.trapFocus(lightbox);
    }

    closeBtn.focus();

    document.addEventListener('keydown', handleKeydown);
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  function close() {
    if (lightbox.hidden) {
      return;
    }

    lightbox.classList.remove(VISIBLE_CLASS);

    if (utils && typeof utils.unlockScroll === 'function') {
      utils.unlockScroll();
    }

    if (focusTrap) {
      focusTrap.release();
      focusTrap = null;
    }

    document.removeEventListener('keydown', handleKeydown);
    lightbox.removeEventListener('touchstart', handleTouchStart);
    lightbox.removeEventListener('touchend', handleTouchEnd);

    const finishClose = function () {
      lightbox.hidden = true;
      imgEl.src = '';
    };

    const onTransitionEnd = function () {
      lightbox.removeEventListener('transitionend', onTransitionEnd);
      finishClose();
    };
    lightbox.addEventListener('transitionend', onTransitionEnd);
    // Fallback por si transitionend no dispara (ej. reduced motion).
    window.setTimeout(finishClose, 500);

    // Devuelve el foco a quien abrió el lightbox — sin esto, un usuario
    // de teclado "perdería" su posición en la página al cerrar.
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function toggleZoom() {
    imgEl.classList.toggle(ZOOMED_CLASS);
  }

  /* ---------------------------------------------------------------------
     Eventos
     --------------------------------------------------------------------- */
  function handleKeydown(event) {
    switch (event.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        goPrev();
        break;
      case 'ArrowRight':
        goNext();
        break;
      default:
        break;
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // Solo se interpreta como swipe de navegación si el desplazamiento
    // horizontal es claramente mayor que el vertical (evita confundir
    // un scroll/gesto vertical accidental con un cambio de imagen).
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  overlayEl.addEventListener('click', close);
  imgEl.addEventListener('click', toggleZoom);

  // --- Exposición pública ---
  NAMESPACE.lightbox = { open, close };
})();
