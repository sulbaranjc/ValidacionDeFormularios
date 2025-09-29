// js/forValidation.js
// ----------------------------------------------------------------------------
// OBJETIVO (primer trimestre):
// Enseñar a validar UN SOLO campo ("Nombre") manipulando el DOM y usando
// escuchas básicos de eventos. Mantenemos la estructura en inglés para
// que sea fácil extender a más campos (email, dni, etc.) repitiendo el patrón.
//
// ¿QUÉ APRENDERÁN LOS ALUMNOS?
// - Seleccionar elementos del DOM.
// - Escuchar eventos (blur, input).
// - Crear y eliminar nodos para mostrar mensajes de error.
// - Usar atributos (ARIA y data-*) para que el CSS pinte estados (rojo/azul).
// ----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // 1) REGISTRO DE CAMPOS A VALIDAR (por ahora, solo "name")
  //    - input: referencia al <input> en el HTML
  //    - errorId: id único para el <p> del mensaje de error
  //    - minLen: longitud mínima permitida
  //    - message: texto a mostrar cuando la validación falla
  const FIELDS = {
    name: {
      input: document.getElementById('nombre'),
      errorId: 'error-name',
      minLen: 3,
      message: 'El nombre debe tener al menos 3 caracteres.',
    },
    // FUTURO: aquí se podrían añadir otros campos (email, dni, etc.)
    // email: { input: document.getElementById('email'), errorId: 'error-email', ... }
  };

  // Comprobación de seguridad: si no existe el campo de nombre, no hacemos nada.
  if (!FIELDS.name || !FIELDS.name.input) return;

  // 2) AYUDANTES DE UI (GENÉRICOS) -------------------------------------------
  // showError: pinta el campo como inválido (rojo) y crea/actualiza <p class="error-msg">
  function showError(input, errorId, message) {
    // a) Señal para CSS y accesibilidad: aria-invalid=true => borde rojo
    input.setAttribute('aria-invalid', 'true');
    // Si estaba marcado como válido anteriormente, lo quitamos
    input.removeAttribute('data-valid');

    // b) Buscamos el contenedor visual del campo (donde insertaremos el mensaje)
    const control = input.closest('.control') || input.parentElement;

    // c) Creamos el nodo <p> del mensaje si no existía; si existe, solo actualizamos texto
    let p = control.querySelector(`#${errorId}`);
    if (!p) {
      p = document.createElement('p');
      p.id = errorId;
      p.className = 'error-msg';
      // role="alert": lectores de pantalla anunciarán el error en cuanto aparezca
      p.setAttribute('role', 'alert');
      control.appendChild(p);

      // d) Vinculamos el input con el mensaje para accesibilidad (aria-describedby)
      const describedby = (input.getAttribute('aria-describedby') || '')
        .split(' ')
        .filter(Boolean);
      if (!describedby.includes(errorId)) {
        describedby.push(errorId);
        input.setAttribute('aria-describedby', describedby.join(' '));
      }
    }
    p.textContent = message;
  }

  // clearError: limpia el estado de error (quita rojo) y marca el campo como válido (azul)
  function clearError(input, errorId) {
    // a) Quita la señal de error y marca el estado como válido (para que el CSS pinte azul)
    input.removeAttribute('aria-invalid');
    input.setAttribute('data-valid', 'true');

    // b) Elimina el mensaje de error si existe
    const control = input.closest('.control') || input.parentElement;
    const p = control.querySelector(`#${errorId}`);
    if (p) p.remove();

    // c) Limpia el aria-describedby si ya no hay mensajes asociados
    const rest = (input.getAttribute('aria-describedby') || '')
      .split(' ')
      .filter(id => id && id !== errorId);
    if (rest.length) input.setAttribute('aria-describedby', rest.join(' '));
    else input.removeAttribute('aria-describedby');
  }

  // 3) VALIDADOR ESPECÍFICO DEL CAMPO "NAME" ---------------------------------
  // Regla: al menos 3 caracteres (ignorando espacios en los extremos).
  function validateName() {
    const { input, errorId, minLen, message } = FIELDS.name;
    const value = input.value.trim();

    // Si no alcanza la longitud mínima, mostramos el error y devolvemos false
    if (value.length < minLen) {
      showError(input, errorId, message);
      return false;
    }

    // Si está correcto, limpiamos cualquier error previo y devolvemos true
    clearError(input, errorId);
    return true;
  }

  // 4) CONEXIÓN DE EVENTOS (SOLO PARA "NAME" EN ESTA PRIMERA ENTREGA) --------
  function wireNameValidation() {
    const { input } = FIELDS.name;

    // Caso principal pedagógico: validar al salir del campo (blur)
    input.addEventListener('blur', validateName);

    // Opcional didáctico: mientras escribe, si ya cumple la regla, limpiamos el error
    input.addEventListener('input', () => {
      if (input.value.trim().length >= FIELDS.name.minLen) {
        clearError(input, FIELDS.name.errorId);
      }
    });

    // (Opcional para cuando agreguen más campos):
    // Evitar el envío si el nombre no es válido.
    // const form = document.getElementById('form-inscripcion');
    // form?.addEventListener('submit', (e) => {
    //   if (!validateName()) e.preventDefault();
    // });
  }

  // 5) INICIO: activamos la validación del campo "name"
  wireNameValidation();

  // -----------------------------
  // CÓMO EXTENDER (para los alumnos):
  // 1) Añadir una entrada en FIELDS para el nuevo campo:
  //    { input: document.getElementById('email'), errorId: 'error-email', message: '...', ... }
  // 2) Crear una función validateEmail() con su regla (pattern, longitud, etc.).
  // 3) Conectar eventos igual que con "name": blur + (opcional) input.
  // 4) Reutilizar showError/clearError para mantener la misma experiencia visual.
  // -----------------------------
});
