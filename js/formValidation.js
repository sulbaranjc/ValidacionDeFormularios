/**
 * ============================================================
 * SISTEMA DE VALIDACIÓN DE FORMULARIOS
 * ============================================================
 * 
 * Este módulo implementa un sistema completo de validación para formularios HTML
 * que combina:
 * 
 * 1. VALIDACIÓN NATIVA del navegador (HTML5 Constraint Validation API)
 *    - Atributos como required, pattern, min, max, minlength, etc.
 *    - La API ValidityState nos dice QUÉ falló en cada campo
 * 
 * 2. VALIDACIÓN PERSONALIZADA (custom rules)
 *    - Reglas de negocio específicas definidas en rules.js
 *    - Por ejemplo: validar que la edad sea ≥16 años
 * 
 * 3. FEEDBACK VISUAL Y ACCESIBLE
 *    - Muestra mensajes de error amigables al usuario
 *    - Usa ARIA para accesibilidad (lectores de pantalla)
 * 
 * 4. CONTROL DEL BOTÓN SUBMIT
 *    - Solo se habilita cuando TODO el formulario es válido
 *    - Evita envíos de datos incorrectos
 * 
 * FLUJO GENERAL:
 * - El usuario interactúa con los campos (escribe, sale del campo, etc.)
 * - En cada evento (blur, input, change) validamos el campo
 * - Si hay error: mostramos mensaje y bloqueamos el submit
 * - Si todo está OK: limpiamos errores y habilitamos el submit
 * ============================================================
 */

import { rules } from "./validation/rules.js";
import { messages } from "./validation/messages.js";
import { showError, clearError } from "./utils/dom.js";

/** ID del formulario principal que vamos a validar */
const FORM_ID = "form-inscripcion";

// ============================================================
// SECCIÓN 1: VALIDACIÓN NATIVA (HTML5)
// ============================================================

/**
 * Obtiene un mensaje de error amigable basado en la validación nativa del navegador.
 * 
 * CONCEPTO CLAVE: El navegador ya valida automáticamente según los atributos HTML
 * (required, type="email", pattern, min, max, etc.). El objeto input.validity nos
 * dice QUÉ regla falló. Esta función traduce eso a un mensaje comprensible.
 * 
 * @param {HTMLInputElement} input - El campo que falló la validación
 * @param {string} name - El nombre del campo (para mensajes específicos)
 * @returns {string} Mensaje de error amigable para el usuario
 * 
 * @example
 * // Si un input type="email" tiene valor "abc", input.validity.typeMismatch será true
 * getNativeMessage(inputEmail, 'email') // → "Correo no válido."
 * 
 * @see https://developer.mozilla.org/es/docs/Web/API/ValidityState
 */
function getNativeMessage(input, name) {
  // El objeto ValidityState contiene propiedades booleanas que indican qué falló
  const v = input.validity;

  // CASO 1: Campo obligatorio vacío (atributo required)
  if (v.valueMissing) {
    return "Este campo es obligatorio.";
  }

  // CASO 2: El valor no coincide con el tipo esperado (type="email", type="url")
  if (v.typeMismatch) {
    if (input.type === "email") return "Correo no válido.";
    if (input.type === "url") return "URL no válida.";
    return "Valor no válido.";
  }

  // CASO 3: No coincide con el patrón regex (atributo pattern)
  // El atributo title del input se usa como mensaje de ayuda
  if (v.patternMismatch) {
    return input.title || "Formato inválido.";
  }

  // CASO 4: Problemas con rangos numéricos (min, max, step)
  if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch) {
    // Para campos específicos como altura/peso, usamos mensajes personalizados
    if (name === "altura" || name === "peso") {
      return messages?.[name] || "Valor fuera de rango.";
    }
    
    // Mensajes genéricos según el tipo de error
    if (v.rangeUnderflow) return `El valor debe ser ≥ ${input.min}.`;
    if (v.rangeOverflow) return `El valor debe ser ≤ ${input.max}.`;
    if (v.stepMismatch) {
      return input.step && input.step !== "any"
        ? `Usa incrementos de ${input.step}.`
        : "Valor no válido.";
    }
  }

  // CASO 5: Problemas de longitud de texto (minlength, maxlength)
  if (v.tooShort) return `Debe tener al menos ${input.minLength} caracteres.`;
  if (v.tooLong) return `Debe tener como máximo ${input.maxLength} caracteres.`;

  // Si no hay errores, retorna cadena vacía
  return "";
}


