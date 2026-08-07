/* =====================================================================
   CANITAS FELICES — form.js
   Responsabilidad única: formulario de contacto.
   Separado de app.js (que antes lo orquestaba) para que app.js quede
   como puro punto de inicialización general, no dueño de lógica de
   ningún componente específico.

   Contiene:
   1) Validación de campos en el cliente.
   2) Estados de carga (is-loading) y de éxito/error diferenciados.
   3) Envío real vía Web3Forms (https://web3forms.com) — servicio
      gratuito de formulario-a-correo, sin backend propio. La Access
      Key es intencionalmente pública: Web3Forms la diseña para vivir
      en código de cliente (funciona como un alias de la dirección de
      correo destino, no como un secreto — ver su documentación oficial).
      Cuando exista un backend propio (ADR-007, Sprint 8), solo esta
      función (submitToApi) cambia — el resto del archivo no se toca.
   ===================================================================== */

(function () {
  'use strict';

  const FORM_ID = 'contactForm';
  const SUBMIT_ID = 'formSubmit';
  const SUCCESS_ID = 'formSuccess';
  const ERROR_ID = 'formError';
  const LOADING_CLASS = 'is-loading';

  const NAMESPACE = (window.CanitasFelices = window.CanitasFelices || {});

  // Configuración centralizada del envío — mismo criterio que CONFIG en
  // whatsapp.js: un único lugar para actualizar si cambia el destino.
  const WEB3FORMS_CONFIG = {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '0bce8f52-8585-4dc4-bf92-84f479727f45',
    subject: 'Nuevo mensaje desde el sitio web — Hogar Canitas Felices'
  };

  /**
   * Envía el formulario a Web3Forms, que lo reenvía por correo a la
   * dirección configurada en la cuenta de Web3Forms
   * (contacto@hogarcanitasfelices.com).
   */
  function submitToApi(payload) {
    // Hook de prueba manual: permite forzar el estado de error desde la
    // consola sin gastar cupo de envíos reales, ej.:
    //   CanitasFelices.form.debugForceError = true
    if (NAMESPACE.form && NAMESPACE.form.debugForceError) {
      return Promise.reject(new Error('Error simulado (debugForceError activo)'));
    }

    return fetch(WEB3FORMS_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_CONFIG.accessKey,
        subject: WEB3FORMS_CONFIG.subject,
        name: payload.nombre,
        email: payload.correo,
        telefono: payload.telefono,
        mensaje: payload.mensaje
      })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error del servidor de Web3Forms');
          }
          return data;
        });
      });
  }

  function initContactForm() {
    const form = document.getElementById(FORM_ID);
    if (!form) {
      return;
    }

    const submitButton = document.getElementById(SUBMIT_ID);
    const successMessage = document.getElementById(SUCCESS_ID);
    const errorBanner = document.getElementById(ERROR_ID);

    const validators = {
      nombre: function (value) {
        return value.trim().length >= 3;
      },
      correo: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      },
      telefono: function (value) {
        // Acepta dígitos, espacios, guiones, paréntesis y un + inicial opcional.
        return /^\+?[\d\s()-]{7,15}$/.test(value.trim());
      },
      mensaje: function (value) {
        return value.trim().length >= 10;
      }
    };

    /**
     * Valida un campo individual y refleja el resultado en su
     * form__group (agrega/quita .is-invalid, definido en contact.css).
     */
    function validateField(field) {
      const group = field.closest('.form__group');
      const validate = validators[field.name];
      if (!group || !validate) {
        return true;
      }

      const isValid = validate(field.value);
      group.classList.toggle('is-invalid', !isValid);
      return isValid;
    }

    // Valida en tiempo real cuando el usuario sale de un campo,
    // sin ser intrusivo mientras todavía está escribiendo.
    Object.keys(validators).forEach(function (fieldName) {
      const field = form.elements[fieldName];
      if (field) {
        field.addEventListener('blur', function () {
          validateField(field);
        });
        // Si el campo ya estaba marcado como inválido, lo revalida
        // mientras el usuario escribe para quitar el error apenas se corrige.
        field.addEventListener('input', function () {
          const group = field.closest('.form__group');
          if (group && group.classList.contains('is-invalid')) {
            validateField(field);
          }
        });
      }
    });

    function setLoading(isLoading) {
      if (submitButton) {
        submitButton.classList.toggle(LOADING_CLASS, isLoading);
        submitButton.disabled = isLoading;
      }
      form.setAttribute('aria-busy', String(isLoading));
    }

    function hideMessages() {
      if (successMessage) {
        successMessage.classList.remove('is-visible');
      }
      if (errorBanner) {
        errorBanner.classList.remove('is-visible');
      }
    }

    function showSuccess() {
      if (!successMessage) {
        return;
      }
      successMessage.classList.add('is-visible');
      successMessage.setAttribute('tabindex', '-1');
      successMessage.focus();

      window.setTimeout(function () {
        successMessage.classList.remove('is-visible');
      }, 6000);
    }

    function showError() {
      if (!errorBanner) {
        return;
      }
      errorBanner.classList.add('is-visible');
      errorBanner.setAttribute('tabindex', '-1');
      errorBanner.focus();
    }

    function focusFirstInvalidField() {
      const firstInvalidGroup = form.querySelector('.form__group.is-invalid');
      if (firstInvalidGroup) {
        const firstInvalidField = firstInvalidGroup.querySelector(
          '.form__input, .form__textarea'
        );
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    }

    function collectPayload() {
      return {
        nombre: form.elements.nombre.value.trim(),
        correo: form.elements.correo.value.trim(),
        telefono: form.elements.telefono.value.trim(),
        mensaje: form.elements.mensaje.value.trim()
      };
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hideMessages();

      let isFormValid = true;
      Object.keys(validators).forEach(function (fieldName) {
        const field = form.elements[fieldName];
        if (field && !validateField(field)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        focusFirstInvalidField();
        return;
      }

      setLoading(true);

      submitToApi(collectPayload())
        .then(function () {
          form.reset();
          showSuccess();
        })
        .catch(function () {
          showError();
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }

  initContactForm();

  // --- Exposición pública mínima (solo para el hook de prueba manual) ---
  NAMESPACE.form = { debugForceError: false };
})();
