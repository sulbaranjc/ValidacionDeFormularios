# 🏗️ Arquitectura del Sistema de Validación

## Resumen Ejecutivo

El sistema implementa una arquitectura de **validación por capas** que separa responsabilidades y permite validación tanto nativa (HTML5) como personalizada (JavaScript).

---

## 📊 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         FORMULARIO HTML                         │
│  (index.html con atributos: required, pattern, min, max, etc.) │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   formValidation.js (Orquestador)               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 1: Validación Nativa (getNativeMessage)          │  │
│  │  • Usa HTML5 Constraint Validation API                 │  │
│  │  • Lee input.validity para detectar errores            │  │
│  │  • Traduce errores técnicos a mensajes amigables       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 2: Validación Personalizada (validateField)      │  │
│  │  • Aplica reglas de negocio custom (rules.js)          │  │
│  │  • Combina validación nativa + custom                  │  │
│  │  • Retorna true/false según validez                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 3: Validación de Grupos (wireCondicionesMedicas) │  │
│  │  • Maneja lógica especial de checkboxes               │  │
│  │  • Implementa exclusividad mutua                       │  │
│  │  • Valida "al menos uno marcado"                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 4: Validación Global (isFormValid)               │  │
│  │  • Valida TODOS los campos en silencio                 │  │
│  │  • Determina estado general del formulario             │  │
│  │  • Usado por Submit Gate                               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 5: Control de Envío (wireSubmitGate)             │  │
│  │  • Habilita/deshabilita botón submit                   │  │
│  │  • Valida consentimientos (T&C, RGPD)                  │  │
│  │  • Actualización en tiempo real                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  CAPA 6: Feedback Visual (wireValidationUI)            │  │
│  │  • Muestra mensajes de error al usuario                │  │
│  │  • Eventos: blur, input, change, submit                │  │
│  │  • Usa dom.js para manipulación UI                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MÓDULOS DE SOPORTE                         │
│                                                                 │
│  rules.js          messages.js          dom.js                 │
│  • Reglas custom   • Mensajes error     • showError()          │
│  • Lógica negocio  • Textos amigables   • clearError()         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos (Caso de Uso Real)

### Escenario: Usuario completa el campo "Email"

```
┌────────────────────┐
│  1. USUARIO ESCRIBE│
│  "abc" en email    │
└────────┬───────────┘
         │
         ▼
┌────────────────────────────────────┐
│  2. USUARIO SALE DEL CAMPO (blur) │
└────────┬───────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  3. EVENTO blur CAPTURADO                  │
│  wireValidationUI registró el listener     │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  4. LLAMA validateField(input, {paint:true})│
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  5. VALIDACIÓN NATIVA                       │
│  input.checkValidity() → false             │
│  (porque "abc" no es email válido)         │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  6. getNativeMessage()                      │
│  Detecta: input.validity.typeMismatch=true │
│  Retorna: "Correo no válido."              │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  7. showError(input, "Correo no válido.")   │
│  • input.setAttribute("aria-invalid","true")│
│  • Crea <p class="error-msg">              │
│  • Vincula con aria-describedby            │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  8. validateField() retorna false           │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  9. EVENTO input SE DISPARA (en paralelo)  │
│  wireSubmitGate captura el cambio          │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  10. isFormValid(form) ejecuta              │
│  Valida TODOS los campos en silencio       │
│  Retorna: false (email inválido)           │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  11. ACTUALIZAR BOTÓN SUBMIT                │
│  submitBtn.disabled = true                  │
│  (Botón permanece deshabilitado)           │
└─────────────────────────────────────────────┘
```

### Ahora el usuario corrige:

```
┌────────────────────┐
│  1. ESCRIBE         │
│  "user@email.com"  │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  2. EVENTO input (mientras escribe)         │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  3. validateField(input, {paint:true})      │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  4. VALIDACIÓN NATIVA                       │
│  input.checkValidity() → true ✅           │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  5. VALIDACIÓN PERSONALIZADA                │
│  rules.email(value) → true ✅              │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  6. clearError(input)                       │
│  • Quita aria-invalid                      │
│  • Elimina <p class="error-msg">           │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  7. validateField() retorna true            │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  8. isFormValid() ejecuta                   │
│  Si TODOS los demás campos también OK       │
│  Retorna: true ✅                          │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  9. HABILITAR BOTÓN SUBMIT                  │
│  submitBtn.disabled = false ✅             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Patrones de Diseño Implementados

### 1. **Separation of Concerns (Separación de Responsabilidades)**

```
┌──────────────────────┬─────────────────────────────────┐
│ MÓDULO               │ RESPONSABILIDAD                 │
├──────────────────────┼─────────────────────────────────┤
│ formValidation.js    │ Orquestar validación y eventos  │
│ rules.js             │ Lógica de negocio               │
│ messages.js          │ Textos de usuario               │
│ dom.js               │ Manipulación UI                 │
└──────────────────────┴─────────────────────────────────┘
```

**Beneficio**: Cambiar un mensaje no requiere tocar la lógica de validación.

### 2. **Strategy Pattern (Patrón Estrategia)**

La validación usa diferentes estrategias según el tipo:

```javascript
// Estrategia 1: Validación nativa
if (!input.checkValidity()) { /* ... */ }

// Estrategia 2: Validación personalizada
if (rule && !rule(val)) { /* ... */ }
```

**Beneficio**: Fácil agregar nuevas validaciones sin modificar código existente.

### 3. **Observer Pattern (Patrón Observador)**

El submit gate "observa" cambios en el formulario:

```javascript
// El botón "observa" el estado del formulario
form.addEventListener("input", update, true);
form.addEventListener("change", update, true);