// ============================================================
// SECCIÓN 2: VALIDACIÓN COMPLETA DE UN CAMPO
// ============================================================

/**
 * Valida completamente un campo de formulario (nativo + custom).
 * 
 * PROCESO DE VALIDACIÓN (2 PASOS):
 * 
 * PASO 1: Validación nativa del navegador
 *   - Verifica atributos HTML como required, pattern, type, min, max, etc.
 *   - Usa input.checkValidity() que consulta la API ValidityState
 * 
 * PASO 2: Validación personalizada (custom rules)
 *   - Aplica reglas de negocio específicas definidas en rules.js
 *   - Ejemplo: verificar que la edad sea ≥16 años
 * 
 * MODOS DE OPERACIÓN:
 * - paint=true: Muestra/oculta mensajes de error en la UI (modo interactivo)
 * - paint=false: Solo valida sin tocar la interfaz (modo silencioso, para checks globales)
 * 
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input - Campo a validar
 * @param {Object} options - Opciones de validación
 * @param {boolean} [options.paint=true] - Si true, muestra errores en la UI
 * @returns {boolean} true si el campo es válido, false si hay errores
 * 
 * @example
 * // Validar y mostrar error si hay problema
 * const esValido = validateField(inputEmail, { paint: true });
 * 
 * // Validar sin mostrar error (útil para verificar estado general)
 * const esValido = validateField(inputEmail, { paint: false });
 */
function validateField(input, { paint = true } = {}) {
  const name = input.name;
  const val = input.value;

  // ──────────────────────────────────────────────────────────
  // PASO 1: VALIDACIÓN NATIVA DEL NAVEGADOR
  // ──────────────────────────────────────────────────────────
  
  // Primero limpiamos cualquier error personalizado previo
  // (esto permite que checkValidity() solo evalúe las reglas nativas)
  input.setCustomValidity("");
  
  // checkValidity() retorna false si alguna regla nativa falla
  if (!input.checkValidity()) {
    if (paint) {
      // Obtenemos un mensaje amigable basado en QUÉ regla falló
      const msg = getNativeMessage(input, name) || "Valor inválido.";
      showError(input, msg);
    }
    return false; // ❌ Validación nativa falló
  }

  // ──────────────────────────────────────────────────────────
  // PASO 2: VALIDACIÓN PERSONALIZADA (CUSTOM RULES)
  // ──────────────────────────────────────────────────────────
  
  // Buscamos si hay una regla personalizada para este campo
  const rule = rules[name];
  
  // Si existe una regla y el valor no la cumple...
  if (rule && !rule(val)) {
    if (paint) {
      // Mostramos el mensaje personalizado definido en messages.js
      showError(input, messages[name] || "Valor inválido.");
    }
    return false; // ❌ Validación personalizada falló
  }

  // ──────────────────────────────────────────────────────────
  // ✅ CAMPO VÁLIDO: Limpiamos cualquier error mostrado
  // ──────────────────────────────────────────────────────────
  if (paint) {
    clearError(input);
  }
  
  return true; // ✅ Todas las validaciones pasaron
}



// ============================================================
// SECCIÓN 3: VALIDACIÓN ESPECIAL DE CHECKBOXES (CONDICIONES MÉDICAS)
// ============================================================

/**
 * Configura la lógica especial para el grupo de checkboxes de "Condiciones médicas".
 * 
 * COMPORTAMIENTO ESPECIAL IMPLEMENTADO:
 * 
 * 1. EXCLUSIVIDAD MUTUA:
 *    - Si se marca "Ninguna" → desmarca y deshabilita todas las demás opciones
 *    - Si se marca cualquier otra → desmarca y deshabilita "Ninguna"
 * 
 * 2. VALIDACIÓN REQUERIDA:
 *    - Al menos UNA opción debe estar marcada (incluida "Ninguna")
 *    - Si nada está marcado, muestra mensaje de error
 * 
 * TÉCNICAS UTILIZADAS:
 * - Delegación de eventos (change) para gestionar interacciones
 * - Manipulación del DOM para deshabilitar/habilitar checkboxes
 * - Validación silenciosa vs. visible según el parámetro
 * 
 * @param {HTMLFormElement} form - El formulario que contiene el grupo
 * @returns {Function} Función de validación que acepta {silent: boolean}
 * 
 * @example
 * const validateCondiciones = wireCondicionesMedicas(form);
 * const esValido = validateCondiciones({ silent: false }); // Muestra error si hay problema
 * const esValido = validateCondiciones({ silent: true });  // Solo verifica sin mostrar
 */
