import axios from "axios";
import {
  buildResponse,
  normalizeError,
  STATUS_MESSAGES,
} from "../utils/ApiResponse";

// API DE BACKEND
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://192.168.51.13:5000/api/v1/sic";

// Cabeceras de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Instancia base
export const ApiConexion = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, //evitar dejar carga infinita
  headers: { "Content-Type": "application/json" },
});

// REQUEST: adjunta el token automáticamente
ApiConexion.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE
ApiConexion.interceptors.response.use(
  // 2xx: resolvemos directamente con el contenido de "body"
  (response) => {
    const body = response.data?.body;
    if (body?.status_code) return body;

    if (response.status === 204) {
      return buildResponse({
        status_code: 204,
        status_message: STATUS_MESSAGES.SUCCESS,
        message: "",
      });
    }

    return Promise.reject(
      buildResponse({
        status_code: response.status,
        status_message: STATUS_MESSAGES.SERVER_ERROR,
        message: "Respuesta del servidor con formato inválido.",
      }),
    );
  },

  // Errores: siempre rechazamos con el formato estándar
  (error) => {
    const normalized = normalizeError(error);

    // Sesión expirada. Se excluye el login: ahí un 401 significa
    // "credenciales incorrectas", no "sesión expirada"
    const isLoginRequest = error?.config?.url?.includes("/auth/login");
    if (normalized.status_code === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(normalized);
  },
);

// Subida de archivos (FormData)
export const postForm = (path, formData, config = {}) =>
  ApiConexion.post(path, formData, {
    ...config,
    // Axios agrega el boundary correcto de multipart/form-data por su cuenta
    headers: { "Content-Type": "multipart/form-data", ...config.headers },
  });

export { API_BASE_URL };
