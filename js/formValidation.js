// js/formValidation.js
import { rules } from "./validation/rules.js";
import { messages } from "./validation/messages.js";
import { showError, clearError } from "./utils/dom.js";

const form = document.getElementById("form-inscripcion");

function validateField(input) {
  const name = input.name;
  const val = input.value;
  const isRequired = input.hasAttribute("required");
  if (isRequired && !val.trim()) {
    showError(input, messages.required);
    return false;
  }
  const rule = rules[name];
  if (rule && !rule(val)) {
    showError(input, messages[name] || "Valor inválido.");
    return false;
  }
  clearError(input);
  return true;
}

function wireValidation() {
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => {
      // validación perezosa: limpiar si pasa
      if (el.getAttribute("aria-invalid") === "true") validateField(el);
    });
  });

  form.addEventListener("submit", (e) => {
    const invalids = [];
    inputs.forEach((el) => { if (!validateField(el)) invalids.push(el); });
    if (invalids.length) {
      e.preventDefault();
      invalids[0].focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", wireValidation);
