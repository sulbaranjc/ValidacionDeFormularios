# 📚 Guía de Estudio: Sistema de Validación de Formularios

> **Objetivo**: Entender cómo funciona el sistema completo de validación implementado en `formValidation.js`

---

## 📋 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo de Validación](#flujo-de-validación)
4. [Conceptos Avanzados](#conceptos-avanzados)
5. [Ejercicios Prácticos](#ejercicios-prácticos)

---

## 🎯 Conceptos Fundamentales

### 1. ¿Qué es la validación de formularios?

La validación es el proceso de verificar que los datos ingresados por el usuario cumplen con ciertos requisitos antes de ser procesados o enviados al servidor.

**Ejemplo del mundo real**: Es como un control de seguridad en el aeropuerto que verifica que tu pasaporte tenga todos los datos correctos antes de dejarte pasar.

### 2. Tipos de validación implementados

#### A) **Validación Nativa (HTML5)**

El navegador ya trae validaciones incorporadas que podemos usar con atributos HTML:

```html
<!-- EJEMPLO: Campo de email obligatorio -->
<input type="email" required />

<!-- ¿Qué valida automáticamente el navegador? -->
<!-- ✓ Que no esté vacío (required) -->
<!-- ✓ Que tenga formato de email (type="email") -->
```

**Atributos HTML5 más comunes:**

| Atributo | Propósito | Ejemplo |
|----------|-----------|---------|
| `required` | Campo obligatorio | `<input required>` |
| `type="email"` | Formato de email válido | `<input type="email">` |
| `pattern` | Expresión regular personalizada | `<input pattern="[0-9]{5}">` |
| `min` / `max` | Rango numérico | `<input type="number" min="1" max="100">` |
| `minlength` / `maxlength` | Longitud de texto | `<input minlength="3" maxlength="50">` |

#### B) **Validación Personalizada (JavaScript)**

A veces las validaciones nativas no son suficientes. Por ejemplo:

```javascript
// ❌ HTML no puede validar esto directamente:
// "El usuario debe tener al menos 16 años"

// ✅ Solución: Regla personalizada en JavaScript
fecha_nacimiento: v => {
  const y = new Date(v).getFullYear();
  const age = new Date().getFullYear() - y;
  return age >= 16 && age < 120; // Retorna true si es válido
}
```

### 3. La API ValidityState

El navegador nos proporciona un objeto que nos dice **QUÉ regla falló**:

```javascript
const input = document.querySelector('input[type="email"]');
input.value = "abc"; // ❌ No es un email válido

console.log(input.validity);
// ValidityState {
//   typeMismatch: true,  ← ¡El tipo no coincide!
//   valueMissing: false,
//   patternMismatch: false,
//   ...
// }
```

**¿Cómo lo usamos?**

```javascript
if (input.validity.typeMismatch) {
  console.log("El formato no es correcto");
}
```

---

## 🏗️ Arquitectura del Sistema

Nuestro sistema está dividido en **8 secciones** que trabajan juntas:

```
┌─────────────────────────────────────────────────────────┐
│                   USUARIO INTERACTÚA                     │
│              (escribe, hace clic, sale del campo)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  SECCIÓN 6: Eventos de validación visible              │
│  (blur, input, change, submit)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  SECCIÓN 2: validateField()                             │
│  Valida UN campo específico                             │
└───────┬──────────────────────┬──────────────────────────┘
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│ SECCIÓN 1:   │      │ VALIDACIÓN       │
│ Validación   │      │ PERSONALIZADA    │
│ Nativa       │      │ (rules.js)       │
└──────┬───────┘      └────────┬─────────┘
       │                       │
       └───────────┬───────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ ¿Es válido?     │
         └────┬────────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
   ❌ NO            ✅ SÍ
      │               │
      ▼               ▼
┌──────────┐    ┌──────────┐
│ Mostrar  │    │ Limpiar  │
│ error    │    │ error    │
└──────────┘    └──────────┘
      │               │
      └───────┬───────┘
              │
              ▼
    ┌─────────────────────┐
    │ SECCIÓN 5:          │
    │ Submit Gate         │
    │ (actualizar botón)  │
    └─────────────────────┘
```

### Flujo de datos simplificado:

1. **Usuario escribe** en un campo
2. **Evento se dispara** (ej: blur cuando sale del campo)
3. **validateField()** verifica si es válido
4. Si **hay error** → Muestra mensaje rojo
5. Si **está OK** → Limpia mensajes
6. **Submit gate** verifica TODO el formulario
7. Botón "Enviar" se **habilita o deshabilita**

---

## 🔄 Flujo de Validación

### Escenario 1: Usuario escribe su nombre

```javascript
// HTML
<input id="nombre" name="nombre" required minlength="2" />

// Usuario escribe: "A" y sale del campo (evento blur)
```

**Paso a paso:**

```javascript
// 1. Se dispara evento blur
el.addEventListener("blur", () => {
  validateField(el, { paint: true });
});

// 2. validateField() ejecuta validaciones
function validateField(input, { paint: true }) {
  // 2.1 Limpiar errores previos
  input.setCustomValidity("");
  
  // 2.2 Validación nativa
  if (!input.checkValidity()) {
    // ❌ Falla porque minlength="2" y solo escribió 1 letra
    const msg = getNativeMessage(input, "nombre");
    // msg = "Debe tener al menos 2 caracteres."
    
    showError(input, msg); // Muestra mensaje rojo
    return false;
  }
  
  // (No llega aquí porque ya falló antes)
}

// 3. Submit gate recalcula
// Botón permanece deshabilitado porque hay un campo inválido
```

### Escenario 2: Usuario corrige el error

```javascript
// Usuario escribe: "Ana" (ahora tiene 3 letras)

// 1. Se dispara evento input (mientras escribe)
el.addEventListener("input", () => {
  validateField(el, { paint: true });
});

// 2. validateField() vuelve a ejecutarse
function validateField(input, { paint: true }) {
  // 2.1 Validación nativa
  if (!input.checkValidity()) {
    // ✅ Ahora SÍ pasa (3 >= 2)
  }
  
  // 2.2 Validación personalizada
  const rule = rules["nombre"]; // v => v.trim().length >= 2
  if (rule && !rule("Ana")) {
    // ✅ También pasa (3 >= 2)
  }
  
  // 2.3 Todo OK → Limpiar error
  clearError(input); // Quita mensaje rojo
  return true;
}

// 3. Submit gate recalcula
// Si TODOS los demás campos también están OK, habilita el botón
```

---

## 🚀 Conceptos Avanzados

### 1. Validación Silenciosa vs. Visible

#### Validación Visible (paint=true)
- **Cuándo**: El usuario interactúa con campos (blur, input)
- **Qué hace**: Muestra mensajes de error rojos
- **Por qué**: Dar feedback inmediato al usuario

```javascript
// Usuario sale del campo email
input.addEventListener("blur", () => {
  validateField(input, { paint: true }); // ← Muestra error
});
```

#### Validación Silenciosa (paint=false)
- **Cuándo**: En tiempo real mientras el usuario escribe
- **Qué hace**: Solo calcula si es válido, sin mostrar nada
- **Por qué**: Para habilitar/deshabilitar botón sin molestar

```javascript
// Cada vez que cambia algo en el formulario
function update() {
  const allValid = isFormValid(form, validateCondiciones);
  submitBtn.disabled = !allValid; // Solo cambia el botón
}
```

**Analogía**: 
- **Visible** = Un profesor que corrige tu examen y te marca los errores en rojo
- **Silenciosa** = Un semáforo que cambia de rojo a verde sin decirte qué está mal

### 2. Event Delegation (Delegación de Eventos)

¿Por qué usamos `form.addEventListener("input", update, true)`?

```javascript
// ❌ Forma ineficiente (muchos listeners)
inputs.forEach(input => {
  input.addEventListener("input", update);
});

// ✅ Forma eficiente (un solo listener)
form.addEventListener("input", update, true);
//                                      ^^^^
//                                      useCapture: captura eventos
//                                      de todos los inputs
```

**El tercer parámetro `true`:**

```
FASE DE CAPTURA (capture: true)
     ┌───────┐
     │ form  │  ← Primero captura aquí
     └───┬───┘
         │
     ┌───▼───┐
     │ input │  ← Luego llega aquí
     └───────┘

FASE DE BURBUJEO (capture: false, default)
     ┌───────┐
     │ form  │  ← Llega aquí al final
     └───▲───┘
         │
     ┌───┴───┐
     │ input │  ← Primero aquí
     └───────┘
```

### 3. El patrón "Submit Gate" (Puerta de Envío)

Concepto: **El botón submit es una "puerta" que solo se abre cuando TODO es válido**

```javascript
function wireSubmitGate(form) {
  function update() {
    // Calcular si se cumple TODO
    const allValid = isFormValid(form);
    const consentsOK = tosCheckbox.checked;
    
    // Decisión: ¿Abrir o cerrar la puerta?
    const allow = allValid && consentsOK;
    
    // Actualizar botón
    submitBtn.disabled = !allow; // 🚪 Puerta cerrada/abierta
  }
  
  // Recalcular en tiempo real
  form.addEventListener("input", update, true);
  form.addEventListener("change", update, true);
}
```

**Beneficios:**
1. ✅ Previene envíos accidentales con datos inválidos
2. ✅ Feedback visual claro (botón gris = no puedes enviar)
3. ✅ Mejora la UX (el usuario sabe que falta algo)

### 4. Accesibilidad (ARIA)

Nuestro sistema es accesible para lectores de pantalla:

```javascript
// Marcar campo como inválido
input.setAttribute("aria-invalid", "true");

// Vincular mensaje de error al campo
const errorMsg = document.createElement("p");
errorMsg.id = "nombre-error";
errorMsg.setAttribute("role", "alert"); // ← Anuncia el error

input.setAttribute("aria-describedby", "nombre-error");
// ↑ El lector de pantalla lee el mensaje cuando enfoca el campo
```

**Resultado para usuarios con lectores de pantalla:**
> "Nombre, campo de texto obligatorio, inválido. Debe tener al menos 2 caracteres."

---

## ✍️ Ejercicios Prácticos

### Ejercicio 1: Agregar validación personalizada

**Objetivo**: Validar que el número de teléfono empiece con 6, 7, 8 o 9

```javascript
// 1. Abre js/validation/rules.js
// 2. Modifica la regla de telefono:

telefono: v => {
  // Validación original: solo formato
  const formatoOK = /^[0-9\s+()-]{9,20}$/.test(v);
  
  // NUEVA validación: debe empezar con 6, 7, 8 o 9
  const empiezaBien = /^[6789]/.test(v.trim());
  
  return formatoOK && empiezaBien;
},

// 3. Actualiza el mensaje en js/validation/messages.js
telefono: "Debe tener 9-20 caracteres y empezar con 6, 7, 8 o 9",
```

**Prueba:**
- Escribe `512345678` → ❌ Error (empieza con 5)
- Escribe `612345678` → ✅ OK

### Ejercicio 2: Cambiar el momento de validación

**Objetivo**: Validar solo al intentar enviar (quitar validación en blur/input)

```javascript
// En wireValidationUI(), comenta las validaciones de blur e input:

function wireValidationUI(form, validateCondiciones) {
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((el) => {
    // ❌ Comentar estas líneas
    // el.addEventListener("blur", () => validateField(el, { paint: true }));
    // el.addEventListener("input", () => validateField(el, { paint: true }));
    
    // ✅ Mantener solo change
    el.addEventListener("change", () => validateField(el, { paint: true }));
  });
  
  // Mantener la validación en submit (no comentar)
  form.addEventListener("submit", (e) => {
    // ...
  });
}
```

**Efecto:**
- Ahora solo valida al hacer submit
- UX menos intrusiva pero con menos feedback

### Ejercicio 3: Agregar validación de contraseña segura

**Objetivo**: Validar que una contraseña tenga al menos 8 caracteres, 1 mayúscula, 1 número

1. Agregar campo al HTML:
```html
<input type="password" name="password" id="password" required />
```

2. Agregar regla personalizada:
```javascript
// En js/validation/rules.js
password: v => {
  if (v.length < 8) return false; // Mínimo 8 caracteres
  if (!/[A-Z]/.test(v)) return false; // Al menos 1 mayúscula
  if (!/[0-9]/.test(v)) return false; // Al menos 1 número
  return true;
},
```

3. Agregar mensaje:
```javascript
// En js/validation/messages.js
password: "Mínimo 8 caracteres, 1 mayúscula y 1 número.",
```

**Prueba:**
- `abc123` → ❌ (sin mayúscula)
- `Abc123` → ❌ (menos de 8)
- `Abc12345` → ✅ OK

---

## 🎓 Preguntas de Autoevaluación

### Básicas

1. ¿Cuál es la diferencia entre validación nativa y personalizada?
2. ¿Qué hace el método `input.checkValidity()`?
3. ¿Cuándo se ejecuta el evento `blur` en un input?

### Intermedias

4. ¿Por qué usamos `paint: false` en `isFormValid()`?
5. ¿Qué ventaja tiene usar delegación de eventos con `useCapture: true`?
6. Explica el flujo completo desde que el usuario escribe hasta que se habilita el botón.

### Avanzadas

7. ¿Por qué el submit gate debe inicializarse ANTES de wireValidationUI?
8. ¿Cómo modificarías el código para validar en tiempo real solo después del primer error?
9. Diseña una validación personalizada para un campo de "Código postal internacional".

---

## 📖 Recursos Adicionales

- [MDN: Constraint Validation API](https://developer.mozilla.org/es/docs/Web/API/Constraint_validation)
- [MDN: ValidityState](https://developer.mozilla.org/es/docs/Web/API/ValidityState)
- [ARIA: Formularios accesibles](https://www.w3.org/WAI/tutorials/forms/)
- [Patrones de validación UX](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)

---

## 💡 Consejos para Estudiar este Código

1. **Lee el código de arriba hacia abajo**: Está organizado en secciones numeradas
2. **Ejecuta paso a paso con el debugger**: Pon breakpoints en `validateField()`
3. **Modifica y prueba**: Cambia mensajes, agrega validaciones, rompe cosas
4. **Dibuja el flujo**: Hacer diagramas te ayuda a visualizar
5. **Pregunta "¿Por qué?"**: No te quedes con el "qué", entiende el "por qué"

---

**¡Buena suerte con tu aprendizaje! 🚀**

Si tienes dudas, revisa los comentarios JSDoc en el código. Cada función está documentada con:
- Qué hace
- Qué parámetros recibe
- Qué retorna
- Ejemplos de uso