function wireCondicionesMedicas(form) {
  // ──────────────────────────────────────────────────────────
  // BUSCAR EL GRUPO DE CHECKBOXES EN EL DOM
  // ──────────────────────────────────────────────────────────
  const group = form.querySelector('[role="group"][aria-label="Condiciones médicas"]');
  
  // Si no existe el grupo, retornamos una función que siempre valida OK
  if (!group) {
    return () => true;
  }

  // ──────────────────────────────────────────────────────────
  // SEPARAR LOS CHECKBOXES: "Ninguna" vs. "Otros"
  // ──────────────────────────────────────────────────────────
  const all = Array.from(
    group.querySelectorAll('input[type="checkbox"][name="condiciones[]"]')
  );
  
  // El checkbox especial "Ninguna" (identificado por su valor)
  const none = all.find(i => i.value?.toLowerCase() === "ninguna");
  
  // Todos los demás checkboxes (condiciones médicas reales)
  const others = all.filter(i => i !== none);

  // ──────────────────────────────────────────────────────────
  // LÓGICA 1: Cuando se marca/desmarca "Ninguna"
  // ──────────────────────────────────────────────────────────
  /**
   * Si "Ninguna" está marcada:
   *   → Desmarca y deshabilita todas las otras opciones
   *   → Agrega clase CSS "is-disabled" al label para feedback visual
   * 
   * Si "Ninguna" se desmarca:
   *   → Habilita todas las otras opciones
   *   → Quita la clase "is-disabled"
   */
  function toggleFromNone() {
    if (!none) return;
    
    if (none.checked) {
      // "Ninguna" está marcada → bloquear las demás
      others.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true;
        checkbox.closest("label")?.classList.add("is-disabled");
      });
    } else {
      // "Ninguna" se desmarcó → habilitar las demás
      others.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.closest("label")?.classList.remove("is-disabled");
      });
    }
  }

  // ──────────────────────────────────────────────────────────
  // LÓGICA 2: Cuando se marca alguna condición médica real
  // ──────────────────────────────────────────────────────────
  /**
   * Si al menos una condición médica está marcada:
   *   → Desmarca "Ninguna"
   *   → Deshabilita "Ninguna" (no tiene sentido marcarla si hay condiciones)
   * 
   * Si todas las condiciones médicas se desmarcan:
   *   → Habilita "Ninguna" nuevamente
   */
  function toggleFromOthers() {
    if (!none) return;
    
    // ¿Hay al menos una condición médica marcada?
    const anyOther = others.some(checkbox => checkbox.checked);
    
    if (anyOther) {
      // Hay condiciones marcadas → bloquear "Ninguna"
      none.checked = false;
      none.disabled = true;
      none.closest("label")?.classList.add("is-disabled");
    } else {
      // No hay condiciones marcadas → habilitar "Ninguna"
      none.disabled = false;
      none.closest("label")?.classList.remove("is-disabled");
    }
  }

  // ──────────────────────────────────────────────────────────
  // REGISTRAR EVENTOS DE CAMBIO
  // ──────────────────────────────────────────────────────────
  none?.addEventListener("change", toggleFromNone);
  others.forEach(checkbox => {
    checkbox.addEventListener("change", toggleFromOthers);
  });
  
  // Aplicar lógica inicial al cargar la página
  toggleFromNone();
  toggleFromOthers();

  // ──────────────────────────────────────────────────────────
  // FUNCIÓN DE VALIDACIÓN DEL GRUPO
  // ──────────────────────────────────────────────────────────
  /**
   * Valida que al menos un checkbox esté marcado.
   * 
   * @param {Object} options
   * @param {boolean} [options.silent=false] - Si true, solo valida sin mostrar error
   * @returns {boolean} true si al menos una opción está marcada
   */
  function validateCondiciones({ silent = false } = {}) {
    // Verificar si hay al menos un checkbox marcado
    const ok = all.some(checkbox => checkbox.checked);
    
    // Si es modo silencioso, solo retornar el resultado
    if (silent) return ok;

    // ────────────────────────────────────────────────────
    // MODO VISIBLE: Mostrar/ocultar mensaje de error
    // ────────────────────────────────────────────────────
    const control = group.closest(".control") || group.parentElement;
    let hint = control.querySelector(".error-msg-condiciones");
    
    if (!ok) {
      // ❌ No hay nada marcado → mostrar error
      if (!hint) {
        hint = document.createElement("p");
        hint.className = "error-msg error-msg-condiciones";
        hint.setAttribute("role", "alert");
        control.appendChild(hint);
      }
      hint.textContent = "Selecciona al menos una opción (o marca 'Ninguna').";
    } else {
      // ✅ Hay algo marcado → quitar error
      hint?.remove();
    }
    
    return ok;
  }

  // Retornar la función de validación para usarla desde fuera
  return validateCondiciones;
}



