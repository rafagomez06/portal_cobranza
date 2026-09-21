// API DE BACKEND
const API_BASE_URL = "http://192.168.51.13:5000/api/v1/sic";

// Cabeceras de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Manejo centralizado de errores
const handleResponse = async (res) => {
  if (res.status === 401) {
    // Limpiar sesión y redirigir al login
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    let errorData = null;
    try {
      errorData = await res.json();
    } catch {
      // Si no es JSON, ignorar
    }
    const message = errorData?.message || `Error HTTP ${res.status}`;
    throw new Error(message);
  }

  // Si es 204 No Content, no intentes parsear
  if (res.status === 204) return null;

  return res.json();
};

// Fetch genérico
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return handleResponse(res);
}

// Métodos HTTP helpers
export const ApiConexion = {
  get: (path, options = {}) => apiFetch(path, { ...options, method: "GET" }),

  post: (path, body, options = {}) =>
    apiFetch(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path, body, options = {}) =>
    apiFetch(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (path, body, options = {}) =>
    apiFetch(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (path, options = {}) =>
    apiFetch(path, { ...options, method: "DELETE" }),

  // FormData (archivos)
  postForm: (path, formData, options = {}) =>
    apiFetch(path, {
      ...options,
      method: "POST",
      body: formData,
      //  No forzamos Content-Type para que el navegador
      // agregue el boundary correcto de multipart/form-data
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    }),
};

// Exportar la URL base por si se necesita
export { API_BASE_URL };
