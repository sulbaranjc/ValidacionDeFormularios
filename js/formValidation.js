// js/formValidation.js
// ============================================================
// MÓDULO DE VALIDACIÓN DEL FORMULARIO
// - Orquesta la validación de cada campo usando:
//   1) Constraint Validation API (HTML5) → checkValidity()/validity
//   2) Reglas personalizadas (rules.js)
//   3) Mensajes configurables (messages.js)
// - Pinta/borra errores con utilidades DOM (dom.js)
// - Enchufa eventos (blur, input, change, submit, reset)
// ============================================================

import { rules } from "./validation/rules.js";          // Reglas custom (e.g., objetivos ≥ 3 palabras)
import { messages } from "./validation/messages.js";    // Textos por campo (email, altura, peso, etc.)
import { showError, clearError } from "./utils/dom.js"; // Pinta/borra mensaje y estados visuales/ARIA

// Referencia al formulario principal (id declarado en el HTML)
const form = document.getElementById("form-inscripcion");

/**
 * Devuelve el mensaje adecuado según la Constraint Validation API.
 * Prioriza mensajes “humanos” para altura y peso (los tuyos en messages.js)
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - Control a validar
 * @param {string} name - Nombre lógico del campo (coincide con name="" en el HTML)
 * @returns {string} Mensaje de error a mostrar (o "" si todo OK)
 */
function getNativeMessage(input, name) {
  const v = input.validity; // Objeto con flags: valueMissing, patternMismatch, rangeUnderflow, etc.

  // 1) Reglas genéricas de la API nativa
  if (v.valueMissing) return "Este campo es obligatorio.";   // required
  if (v.typeMismatch) {                                      // type="email" o "url"
    if (input.type === "email") return "Correo no válido.";
    if (input.type === "url")   return "URL no válida.";
    return "Valor no válido.";
  }
  if (v.patternMismatch) return input.title || "Formato inválido."; // Usa title como guía si lo diste

  // 2) Rangos/step → si es altura o peso, usamos tus mensajes personalizados
  if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch) {
    if (name === "altura" || name === "peso") {
      // Si definiste messages.altura / messages.peso, se muestran aquí
      return messages?.[name] || "Valor fuera de rango.";
    }
    // Mensajes genéricos para el resto de campos con min/max/step
    if (v.rangeUnderflow) return `El valor debe ser ≥ ${input.min}.`;
    if (v.rangeOverflow)  return `El valor debe ser ≤ ${input.max}.`;
    if (v.stepMismatch)   return input.step && input.step !== "any"
      ? `Usa incrementos de ${input.step}.`
      : "Valor no válido.";
  }

  // 3) Longitud de texto (minLength/maxLength)
  if (v.tooShort) return `Debe tener al menos ${input.minLength} caracteres.`;
  if (v.tooLong)  return `Debe tener como máximo ${input.maxLength} caracteres.`;

  return ""; // Sin errores nativos
}

/**
 * Valida un control individual del formulario.
 * Secuencia:
 *  1) Limpia customValidity y consulta checkValidity() → errores nativos (required, min/max, pattern…)
 *  2) Aplica regla personalizada (si existe en rules.js)
 *  3) Según el resultado, pinta o borra error con showError/clearError
 *
 * @param {HTMLElement} input - input/select/textarea
 * @returns {boolean} true si es válido, false si inválido
 */
function validateField(input) {
  const name = input.name;        // clave: debe coincidir con messages[name] y rules[name]
  const val  = input.value;

  // --- 1) Validación nativa
  input.setCustomValidity("");    // Asegura que no quede un estado previo forzado
  if (!input.checkValidity()) {   // La API nativa te dice si cumple required/pattern/min/max/step…
    const msg = getNativeMessage(input, name) || "Valor inválido.";
    showError(input, msg);        // Pinta mensaje + ARIA + clases de error (dom.js)
    return false;
  }

  // --- 2) Regla personalizada (si la hay)
  const rule = rules[name];
  if (rule && !rule(val)) {
    // Si define una regla custom y no pasa, mostramos tu mensaje de catálogo
    showError(input, messages[name] || "Valor inválido.");
    return false;
  }

  // --- 3) OK → limpiamos cualquier rastro de error anterior
  clearError(input);
  return true;
}

/**
 * Conecta los event listeners del formulario:
 * - blur: valida al salir del control
 * - input/change: revalida en caliente (evita que un mensaje se “pegue”)
 * - submit: valida todo; si falla, evita envío y enfoca el primer error
 */
function wireValidation() {
  const inputs = form.querySelectorAll("input, select, textarea");

  // Validación “en tiempo real” y al salir de cada campo
  inputs.forEach((el) => {
    el.addEventListener("blur",   () => validateField(el)); // al salir
    el.addEventListener("input",  () => validateField(el)); // mientras escribe
    el.addEventListener("change", () => validateField(el)); // selects/checkbox/radio
  });

  // Validación global al enviar
  form.addEventListener("submit", (e) => {
    const invalids = [];
    inputs.forEach((el) => { if (!validateField(el)) invalids.push(el); });

    if (invalids.length) {
      e.preventDefault();         // no se envía si hay errores
      invalids[0].focus();        // accesibilidad: enfoca el primer error
    }
  });
}

// Enchufamos toda la validación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", wireValidation);

/**
 * Reset “elegante”: además del reset nativo (restaura valores),
 * limpiamos todo rastro de la validación JS (mensajes, ARIA, clases…)
 * y llevamos el foco al primer control para una nueva entrada.
 *
 * Nota: si quieres que los <select multiple> queden completamente vacíos,
 * el bloque de abajo los desmarca explícitamente.
 */
(() => {
  const form = document.getElementById("form-inscripcion");
  if (!form) return;

  function limpiarEstados() {
    // Elimina todos los mensajes de error creados por JS
    form.querySelectorAll(".error-msg").forEach(n => n.remove());

    // Quita estado ARIA de error
    form.querySelectorAll("[aria-invalid='true']")
        .forEach(el => el.removeAttribute("aria-invalid"));

    // Quita clases auxiliares si las usas (bootstrap-like)
    form.querySelectorAll(".is-valid, .is-invalid")
        .forEach(el => el.classList.remove("is-valid","is-invalid"));

    // Asegura limpieza total en selects múltiples (opcional)
    form.querySelectorAll("select[multiple]").forEach(sel => {
      for (const opt of sel.options) opt.selected = false;
    });
  }

  // Cuando el usuario pulsa el botón “Limpiar” (type="reset")
  form.addEventListener("reset", () => {
    limpiarEstados(); // complementa el reset nativo
    const first = form.querySelector("input, select, textarea");
    if (first) first.focus(); // UX: listo para volver a empezar
  });
})();