// ============================================================
// SECCIÓN 4: VALIDACIÓN GLOBAL DEL FORMULARIO
// ============================================================

/**
 * Verifica si TODO el formulario es válido (modo silencioso).
 * 
 * PROCESO:
 * 1. Valida TODOS los campos del formulario uno por uno
 * 2. Valida el grupo de condiciones médicas
 * 3. Retorna true solo si TODO está correcto
 * 
 * IMPORTANTE: Esta validación es SILENCIOSA (paint=false)
 * - No muestra mensajes de error en pantalla
 * - Solo calcula si el estado general es válido o no
 * - Se usa para habilitar/deshabilitar el botón de envío
 * 
 * ¿POR QUÉ SILENCIOSA?
 * - Se ejecuta en TIEMPO REAL mientras el usuario escribe
 * - Si mostráramos errores constantemente, sería molesto
 * - Los errores visibles se muestran en blur/submit (wireValidationUI)
 * 
 * @param {HTMLFormElement} form - El formulario a validar
 * @param {Function} validateCondicionesSilent - Función de validación de condiciones médicas
 * @returns {boolean} true si todo el formulario es válido
 * 
 * @example
 * const esValido = isFormValid(form, validateCondiciones);
 * submitButton.disabled = !esValido; // Habilitar/deshabilitar botón
 */
function isFormValid(form, validateCondicionesSilent) {
  // ──────────────────────────────────────────────────────────
  // PASO 1: Validar todos los campos normales del formulario
  // ──────────────────────────────────────────────────────────
  const inputs = form.querySelectorAll("input, select, textarea");
  
  for (const el of inputs) {
    // Validar cada campo en modo silencioso (sin mostrar errores)
    if (!validateField(el, { paint: false })) {
      return false; // ❌ Si algún campo falla, el formulario no es válido
    }
  }

  // ──────────────────────────────────────────────────────────
  // PASO 2: Validar el grupo de condiciones médicas
  // ──────────────────────────────────────────────────────────
  if (validateCondicionesSilent && !validateCondicionesSilent({ silent: true })) {
    return false; // ❌ El grupo de checkboxes no es válido
  }

  // ✅ Todos los campos y grupos son válidos
  return true;
}



// ============================================================
// SECCIÓN 5: CONTROL DEL BOTÓN DE ENVÍO (SUBMIT GATE)
// ============================================================

/**
 * Controla la habilitación/deshabilitación del botón "Enviar solicitud".
 * 
 * CONCEPTO: "SUBMIT GATE" (Puerta de Envío)
 * - El botón submit actúa como una "puerta" que solo se abre cuando TODO es válido
 * - Esto previene que el usuario envíe el formulario con datos incorrectos
 * 
 * CONDICIONES PARA HABILITAR EL BOTÓN:
 * 1. ✅ Todos los campos deben ser válidos (isFormValid = true)
 * 2. ✅ El checkbox de T&C (Términos y Condiciones) debe estar marcado
 * 3. 🔹 Opcionalmente: El checkbox de RGPD también puede ser requerido
 * 
 * EVENTOS QUE ACTIVAN LA VERIFICACIÓN:
 * - input: Cuando el usuario escribe en cualquier campo
 * - change: Cuando cambia el valor de selects, checkboxes, radios
 * - reset: Cuando se reinicia el formulario
 * 
 * TÉCNICA: Delegación de eventos con captura (useCapture=true)
 * - El tercer parámetro "true" en addEventListener hace que el evento
 *   se capture en la fase de captura, antes de llegar a los elementos hijos
 * - Esto asegura que capturemos todos los eventos de input/change
 *   sin importar la estructura del DOM
 * 
 * @param {HTMLFormElement} form - El formulario
 * @param {Function} validateCondiciones - Función de validación de condiciones médicas
 * 
 * @example
 * wireSubmitGate(form, validateCondiciones);
 * // A partir de aquí, el botón se habilita/deshabilita automáticamente
 */
