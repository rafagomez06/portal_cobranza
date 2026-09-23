// src/utils/Auth.js
export const estaAutenticado = () => {
  // Revisa si existe un token válido en localStorage
  return !!localStorage.getItem("token");
};
