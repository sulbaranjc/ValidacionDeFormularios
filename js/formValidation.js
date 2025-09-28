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

// --- Reset elegante del formulario (sin recargar) ---
(() => {
  const form = document.getElementById("form-inscripcion");
  if (!form) return;

  // Quita errores, atributos ARIA y clases auxiliares añadidas por tu JS
  function limpiarEstados() {
    // 1) mensajes de error creados por JS
    form.querySelectorAll(".error-msg").forEach(n => n.remove());

    // 2) estados de accesibilidad/validación custom
    form.querySelectorAll("[aria-invalid='true']").forEach(el => el.removeAttribute("aria-invalid"));
    form.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
      el.classList.remove("is-valid", "is-invalid");
    });

    // 3) si quieres que los <select multiple> queden sin selección (didáctico):
    form.querySelectorAll("select[multiple]").forEach(sel => {
      for (const opt of sel.options) opt.selected = false;
    });
  }

  // Enganche al evento 'reset' del FORM (se dispara cuando haces click en el botón type="reset")
  form.addEventListener("reset", () => {
    // Deja que el navegador restaure valores…
    // …y tú limpias estados “extra” creados por JS.
    limpiarEstados();

    // Opcional: foco al primer control
    const first = form.querySelector("input, select, textarea");
    if (first) first.focus();
  });

  // Si en algún punto haces un reset manual:
  // form.reset(); limpiarEstados();
})();
// --- Exclusividad de "Ninguna" en condiciones médicas ---
(() => {
  const form = document.getElementById("form-inscripcion");
  if (!form) return;

  // Contenedor del grupo (el div .chips con role="group" y aria-label="Condiciones médicas")
  const group = form.querySelector('[role="group"][aria-label="Condiciones médicas"]');
  if (!group) return;

  const all = Array.from(group.querySelectorAll('input[type="checkbox"][name="condiciones[]"]'));
  const none = all.find(i => i.value?.toLowerCase() === "ninguna");
  const others = all.filter(i => i !== none);

  function updateStateFromNone() {
    if (!none) return;
    if (none.checked) {
      // Desmarcar y deshabilitar todas las demás
      others.forEach(i => {
        i.checked = false;
        i.disabled = true;
        i.closest("label")?.classList.add("is-disabled");
      });
    } else {
      // Habilitar todas las demás
      others.forEach(i => {
        i.disabled = false;
        i.closest("label")?.classList.remove("is-disabled");
      });
    }
  }

  function updateStateFromOthers() {
    if (!none) return;
    const anyOtherChecked = others.some(i => i.checked);
    // Si hay alguna otra marcada, "Ninguna" queda desmarcada y deshabilitada
    none.checked = false;
    none.disabled = anyOtherChecked;
    none.closest("label")?.classList.toggle("is-disabled", anyOtherChecked);
  }

  // Listeners
  if (none) none.addEventListener("change", updateStateFromNone);
  others.forEach(i => i.addEventListener("change", updateStateFromOthers));

  // Estado inicial coherente por si viene con valores pre-marcados
  updateStateFromNone();
  updateStateFromOthers();
})();
// Dentro de tu lógica de validación al hacer submit:
function validateCondicionesMedicas(form) {
  const group = form.querySelector('[role="group"][aria-label="Condiciones médicas"]');
  if (!group) return true;
  const checks = group.querySelectorAll('input[type="checkbox"][name="condiciones[]"]');
  const ok = Array.from(checks).some(i => i.checked);

  // Muestra/oculta mensaje de error bajo el grupo
  const control = group.closest(".control") || group.parentElement;
  let hint = control.querySelector(".error-msg-condiciones");
  if (!ok) {
    if (!hint) {
      hint = document.createElement("p");
      hint.className = "error-msg error-msg-condiciones";
      hint.setAttribute("role", "alert");
      control.appendChild(hint);
    }
    hint.textContent = "Selecciona al menos una opción (o marca 'Ninguna').";
  } else if (hint) {
    hint.remove();
  }
  return ok;
}

// En tu manejador de submit:
form.addEventListener("submit", (e) => {
  const okCond = validateCondicionesMedicas(form);
  // …combina con el resto de tus validaciones
  if (!okCond /* || otrasValidaciones === false */) {
    e.preventDefault();
    // Enfoca el grupo si falla
    group.querySelector('input[type="checkbox"]')?.focus();
  }
});

// --- Habilitar submit solo si se aceptan T&C (y opcionalmente RGPD) ---
(() => {
  const form = document.getElementById("form-inscripcion");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const tos = form.querySelector('input[name="tos"]');
  const rgpd = form.querySelector('input[name="rgpd"]'); // opcional

  function updateSubmitState() {
    // Requisito mínimo: T&C marcado
    let allow = !!(tos && tos.checked);

    // Si quieres exigir también RGPD, descomenta la línea:
    // allow = allow && !!(rgpd && rgpd.checked);

    if (submitBtn) {
      submitBtn.disabled = !allow;
      submitBtn.setAttribute("aria-disabled", String(!allow));
    }
  }

  // Estado inicial
  updateSubmitState();

  // Escuchas
  tos?.addEventListener("change", updateSubmitState);
  rgpd?.addEventListener("change", updateSubmitState);

  // Tras limpiar el formulario, vuelve a desactivar el submit
  form.addEventListener("reset", () => {
    // dejar que el reset nativo ocurra y luego sincronizar
    setTimeout(updateSubmitState, 0);
  });
})();