function wireSubmitGate(form, validateCondiciones) {
  // ──────────────────────────────────────────────────────────
  // ENCONTRAR LOS ELEMENTOS RELEVANTES EN EL DOM
  // ──────────────────────────────────────────────────────────
  const submitBtn = form.querySelector('button[type="submit"]');
  const tos = form.querySelector('input[name="tos"]');   // Términos y Condiciones
  const rgpd = form.querySelector('input[name="rgpd"]'); // RGPD (opcional)

  /**
   * Función que actualiza el estado del botón de envío.
   * Se ejecuta cada vez que cambia algo en el formulario.
   */
  function update() {
    // ────────────────────────────────────────────────────
    // CONDICIÓN 1: ¿Todos los campos son válidos?
    // ────────────────────────────────────────────────────
    const allValid = isFormValid(form, validateCondiciones);

    // ────────────────────────────────────────────────────
    // CONDICIÓN 2: ¿Los consentimientos están marcados?
    // ────────────────────────────────────────────────────
    let consentsOK = true;
    
    // Términos y Condiciones (T&C) son OBLIGATORIOS
    if (tos) {
      consentsOK = consentsOK && tos.checked;
    }
    
    // RGPD es opcional - descomenta la siguiente línea si lo necesitas:
    // if (rgpd) consentsOK = consentsOK && rgpd.checked;

    // ────────────────────────────────────────────────────
    // DECISIÓN FINAL: ¿Permitir el envío?
    // ────────────────────────────────────────────────────
    const allow = allValid && consentsOK;

    // Actualizar el botón de envío
    if (submitBtn) {
      submitBtn.disabled = !allow;
      // ARIA para accesibilidad (lectores de pantalla)
      submitBtn.setAttribute("aria-disabled", String(!allow));
    }
  }

  // ──────────────────────────────────────────────────────────
  // REGISTRAR EVENTOS PARA ACTUALIZAR EL ESTADO EN TIEMPO REAL
  // ──────────────────────────────────────────────────────────
  
  // Capturar eventos de input y change en TODO el formulario
  // El tercer parámetro "true" activa la fase de captura
  form.addEventListener("input", update, true);
  form.addEventListener("change", update, true);
  
  // Eventos específicos para los checkboxes de consentimiento
  tos?.addEventListener("change", update);
  rgpd?.addEventListener("change", update);

  // ──────────────────────────────────────────────────────────
  // EJECUTAR VERIFICACIÓN INICIAL Y TRAS RESET
  // ──────────────────────────────────────────────────────────
  
  // Al cargar la página, verificar estado inicial (botón estará deshabilitado)
  update();
  
  // Tras hacer reset del formulario, recalcular estado
  // setTimeout(update, 0) asegura que se ejecute después del reset completo
  form.addEventListener("reset", () => setTimeout(update, 0));
}



// ============================================================
// SECCIÓN 6: INTERFAZ DE VALIDACIÓN VISIBLE (FEEDBACK AL USUARIO)
// ============================================================

/**
 * Conecta los eventos de validación VISIBLE (que muestran mensajes de error).
 * 
 * DIFERENCIA CON wireSubmitGate:
 * - wireSubmitGate: Validación SILENCIOSA en tiempo real (solo para habilitar botón)
 * - wireValidationUI: Validación VISIBLE que muestra mensajes de error al usuario
 * 
 * EVENTOS DE VALIDACIÓN:
 * 
 * 1. BLUR (cuando el usuario sale del campo)
 *    - Momento ideal para validar: el usuario terminó de escribir
 *    - Si hay error, lo mostramos inmediatamente
 * 
 * 2. INPUT (mientras el usuario escribe)
 *    - Útil para feedback inmediato al corregir errores
 *    - Si el campo ya tiene un error, lo validamos en tiempo real
 * 
 * 3. CHANGE (cuando cambia el valor de selects/checkboxes/radios)
 *    - Específico para elementos que no usan input
 * 
 * 4. SUBMIT (al intentar enviar el formulario)
 *    - Validación final completa
 *    - Si hay errores, previene el envío y enfoca el primer campo con error
 * 
 * @param {HTMLFormElement} form - El formulario
 * @param {Function} validateCondiciones - Función de validación de condiciones médicas
 * 
 * @example
 * wireValidationUI(form, validateCondiciones);
 * // A partir de aquí, el formulario mostrará errores cuando corresponda
 */
