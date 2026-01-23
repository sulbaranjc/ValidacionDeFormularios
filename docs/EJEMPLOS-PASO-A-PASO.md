# 👨‍💻 Ejemplos Paso a Paso: Sistema de Validación

> **Objetivo**: Ejemplos prácticos con código comentado línea por línea para entender cómo funciona cada parte del sistema.

---

## 📚 Índice de Ejemplos

1. [Ejemplo 1: Validar un campo de email](#ejemplo-1-validar-un-campo-de-email)
2. [Ejemplo 2: Agregar validación personalizada](#ejemplo-2-agregar-validación-personalizada)
3. [Ejemplo 3: Validar edad mínima](#ejemplo-3-validar-edad-mínima)
4. [Ejemplo 4: Checkbox group con "Ninguna"](#ejemplo-4-checkbox-group-con-ninguna)
5. [Ejemplo 5: Habilitar botón solo si todo es válido](#ejemplo-5-habilitar-botón-solo-si-todo-es-válido)

---

## Ejemplo 1: Validar un campo de email

### Paso 1: HTML del campo

```html
<!-- index.html -->
<div class="control">
  <label for="email">
    Correo electrónico 
    <span class="req" aria-hidden="true">*</span>
  </label>
  <input 
    id="email" 
    name="email" 
    type="email"          <!-- ← Validación nativa: formato email -->
    autocomplete="email" 
    placeholder="usuario@correo.com" 
    required              <!-- ← Validación nativa: campo obligatorio -->
  />
</div>
```

**Atributos clave:**
- `type="email"`: El navegador valida que tenga formato de email
- `required`: El navegador valida que no esté vacío

### Paso 2: ¿Qué pasa cuando el usuario escribe y sale del campo?

```javascript
// formValidation.js - wireValidationUI()

// 1. Se registra el evento blur (cuando sale del campo)
input.addEventListener("blur", () => {
  validateField(input, { paint: true });
  //             ↑         ↑
  //             │         └─ Modo visible: mostrará errores
  //             └─ El input que perdió el foco
});
```

### Paso 3: Dentro de validateField()

```javascript
function validateField(input, { paint = true } = {}) {
  const name = input.name;  // "email"
  const val = input.value;  // Lo que escribió el usuario

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PASO 1: Limpiar errores personalizados previos
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  input.setCustomValidity("");
  // ↑ Esto permite que checkValidity() solo evalúe reglas HTML nativas

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PASO 2: Validación nativa del navegador
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!input.checkValidity()) {
    // ↑ checkValidity() retorna false si:
    //   - Está vacío (required)
    //   - No tiene formato de email (type="email")
    //   - No cumple pattern, min, max, etc.

    if (paint) {
      // Obtener mensaje amigable según QUÉ falló
      const msg = getNativeMessage(input, name) || "Valor inválido.";
      // ↑ Si escribió "abc" → "Correo no válido."
      // ↑ Si está vacío → "Este campo es obligatorio."

      showError(input, msg);
      // ↑ Muestra el mensaje rojo en la UI
    }
    
    return false; // ❌ Validación falló
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PASO 3: Validación personalizada (si existe)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const rule = rules[name];
  // ↑ Busca en rules.js si hay regla para "email"
  
  if (rule && !rule(val)) {
    // ↑ Ejecuta la función de validación personalizada
    
    if (paint) {
      showError(input, messages[name] || "Valor inválido.");
    }
    
    return false; // ❌ Validación personalizada falló
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PASO 4: Todo OK → Limpiar errores
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (paint) {
    clearError(input);
    // ↑ Quita el mensaje rojo si estaba presente
  }
  
  return true; // ✅ Validación exitosa
}
```

### Paso 4: getNativeMessage() en detalle

```javascript
function getNativeMessage(input, name) {
  // El objeto ValidityState contiene propiedades booleanas
  const v = input.validity;
  
  console.log(v);
  // ValidityState {
  //   valueMissing: false,    ← ¿Está vacío?
  //   typeMismatch: true,     ← ¿El tipo no coincide? ✓
  //   patternMismatch: false, ← ¿No coincide con pattern?
  //   tooShort: false,        ← ¿Muy corto?
  //   ...
  // }

  // CASO: Campo vacío (required)
  if (v.valueMissing) {
    return "Este campo es obligatorio.";
  }

  // CASO: Formato incorrecto (type="email" o type="url")
  if (v.typeMismatch) {
    if (input.type === "email") {
      return "Correo no válido.";
      // ↑ Se ejecuta si escribió "abc" en un input type="email"
    }
    if (input.type === "url") {
      return "URL no válida.";
    }
    return "Valor no válido.";
  }

  // ... más casos
  
  return ""; // Sin errores
}
```

### Paso 5: showError() muestra el mensaje

```javascript
// dom.js
export function showError(input, msg) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. Marcar el input como inválido (ARIA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  input.setAttribute("aria-invalid", "true");
  // ↑ Los lectores de pantalla anunciarán: "Email, inválido"

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. Encontrar el contenedor del campo
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const control = input.closest(".control") || input.parentElement;
  // ↑ Busca el <div class="control"> padre

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. Crear o reutilizar el nodo de error
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  let hint = control.querySelector(".error-msg");
  
  if (!hint) {
    // No existe → crearlo
    hint = document.createElement("p");
    hint.className = "error-msg";
    hint.setAttribute("role", "alert"); // Para accesibilidad
    hint.setAttribute("aria-live", "polite"); // Anuncia cambios
    control.appendChild(hint);
  }
  
  // Poner el mensaje
  hint.textContent = msg; // "Correo no válido."

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. Vincular el mensaje al input (ARIA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!hint.id) {
    hint.id = `${input.id || input.name}-error`;
    // ↑ hint.id = "email-error"
  }
  
  input.setAttribute("aria-describedby", hint.id);
  // ↑ Vincula el input con su mensaje de error
  // Los lectores de pantalla leerán el mensaje al enfocar el campo

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. Agregar clase de error al contenedor
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  control.classList.add("has-error");
  // ↑ Permite estilos CSS como .has-error label { color: red; }
}
```

**Resultado visual en el DOM:**

```html
<div class="control has-error">  <!-- ← Clase agregada -->
  <label for="email">Correo electrónico *</label>
  <input 
    id="email" 
    name="email" 
    type="email"
    aria-invalid="true"              <!-- ← Agregado -->
    aria-describedby="email-error"   <!-- ← Agregado -->
  />
  <p class="error-msg" id="email-error" role="alert" aria-live="polite">
    Correo no válido.  <!-- ← Mensaje visible -->
  </p>
</div>
```

---

## Ejemplo 2: Agregar validación personalizada

### Problema: Validar que un código postal empiece con "28" (Madrid)

### Paso 1: Definir la regla en rules.js

```javascript
// js/validation/rules.js
export const rules = {
  // ... otras reglas
  
  cp: v => {
    // REGLA 1: Debe tener 5 dígitos (validación básica)
    const tieneFormatoCorrecto = /^\d{5}$/.test(v);
    
    // REGLA 2: Debe empezar con "28" (Madrid)
    const esMadrid = v.startsWith("28");
    
    // Ambas deben cumplirse
    return tieneFormatoCorrecto && esMadrid;
  },
};
```

### Paso 2: Definir el mensaje en messages.js

```javascript
// js/validation/messages.js
export const messages = {
  // ... otros mensajes
  
  cp: "Debe ser un código postal de Madrid (28XXX).",
};
```

### Paso 3: El HTML ya tiene el campo

```html
<input 
  id="cp" 
  name="cp"           <!-- ← El name debe coincidir con rules.cp -->
  type="text" 
  inputmode="numeric" 
  pattern="^[0-9]{5}$" <!-- ← Validación nativa: 5 dígitos -->
  placeholder="28001" 
  required 
  title="5 dígitos"
/>
```

### Paso 4: ¿Qué pasa al validar?

```javascript
// Usuario escribe "46001" (Valencia) y sale del campo

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// validateField() ejecuta:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// PASO 1: Validación nativa
input.checkValidity() // ✅ true
// ↑ Pasa porque cumple pattern="^[0-9]{5}$" (5 dígitos)

// PASO 2: Validación personalizada
const rule = rules["cp"];
rule("46001") // ❌ false
// ↑ Falla porque no empieza con "28"

// PASO 3: Mostrar error
showError(input, messages["cp"]);
// ↑ "Debe ser un código postal de Madrid (28XXX)."
```

**Clave**: La validación nativa pasa, pero la personalizada falla.

---

## Ejemplo 3: Validar edad mínima (16 años)

### Paso 1: HTML del campo

```html
<input 
  id="fecha-nac" 
  name="fecha_nacimiento" 
  type="date"     <!-- ← El navegador muestra un date picker -->
  required 
/>
```

### Paso 2: Regla personalizada en rules.js

```javascript
export const rules = {
  // ... otras reglas
  
  fecha_nacimiento: v => {
    // v = "2010-05-15" (formato ISO de <input type="date">)
    
    if (!v) return false; // Vacío → inválido
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Calcular edad
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fechaNacimiento = new Date(v);
    const añoNacimiento = fechaNacimiento.getFullYear(); // 2010
    
    const añoActual = new Date().getFullYear(); // 2026
    
    const edad = añoActual - añoNacimiento; // 2026 - 2010 = 16
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Validar rango de edad
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    return edad >= 16 && edad < 120;
    // ↑ Debe tener al menos 16 años y menos de 120
  },
};
```

### Paso 3: Mensaje en messages.js

```javascript
export const messages = {
  fecha_nacimiento: "Debes tener al menos 16 años.",
};
```

### Paso 4: Casos de prueba

```javascript
// CASO 1: Usuario nacido en 2015 (11 años)
rules.fecha_nacimiento("2015-01-01") 
// → false ❌ (11 < 16)
// Mensaje: "Debes tener al menos 16 años."

// CASO 2: Usuario nacido en 2008 (18 años)
rules.fecha_nacimiento("2008-01-01") 
// → true ✅ (18 >= 16)
// Sin mensaje de error

// CASO 3: Usuario nacido en 1800 (226 años)
rules.fecha_nacimiento("1800-01-01") 
// → false ❌ (226 >= 120)
// Mensaje: "Debes tener al menos 16 años."
```

---

## Ejemplo 4: Checkbox group con "Ninguna"

### Problema: Grupo de checkboxes donde "Ninguna" excluye a los demás

### Paso 1: HTML del grupo

```html
<div class="chips" role="group" aria-label="Condiciones médicas">
  <label class="chip">
    <input type="checkbox" name="condiciones[]" value="cardiaco"> 
    Cardíacas
  </label>
  <label class="chip">
    <input type="checkbox" name="condiciones[]" value="diabetes"> 
    Diabetes
  </label>
  <label class="chip">
    <input type="checkbox" name="condiciones[]" value="ninguna"> 
    Ninguna  <!-- ← Este es especial -->
  </label>
</div>
```

### Paso 2: Lógica en wireCondicionesMedicas()

```javascript
function wireCondicionesMedicas(form) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. ENCONTRAR LOS CHECKBOXES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const group = form.querySelector(
    '[role="group"][aria-label="Condiciones médicas"]'
  );
  
  const all = Array.from(
    group.querySelectorAll('input[type="checkbox"][name="condiciones[]"]')
  );
  // all = [cardiaco, diabetes, ninguna]

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. SEPARAR "Ninguna" de los demás
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const none = all.find(i => i.value?.toLowerCase() === "ninguna");
  // none = checkbox "Ninguna"
  
  const others = all.filter(i => i !== none);
  // others = [cardiaco, diabetes]

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. LÓGICA: Cuando se marca "Ninguna"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function toggleFromNone() {
    if (!none) return;
    
    if (none.checked) {
      // ✓ "Ninguna" está marcada
      
      // → Desmarcar y deshabilitar todas las demás
      others.forEach(checkbox => {
        checkbox.checked = false;       // Desmarcar
        checkbox.disabled = true;       // Deshabilitar
        checkbox.closest("label")?.classList.add("is-disabled");
        // ↑ Agregar clase CSS para estilo visual (gris)
      });
    } else {
      // ☐ "Ninguna" se desmarcó
      
      // → Habilitar todas las demás
      others.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.closest("label")?.classList.remove("is-disabled");
      });
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. LÓGICA: Cuando se marca alguna condición médica
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function toggleFromOthers() {
    if (!none) return;
    
    // ¿Hay al menos una condición marcada?
    const anyOther = others.some(checkbox => checkbox.checked);
    
    if (anyOther) {
      // ✓ Al menos una condición está marcada
      
      // → Desmarcar y deshabilitar "Ninguna"
      none.checked = false;
      none.disabled = true;
      none.closest("label")?.classList.add("is-disabled");
    } else {
      // ☐ Todas las condiciones están desmarcadas
      
      // → Habilitar "Ninguna"
      none.disabled = false;
      none.closest("label")?.classList.remove("is-disabled");
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. REGISTRAR EVENTOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  none?.addEventListener("change", toggleFromNone);
  
  others.forEach(checkbox => {
    checkbox.addEventListener("change", toggleFromOthers);
  });

  // Ejecutar lógica inicial (al cargar la página)
  toggleFromNone();
  toggleFromOthers();

  // ... función de validación
}
```

### Paso 3: Escenarios de uso

```javascript
// ESCENARIO 1: Usuario marca "Diabetes"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Se dispara evento "change" en checkbox "diabetes"
// 2. toggleFromOthers() ejecuta
// 3. anyOther = true (porque diabetes está marcada)
// 4. "Ninguna" se desmarca y deshabilita
// RESULTADO:
//   ✓ Diabetes (habilitada)
//   ☐ Cardíacas (habilitada)
//   ☐ Ninguna (DESHABILITADA, gris)

// ESCENARIO 2: Usuario desmarca "Diabetes"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Se dispara evento "change" en checkbox "diabetes"
// 2. toggleFromOthers() ejecuta
// 3. anyOther = false (ninguna condición marcada)
// 4. "Ninguna" se habilita
// RESULTADO:
//   ☐ Diabetes (habilitada)
//   ☐ Cardíacas (habilitada)
//   ☐ Ninguna (habilitada)

// ESCENARIO 3: Usuario marca "Ninguna"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Se dispara evento "change" en checkbox "ninguna"
// 2. toggleFromNone() ejecuta
// 3. none.checked = true
// 4. Todas las demás se desmarcan y deshabilitan
// RESULTADO:
//   ☐ Diabetes (DESHABILITADA, gris)
//   ☐ Cardíacas (DESHABILITADA, gris)
//   ✓ Ninguna (habilitada)
```

---

## Ejemplo 5: Habilitar botón solo si todo es válido

### Concepto: "Submit Gate" (Puerta de Envío)

El botón submit actúa como una "puerta" que solo se abre cuando:
1. ✅ Todos los campos son válidos
2. ✅ T&C (Términos y Condiciones) está marcado

### Paso 1: HTML del botón y checkbox T&C

```html
<!-- Botón de envío -->
<button 
  type="submit" 
  disabled          <!-- ← Inicia deshabilitado -->
  aria-disabled="true"
>
  Enviar solicitud
</button>

<!-- Checkbox de Términos y Condiciones -->
<label>
  <input 
    type="checkbox" 
    name="tos"      <!-- ← Terms of Service -->
    required 
  />
  Acepto los términos y condiciones
</label>
```

### Paso 2: wireSubmitGate() en acción

```javascript
function wireSubmitGate(form, validateCondiciones) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. ENCONTRAR ELEMENTOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const submitBtn = form.querySelector('button[type="submit"]');
  const tos = form.querySelector('input[name="tos"]'); // T&C

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. FUNCIÓN QUE ACTUALIZA EL ESTADO DEL BOTÓN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function update() {
    console.log("🔄 Recalculando estado del botón...");
    
    // ────────────────────────────────────────────────
    // CONDICIÓN 1: ¿Todos los campos son válidos?
    // ────────────────────────────────────────────────
    const allValid = isFormValid(form, validateCondiciones);
    // ↑ Valida TODOS los campos en modo silencioso
    
    console.log("  📋 Formulario válido:", allValid);

    // ────────────────────────────────────────────────
    // CONDICIÓN 2: ¿T&C está marcado?
    // ────────────────────────────────────────────────
    let consentsOK = true;
    
    if (tos) {
      consentsOK = tos.checked;
      console.log("  ✓ T&C marcado:", consentsOK);
    }

    // ────────────────────────────────────────────────
    // DECISIÓN: ¿Permitir envío?
    // ────────────────────────────────────────────────
    const allow = allValid && consentsOK;
    
    console.log("  🚪 Botón habilitado:", allow);

    // ────────────────────────────────────────────────
    // ACTUALIZAR BOTÓN
    // ────────────────────────────────────────────────
    if (submitBtn) {
      submitBtn.disabled = !allow;
      submitBtn.setAttribute("aria-disabled", String(!allow));
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. REGISTRAR EVENTOS (RECALCULAR EN TIEMPO REAL)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // Capturar TODOS los eventos input/change del formulario
  form.addEventListener("input", update, true);  // useCapture
  form.addEventListener("change", update, true);
  
  // Eventos específicos del checkbox T&C
  tos?.addEventListener("change", update);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. EJECUTAR VERIFICACIÓN INICIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  update(); // Al cargar la página, botón estará deshabilitado
  
  // Tras reset del formulario, recalcular
  form.addEventListener("reset", () => setTimeout(update, 0));
}
```

### Paso 3: isFormValid() valida todo en silencio

```javascript
function isFormValid(form, validateCondicionesSilent) {
  console.log("  🔍 Validando formulario completo...");
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VALIDAR TODOS LOS CAMPOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const inputs = form.querySelectorAll("input, select, textarea");
  
  for (const el of inputs) {
    const esValido = validateField(el, { paint: false });
    //                                     ↑
    //                                     └─ paint:false = silencioso
    
    if (!esValido) {
      console.log("    ❌", el.name, "inválido");
      return false; // ❌ Si alguno falla, retornar false
    } else {
      console.log("    ✅", el.name, "válido");
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VALIDAR GRUPO DE CONDICIONES MÉDICAS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (validateCondicionesSilent) {
    const okCond = validateCondicionesSilent({ silent: true });
    //                                          ↑
    //                                          └─ No mostrar error
    
    if (!okCond) {
      console.log("    ❌ Condiciones médicas inválidas");
      return false;
    } else {
      console.log("    ✅ Condiciones médicas válidas");
    }
  }

  // ✅ Todo válido
  console.log("  ✅ Formulario completamente válido");
  return true;
}
```

### Paso 4: Flujo completo en consola

```
Al cargar la página:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Recalculando estado del botón...
  🔍 Validando formulario completo...
    ❌ nombre inválido (vacío)
  📋 Formulario válido: false
  ✓ T&C marcado: false
  🚪 Botón habilitado: false
RESULTADO: Botón DESHABILITADO

Usuario escribe nombre "Ana":
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Recalculando estado del botón...
  🔍 Validando formulario completo...
    ✅ nombre válido
    ❌ apellidos inválido (vacío)
  📋 Formulario válido: false
  ✓ T&C marcado: false
  🚪 Botón habilitado: false
RESULTADO: Botón DESHABILITADO (faltan más campos)

Usuario completa TODOS los campos:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Recalculando estado del botón...
  🔍 Validando formulario completo...
    ✅ nombre válido
    ✅ apellidos válido
    ✅ email válido
    ... (todos los demás)
    ✅ Condiciones médicas válidas
  📋 Formulario válido: true ✓
  ✓ T&C marcado: false
  🚪 Botón habilitado: false
RESULTADO: Botón DESHABILITADO (falta marcar T&C)

Usuario marca T&C:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Recalculando estado del botón...
  🔍 Validando formulario completo...
    ✅ (todos válidos)
  📋 Formulario válido: true ✓
  ✓ T&C marcado: true ✓
  🚪 Botón habilitado: true ✓
RESULTADO: Botón HABILITADO 🎉
```

---

## 🎓 Conclusión

Estos ejemplos muestran:

1. ✅ **Cómo funciona la validación paso a paso** (desde evento hasta UI)
2. ✅ **Cómo combinar validación nativa y personalizada**
3. ✅ **Cómo implementar lógica especial** (checkboxes, submit gate)
4. ✅ **Cómo funciona el feedback en tiempo real**

**Recomendación**: Abre las DevTools (F12), pon breakpoints en `validateField()` y ejecuta paso a paso mientras interactúas con el formulario. Verás exactamente cómo fluyen los datos.

---

**¡Ahora ponte a experimentar! 🚀**

Modifica el código, rompe cosas, arregla cosas. Esa es la mejor forma de aprender.
