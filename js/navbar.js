/* =====================================================================
   CANITAS FELICES — navbar.js
   Responsabilidad única: comportamiento de la navbar.
   1) Cambiar de transparente a sólida al hacer scroll.
   2) Abrir/cerrar el menú móvil (hamburguesa).
   3) Cerrar el menú móvil al seleccionar un enlace o al hacer clic afuera.
   4) Indicador de sección activa (scrollspy) mediante IntersectionObserver.
   5) Scroll suave y accesible: mueve el foco a la sección destino, no
      solo la vista, para que la navegación por teclado continúe desde
      ahí en vez de retomar donde estaba el enlace.
   ===================================================================== */

(function () {
  'use strict';

  const NAVBAR_ID = 'navbar';
  const TOGGLE_ID = 'navbarToggle';
  const MENU_ID = 'navbarMenu';
  const SCROLL_THRESHOLD = 60; // píxeles de scroll antes de activar el estado sólido
  const ACTIVE_CLASS = 'is-active';

  const navbar = document.getElementById(NAVBAR_ID);
  const toggle = document.getElementById(TOGGLE_ID);
  const menu = document.getElementById(MENU_ID);

  if (!navbar || !toggle || !menu) {
    // Si falta algún elemento clave, no continuamos para evitar errores en consola.
    return;
  }

  const utils = window.CanitasFelices && window.CanitasFelices.utils;
  const navLinks = Array.from(menu.querySelectorAll('.navbar__link'));

  /* ---------------------------------------------------------------------
     1) Cambio de estado de la navbar al hacer scroll
     --------------------------------------------------------------------- */
  let ticking = false;

  function updateNavbarBackground() {
    const shouldBeSolid = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('navbar--scrolled', shouldBeSolid);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarBackground);
      ticking = true;
    }
  }

  /* ---------------------------------------------------------------------
     2) Menú móvil
     --------------------------------------------------------------------- */
  function setMenuOpen(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );

    // Bloquea/libera el scroll usando el contador compartido de utils.js,
    // para no pisar el bloqueo de otros componentes (ej. loader, futuro
    // lightbox) que puedan estar activos al mismo tiempo.
    if (utils && typeof utils.lockScroll === 'function') {
      if (isOpen) {
        utils.lockScroll();
      } else {
        utils.unlockScroll();
      }
    } else {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

  function toggleMenu() {
    const isCurrentlyOpen = menu.classList.contains('is-open');
    setMenuOpen(!isCurrentlyOpen);
  }

  function closeMenu() {
    if (menu.classList.contains('is-open')) {
      setMenuOpen(false);
    }
  }

  /* ---------------------------------------------------------------------
     3) Scroll suave + foco accesible al seleccionar un enlace
     --------------------------------------------------------------------- */
  function handleNavLinkClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href') || '';

    if (href.charAt(0) !== '#' || href.length < 2) {
      // No es un ancla interna (no debería ocurrir en la navbar, pero se
      // deja como salvaguarda antes de interceptar el comportamiento nativo).
      closeMenu();
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    const reduceMotion = utils && typeof utils.prefersReducedMotion === 'function'
      ? utils.prefersReducedMotion()
      : false;

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });

    // Mueve el foco de teclado a la sección destino (no solo la vista),
    // para que Tab continúe desde ahí en vez de retomar en el enlace de
    // origen. `tabindex="-1"` la hace focusable programáticamente sin
    // agregarla al orden normal de tabulación.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    target.addEventListener(
      'blur',
      function onBlur() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', onBlur);
      },
      { once: true }
    );

    history.pushState(null, '', href);
  }

  /* ---------------------------------------------------------------------
     4) Indicador de sección activa (scrollspy vía IntersectionObserver)
     --------------------------------------------------------------------- */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) {
      return; // Degradación aceptable: sin indicador, pero sin errores.
    }

    const sectionLinkMap = new Map();

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) {
        return;
      }
      const section = document.getElementById(href.slice(1));
      if (section) {
        sectionLinkMap.set(section, link);
      }
    });

    if (sectionLinkMap.size === 0) {
      return;
    }

    function setActiveLink(activeLink) {
      navLinks.forEach(function (link) {
        link.classList.toggle(ACTIVE_CLASS, link === activeLink);
        if (link === activeLink) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    const observer = new IntersectionObserver(
      function (entries) {
        // Si varias secciones intersectan la franja observada a la vez,
        // se prioriza la más cercana al tope del viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const activeSection = visible[0].target;
          setActiveLink(sectionLinkMap.get(activeSection));
        }
      },
      {
        // Franja delgada cerca del centro superior del viewport: una
        // sección se considera "activa" cuando su borde la cruza.
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );

    sectionLinkMap.forEach(function (_link, section) {
      observer.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
     Eventos
     --------------------------------------------------------------------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', handleNavLinkClick);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  const handleResize = function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  };

  // Con debounce: resize puede disparar decenas de eventos por segundo
  // mientras el usuario arrastra el borde de la ventana; closeMenu() no
  // necesita evaluarse en cada uno de ellos, solo cuando el usuario
  // termina de redimensionar.
  window.addEventListener(
    'resize',
    utils && typeof utils.debounce === 'function' ? utils.debounce(handleResize, 150) : handleResize
  );

  // Estado inicial: por si la página se carga ya con scroll (p. ej. al volver
  // con el botón "atrás" del navegador).
  updateNavbarBackground();
  initScrollSpy();
})();
