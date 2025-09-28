// js/utils/dom.js
export function showError(input, msg) {
  input.setAttribute("aria-invalid", "true");
  let hint = input.parentElement.querySelector(".error-msg");
  if (!hint) {
    hint = document.createElement("p");
    hint.className = "error-msg";
    hint.setAttribute("role", "alert");
    input.parentElement.appendChild(hint);
  }
  hint.textContent = msg;
}

export function clearError(input) {
  input.removeAttribute("aria-invalid");
  const hint = input.parentElement.querySelector(".error-msg");
  if (hint) hint.remove();
}
