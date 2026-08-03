/* =====================================================================
   CANITAS FELICES — gallery.js
   Responsabilidad única: alternar la galería de fotos entre sedes.
   Al seleccionar una sede en los tabs, se reconstruye el contenido de
   #gallery-grid mostrando únicamente las fotografías correspondientes.

   Además:
   - Cada fotografía abre el lightbox (lightbox.js) al hacer clic o con
     teclado (Enter/Espacio), pasándole el set completo de la sede
     actual para que la navegación con flechas circule por esas mismas
     imágenes.
   - Tras renderizar una sede, se precargan en segundo plano las
     imágenes de la otra sede, para que cambiar de tab se sienta
     instantáneo la mayoría de las veces.
   ===================================================================== */

(function () {
  'use strict';

  const GRID_ID = 'gallery-grid';
  const TAB_SELECTOR = '.gallery__tab';

  const grid = document.getElementById(GRID_ID);
  const tabs = document.querySelectorAll(TAB_SELECTOR);

  if (!grid || tabs.length === 0) {
    return;
  }

  const lightbox = window.CanitasFelices && window.CanitasFelices.lightbox;

  /**
   * Banco de imágenes por sede.
   * Las rutas coinciden con la arquitectura del proyecto:
   * img/sedes/la-pampa/  y  img/sedes/campestre/
   * Para agregar o quitar fotos, solo hay que editar estos arreglos:
   * no es necesario tocar el HTML ni el resto del script.
   */
  const GALLERIES = {
    'la-pampa': [
      { src: 'img/sedes/la-pampa/jardin.jpg', caption: 'Jardines principales' },
      { src: 'img/sedes/la-pampa/habitacion.jpg', caption: 'Habitación individual' },
      { src: 'img/sedes/la-pampa/comedor.jpg', caption: 'Comedor comunitario' },
      { src: 'img/sedes/la-pampa/sala-terapias.jpg', caption: 'Sala de terapias' },
      { src: 'img/sedes/la-pampa/zona-recreativa.jpg', caption: 'Zona recreativa' },
      { src: 'img/sedes/la-pampa/fachada.jpg', caption: 'Fachada principal' }
    ],
    campestre: [
      { src: 'img/sedes/campestre/fachada.jpg', caption: 'Fachada principal' },
      { src: 'img/sedes/campestre/patio-interno.jpg', caption: 'Patio interno' },
      { src: 'img/sedes/campestre/habitacion.jpg', caption: 'Habitación compartida' },
      { src: 'img/sedes/campestre/sala-comun.jpg', caption: 'Sala común' },
      { src: 'img/sedes/campestre/huerta.jpg', caption: 'Huerta terapéutica' },
      { src: 'img/sedes/campestre/comedor.jpg', caption: 'Comedor principal' }
    ]
  };

  const LOCATION_NAMES = {
    'la-pampa': 'Sede La Pampa',
    campestre: 'Sede Campestre'
  };

  const preloadedLocations = new Set();

  /**
   * Precarga en segundo plano las imágenes de una sede que todavía no
   * se ha mostrado, sin bloquear nada visualmente. Se ejecuta una sola
   * vez por sede (evita volver a descargar lo ya precargado).
   */
  function preloadLocation(locationKey) {
    if (preloadedLocations.has(locationKey)) {
      return;
    }
    preloadedLocations.add(locationKey);

    const photos = GALLERIES[locationKey] || [];
    photos.forEach(function (photo) {
      const img = new Image();
      img.src = photo.src;
    });
  }

  /**
   * Construye y muestra el grid de imágenes de la sede indicada.
   * Se limpia el contenedor y se reconstruye desde cero: al haber pocas
   * decenas de imágenes como máximo, es más simple y confiable que
   * intentar mostrar/ocultar nodos existentes.
   */
  function renderGallery(locationKey) {
    const photos = GALLERIES[locationKey];
    grid.innerHTML = '';

    if (!photos || photos.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'gallery__empty';
      emptyState.textContent = 'Muy pronto agregaremos fotografías de esta sede.';
      grid.appendChild(emptyState);
      return;
    }

    const locationLabel = LOCATION_NAMES[locationKey] || '';

    photos.forEach(function (photo, index) {
      const item = document.createElement('figure');
      item.className = 'gallery__item is-entering';

      // Operable con mouse, teclado y lectores de pantalla: no es un
      // <button> nativo porque envuelve una <figure> con su propio
      // <figcaption> (semántica de imagen + leyenda), así que se
      // replican los atributos de rol/teclado manualmente.
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Ver imagen ampliada: ' + photo.caption);

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption + ' — ' + locationLabel + ', Hogar Canitas Felices';
      img.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.className = 'gallery__item-caption';
      caption.textContent = photo.caption;

      item.appendChild(img);
      item.appendChild(caption);

      function openLightbox() {
        if (lightbox && typeof lightbox.open === 'function') {
          lightbox.open(photos, index);
        }
      }

      item.addEventListener('click', openLightbox);
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); // evita que Espacio también desplace la página
          openLightbox();
        }
      });

      grid.appendChild(item);
    });

    // Precarga la(s) sede(s) que no se están mostrando ahora mismo.
    Object.keys(GALLERIES)
      .filter(function (key) {
        return key !== locationKey;
      })
      .forEach(preloadLocation);
  }

  /**
   * Marca visualmente el tab activo y actualiza sus atributos ARIA,
   * de acuerdo con el patrón de accesibilidad para tabs (WAI-ARIA).
   */
  function setActiveTab(selectedTab) {
    tabs.forEach(function (tab) {
      const isSelected = tab === selectedTab;
      tab.classList.toggle('is-active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });
  }

  function handleTabClick(event) {
    const tab = event.currentTarget;
    const locationKey = tab.dataset.gallery;

    if (!locationKey || tab.classList.contains('is-active')) {
      return; // Evita volver a renderizar si ya está seleccionada.
    }

    setActiveTab(tab);
    grid.setAttribute('aria-labelledby', tab.id);
    renderGallery(locationKey);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', handleTabClick);
  });

  /**
   * Permite que otras partes del sitio (por ejemplo, los botones
   * "Conocer instalaciones" de la sección Sedes) abran directamente
   * la galería de una sede específica, usando el atributo
   * data-location="la-pampa" / "campestre".
   */
  document.querySelectorAll('[data-location]').forEach(function (button) {
    button.addEventListener('click', function () {
      const locationKey = button.dataset.location;
      const targetTab = document.querySelector(
        '.gallery__tab[data-gallery="' + locationKey + '"]'
      );
      if (targetTab && !targetTab.classList.contains('is-active')) {
        setActiveTab(targetTab);
        grid.setAttribute('aria-labelledby', targetTab.id);
        renderGallery(locationKey);
      }
    });
  });

  // Carga inicial: muestra la sede del tab marcado como activo en el HTML
  // (por defecto, "la-pampa"), sin esperar a que el usuario haga clic.
  const initialTab = document.querySelector(TAB_SELECTOR + '.is-active') || tabs[0];
  renderGallery(initialTab.dataset.gallery);
})();
