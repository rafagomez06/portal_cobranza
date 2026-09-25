// src/utils/Auth.js
export const estaAutenticado = () => {
  return !!localStorage.getItem("token");
};

export const obtenerToken = () => {
  return localStorage.getItem("token");
};