// Cada cambio notifica al "observador" que recalcule
```

**Beneficio**: Sincronización automática entre estado del formulario y botón.

### 4. **Facade Pattern (Patrón Fachada)**

`validateField()` es una fachada que oculta la complejidad:

```javascript
// Simple desde fuera
const esValido = validateField(input, { paint: true });

// Complejo por dentro
// - Validación nativa
// - Validación personalizada
// - Gestión de errores
// - Actualización UI
```

**Beneficio**: Interfaz simple para casos de uso complejos.

---

## 📋 Decisiones de Arquitectura

### ¿Por qué validación silenciosa + visible?

```
OPCIÓN A: Solo validación visible
❌ Problema: Mensajes de error molestos mientras se escribe
❌ Problema: No hay forma de saber el estado global sin molestar

OPCIÓN B: Solo validación silenciosa
❌ Problema: Usuario no sabe QUÉ está mal
❌ Problema: No hay feedback hasta submit

✅ NUESTRA SOLUCIÓN: Ambas
• Silenciosa → Controla botón en tiempo real
• Visible → Feedback al usuario en momentos clave (blur, submit)
```

### ¿Por qué separar condiciones médicas?

```
RAZÓN 1: Lógica especial
- No es un campo normal
- Tiene exclusividad mutua (Ninguna vs. Otros)
- Requiere validación de grupo

RAZÓN 2: Reutilizable
- La función wireCondicionesMedicas() es autocontenida
- Se puede copiar a otros formularios

RAZÓN 3: Mantenible
- Si cambia la lógica, solo modificas una función
- No contamina el flujo general de validación
```

### ¿Por qué delegación de eventos con capture?

```
SIN DELEGACIÓN:
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│input 1 │  │input 2 │  │input 3 │  │ ...N   │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │
    └───────────┴───────────┴───────────┘
              N listeners

CON DELEGACIÓN (capture: true):
        ┌──────────┐
        │   FORM   │  ← 1 solo listener
        └────┬─────┘
             │ (captura todos)
    ┌────────┼────────┐
    │        │        │
┌───▼──┐ ┌──▼───┐ ┌──▼───┐
│input1│ │input2│ │input3│
└──────┘ └──────┘ └──────┘
```

**Beneficios:**
- Menos memoria (1 listener vs N)
- Captura eventos de inputs dinámicos automáticamente
- Más eficiente para formularios grandes

---

## 🔐 Seguridad y Validación

### Capas de Validación

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTE (JavaScript)                                   │
│  • Validación UX (feedback rápido)                      │
│  • NO es seguridad (puede ser deshabilitada)           │
│  • Reduce carga del servidor                            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  SERVIDOR (Backend - NO IMPLEMENTADO EN ESTE PROYECTO)  │
│  • Validación REAL de seguridad                         │
│  • Nunca confiar en validación cliente                  │
│  • Re-validar TODO en servidor                          │
└─────────────────────────────────────────────────────────┘
```

**IMPORTANTE**: La validación JavaScript es para UX, no para seguridad. Un usuario malicioso puede:
- Deshabilitar JavaScript
- Modificar el código en DevTools
- Enviar requests directos al servidor

**Siempre valida en el servidor también.**

---

## 📊 Métricas de Complejidad

```
┌─────────────────────┬──────────┬────────────────────┐
│ FUNCIÓN             │ LÍNEAS   │ COMPLEJIDAD        │
├─────────────────────┼──────────┼────────────────────┤
│ getNativeMessage    │ ~45      │ Baja (if/else)     │
│ validateField       │ ~35      │ Media (2 capas)    │
│ wireCondiciones...  │ ~100     │ Alta (lógica UI)   │
│ isFormValid         │ ~20      │ Baja (loop simple) │
│ wireSubmitGate      │ ~50      │ Media (eventos)    │
│ wireValidationUI    │ ~40      │ Media (eventos)    │
│ wireResetCleanup    │ ~35      │ Baja (limpieza)    │
└─────────────────────┴──────────┴────────────────────┘

TOTAL: ~325 líneas (sin comentarios)
       ~650 líneas (con documentación)
```

**Ratio documentación/código: ~2:1**
- Por cada línea de código, hay 2 líneas de documentación
- Objetivo: Código educativo comprensible

---

## 🚀 Extensibilidad

### Fácil de extender para:

✅ **Agregar nuevas validaciones**
```javascript
// En rules.js
nuevoCampo: v => {
  // Tu lógica aquí
  return true/false;
}
```

✅ **Cambiar mensajes**
```javascript
// En messages.js
nuevoCampo: "Tu mensaje aquí"
```

✅ **Agregar validaciones asíncronas** (ej: verificar email en servidor)
```javascript
async function validateEmailExists(email) {
  const response = await fetch(`/api/check-email?email=${email}`);
  return response.ok;
}
```

✅ **Soportar múltiples formularios**
```javascript
// Generalizar el código
function initFormValidation(formId) {
  const form = document.getElementById(formId);
  // ... resto de la lógica
}

// Inicializar varios formularios
initFormValidation("form-inscripcion");
initFormValidation("form-contacto");
```

---

## 🎓 Conclusión

Este sistema implementa una arquitectura robusta y educativa que:

1. ✅ **Separa responsabilidades** claramente
2. ✅ **Combina validación nativa y personalizada** eficientemente
3. ✅ **Proporciona feedback inmediato** al usuario
4. ✅ **Es accesible** (ARIA, lectores de pantalla)
5. ✅ **Es extensible** y mantenible
6. ✅ **Está completamente documentado** para aprendizaje

**Ideal para aprender conceptos de:**
- Validación de formularios
- Eventos del DOM
- Patrones de diseño
- Accesibilidad web
- Arquitectura de software frontend