function wireValidationUI(form, validateCondiciones) {
  // ──────────────────────────────────────────────────────────
  // OBTENER TODOS LOS CAMPOS VALIDABLES
  // ──────────────────────────────────────────────────────────
  const inputs = form.querySelectorAll("input, select, textarea");

  // ──────────────────────────────────────────────────────────
  // REGISTRAR EVENTOS DE VALIDACIÓN EN CADA CAMPO
  // ──────────────────────────────────────────────────────────
  inputs.forEach((el) => {
    // EVENTO 1: blur - Validar cuando el usuario sale del campo
    // Este es el momento más natural para validar (UX amigable)
    el.addEventListener("blur", () => {
      validateField(el, { paint: true });
    });

    // EVENTO 2: input - Validar mientras el usuario escribe
    // Permite corrección en tiempo real de errores previos
    el.addEventListener("input", () => {
      validateField(el, { paint: true });
    });

    // EVENTO 3: change - Validar cuando cambia (selects, checkboxes, radios)
    el.addEventListener("change", () => {
      validateField(el, { paint: true });
    });
  });

  // ──────────────────────────────────────────────────────────
  // VALIDACIÓN FINAL AL INTENTAR ENVIAR EL FORMULARIO
  // ──────────────────────────────────────────────────────────
  form.addEventListener("submit", (e) => {
    // Array para recopilar campos que fallaron la validación
    const invalids = [];

    // Validar todos los campos y recopilar los que tienen errores
    inputs.forEach((el) => {
      if (!validateField(el, { paint: true })) {
        invalids.push(el);
      }
    });

    // Validar el grupo de condiciones médicas (modo visible)
    const okCond = validateCondiciones ? validateCondiciones({}) : true;

    // ────────────────────────────────────────────────────
    // SI HAY ERRORES: Prevenir envío y enfocar primer error
    // ────────────────────────────────────────────────────
    if (invalids.length || !okCond) {
      // Prevenir el envío del formulario
      e.preventDefault();

      // Enfocar el primer campo con error (o el mensaje de condiciones médicas)
      const firstError = invalids[0] || form.querySelector(".error-msg-condiciones");
      firstError?.focus?.();
    }

    // Si todo está OK, el formulario se enviará normalmente
  });
}



// ============================================================
// SECCIÓN 7: LIMPIEZA DE ESTADO AL REINICIAR EL FORMULARIO
// ============================================================

/**
 * Limpia todos los estados visuales cuando se reinicia el formulario.
 * 
 * ¿QUÉ LIMPIA?
 * 1. Todos los mensajes de error (.error-msg)
 * 2. Atributos ARIA de validación (aria-invalid)
 * 3. Clases CSS de estado (.is-valid, .is-invalid)
 * 4. Selecciones múltiples (select[multiple])
 * 
 * ¿POR QUÉ ES NECESARIO?
 * - El evento "reset" del formulario solo limpia los VALORES
 * - No limpia clases CSS ni atributos que agregamos dinámicamente
 * - Sin esta función, los mensajes de error quedarían visibles tras reset
 * 
 * ADEMÁS: Enfoca el primer campo del formulario para mejor UX
 * 
 * @param {HTMLFormElement} form - El formulario a limpiar
 * 
 * @example
 * wireResetCleanup(form);
 * // A partir de aquí, reset limpiará todo correctamente
 */
