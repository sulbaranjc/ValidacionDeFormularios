// js/validation/rules.js
export const rules = {
  nombre: v => v.trim().length >= 2,
  apellidos: v => v.trim().length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telefono: v => /^[0-9\s+()-]{9,20}$/.test(v),
  cp: v => /^\d{5}$/.test(v),
  dni: v => /^[A-Za-z0-9]{5,15}$/.test(v),
  iban_ultimos: v => /^\d{4}$/.test(v),
  fecha_nacimiento: v => {
    if (!v) return false;
    const y = new Date(v).getFullYear();
    const age = new Date().getFullYear() - y;
    return age >= 16 && age < 120;
  },
};
