/* =====================================================================
   CANITAS FELICES — whatsapp.js
   Responsabilidad única: todo lo relacionado con WhatsApp del sitio.

   1) Configuración centralizada: número de teléfono y plantillas de
      mensaje en un único lugar (CONFIG), en vez de repetidos en 4
      atributos href distintos del HTML.
   2) Aplica esa configuración a cualquier enlace con
      data-whatsapp-template, sobreescribiendo su href.
   3) Oculta/muestra el botón flotante mientras el Hero está visible.
   4) Registro centralizado de clics en cualquier enlace de WhatsApp.

   Nota de resiliencia: cada enlace ya trae en el HTML un href funcional
   por defecto (mismo número, mismo mensaje que CONFIG). Si este script
   no llegara a ejecutarse, los botones de WhatsApp siguen funcionando
   igual — este archivo solo centraliza dónde se actualiza el número o
   los mensajes a futuro, no crea una dependencia dura de JavaScript
   para una función tan básica (Progressive Enhancement, ver
   ARCHITECTURE.md §2.4).
   ===================================================================== */

(function () {
  'use strict';

  const FLOAT_ID = 'whatsappFloat';
  const HERO_ID = 'inicio';
  const TEMPLATE_ATTR = 'data-whatsapp-template';

  /**
   * Configuración centralizada. Para cambiar el número de teléfono o
   * el texto de cualquier mensaje predefinido del sitio, este es el
   * único lugar que hay que tocar.
   */
  const CONFIG = {
    phone: '573002258378',
    messages: {
      default: 'Hola Hogar Canitas Felices, quisiera más información',
      visita: 'Hola Hogar Canitas Felices, quisiera agendar una visita',
      plano: '' // Sin texto predefinido (ej. ícono de redes del footer)
    }
  };

  /**
   * Construye la URL de wa.me a partir de la configuración central.
   * @param {string} templateKey - clave dentro de CONFIG.messages
   * @returns {string}
   */
  function buildWhatsappUrl(templateKey) {
    const message = CONFIG.messages[templateKey] || '';
    const base = 'https://wa.me/' + CONFIG.phone;
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }

  /**
   * Sobreescribe el href de cada enlace [data-whatsapp-template] con la
   * URL centralizada. Si la plantilla referenciada no existe en CONFIG,
   * el enlace conserva su href original del HTML (fallback seguro) en
   * vez de romperse.
   */
  function applyCentralizedConfig() {
    const links = document.querySelectorAll('[' + TEMPLATE_ATTR + ']');

    links.forEach(function (link) {
      const templateKey = link.getAttribute(TEMPLATE_ATTR);
      if (!Object.prototype.hasOwnProperty.call(CONFIG.messages, templateKey)) {
        return; // Plantilla desconocida: se deja el href original tal cual.
      }
      link.href = buildWhatsappUrl(templateKey);
    });
  }

  applyCentralizedConfig();

  /* ---------------------------------------------------------------------
     Visibilidad del botón flotante (oculto mientras el Hero está visible)
     --------------------------------------------------------------------- */
  const floatButton = document.getElementById(FLOAT_ID);
  const heroSection = document.getElementById(HERO_ID);

  if (floatButton) {
    function setFloatVisible(isVisible) {
      floatButton.classList.toggle('whatsapp-float--visible', isVisible);
      floatButton.setAttribute('aria-hidden', String(!isVisible));
      floatButton.tabIndex = isVisible ? 0 : -1;
    }

    if (heroSection && 'IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setFloatVisible(!entry.isIntersecting);
          });
        },
        { threshold: 0.15 }
      );

      heroObserver.observe(heroSection);
    } else {
      setFloatVisible(true);
    }
  }

  /* ---------------------------------------------------------------------
     Registro centralizado de clics (cualquier enlace de WhatsApp)
     --------------------------------------------------------------------- */
  const whatsappButtons = document.querySelectorAll(
    'a[href*="wa.me"], a[href*="whatsapp.com"]'
  );

  whatsappButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const origin = button.id || button.className || 'whatsapp-link';
      // TODO: reemplazar por el evento real del proveedor de analítica.
      console.info('[Hogar Canitas Felices] Clic en WhatsApp desde:', origin);
    });
  });
})();