function wireResetCleanup(form) {
  /**
   * Función interna que realiza toda la limpieza.
   * Se ejecuta cada vez que se dispara el evento "reset".
   */
  function limpiarEstados() {
    // ────────────────────────────────────────────────────
    // 1. ELIMINAR TODOS LOS MENSAJES DE ERROR
    // ────────────────────────────────────────────────────
    form.querySelectorAll(".error-msg").forEach(nodo => nodo.remove());

    // ────────────────────────────────────────────────────
    // 2. LIMPIAR ATRIBUTOS ARIA DE VALIDACIÓN
    // ────────────────────────────────────────────────────
    // Quitar aria-invalid="true" de todos los campos
    form.querySelectorAll("[aria-invalid='true']").forEach(el => {
      el.removeAttribute("aria-invalid");
    });

    // ────────────────────────────────────────────────────
    // 3. LIMPIAR CLASES CSS DE ESTADO
    // ────────────────────────────────────────────────────
    // Quitar clases de validación visual
    form.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
      el.classList.remove("is-valid", "is-invalid");
    });

    // ────────────────────────────────────────────────────
    // 4. LIMPIAR SELECTS MÚLTIPLES
    // ────────────────────────────────────────────────────
    // Los select[multiple] pueden necesitar limpieza manual
    form.querySelectorAll("select[multiple]").forEach(sel => {
      for (const opt of sel.options) {
        opt.selected = false;
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // REGISTRAR EVENTO DE RESET
  // ──────────────────────────────────────────────────────────
  form.addEventListener("reset", () => {
    // Limpiar todos los estados visuales
    limpiarEstados();

    // Enfocar el primer campo del formulario para mejor UX
    const first = form.querySelector("input, select, textarea");
    first?.focus();
  });
}



// ============================================================
// SECCIÓN 8: INICIALIZACIÓN - PUNTO DE ENTRADA PRINCIPAL
// ============================================================

/**
 * Inicializa todo el sistema de validación cuando el DOM está listo.
 * 
 * EVENTO: DOMContentLoaded
 * - Se dispara cuando el HTML está completamente cargado y parseado
 * - Es el momento ideal para conectar eventos y configurar la lógica
 * - No espera a que se carguen imágenes u otros recursos externos
 * 
 * ORDEN DE INICIALIZACIÓN (IMPORTANTE):
 * 
 * 1. Configurar lógica especial de condiciones médicas
 *    → wireCondicionesMedicas(form)
 *    → Retorna una función de validación que usaremos después
 * 
 * 2. Activar el "submit gate" (control del botón de envío)
 *    → wireSubmitGate(form, validateCondiciones)
 *    → Validación silenciosa en tiempo real para habilitar/deshabilitar botón
 * 
 * 3. Conectar validación visible (mensajes de error al usuario)
 *    → wireValidationUI(form, validateCondiciones)
 *    → Muestra errores en blur, input, change, submit
 * 
 * 4. Configurar limpieza tras reset
 *    → wireResetCleanup(form)
 *    → Limpia estados visuales cuando se reinicia el formulario
 * 
 * ¿POR QUÉ ESTE ORDEN?
 * - El submit gate debe estar activo desde el inicio (botón deshabilitado)
 * - La validación visible se ejecuta "encima" del gate
 * - La limpieza de reset es independiente y puede ir al final
 */
document.addEventListener("DOMContentLoaded", () => {
  // ──────────────────────────────────────────────────────────
  // PASO 0: Buscar el formulario en el DOM
  // ──────────────────────────────────────────────────────────
  const form = document.getElementById(FORM_ID);
  
  // Si no existe el formulario, no hacer nada
  // (evita errores en páginas que no tienen este formulario)
  if (!form) {
    console.warn(`Formulario con id="${FORM_ID}" no encontrado.`);
    return;
  }

  // ──────────────────────────────────────────────────────────
  // PASO 1: Configurar grupo de condiciones médicas
  // ──────────────────────────────────────────────────────────
  // Retorna una función que usaremos para validar este grupo
  const validateCondiciones = wireCondicionesMedicas(form);

  // ──────────────────────────────────────────────────────────
  // PASO 2: Activar control del botón de envío (submit gate)
  // ──────────────────────────────────────────────────────────
  // El botón se habilitará/deshabilitará automáticamente según
  // la validez global del formulario (validación silenciosa)
  wireSubmitGate(form, validateCondiciones);

  // ──────────────────────────────────────────────────────────
  // PASO 3: Conectar validación visible (mensajes de error)
  // ──────────────────────────────────────────────────────────
  // Muestra mensajes de error cuando el usuario interactúa
  // con los campos y al intentar enviar el formulario
  wireValidationUI(form, validateCondiciones);

  // ──────────────────────────────────────────────────────────
  // PASO 4: Configurar limpieza tras reset
  // ──────────────────────────────────────────────────────────
  // Asegura que el formulario quede completamente limpio
  // cuando el usuario presiona el botón "Restablecer"
  wireResetCleanup(form);

  // ──────────────────────────────────────────────────────────
  // ✅ SISTEMA DE VALIDACIÓN COMPLETAMENTE INICIALIZADO
  // ──────────────────────────────────────────────────────────
  console.info(`✅ Sistema de validación inicializado para #${FORM_ID}`);
});

