import axios from "axios";

export const STATUS_MESSAGES = {
  SUCCESS: "Success",
  LOGIN_FAILED: "login_failed",
  NETWORK_ERROR: "network_error",
  TIMEOUT: "timeout",
  SERVER_ERROR: "server_error",
  CLIENT_ERROR: "client_error",
  CANCELED: "canceled",
  TOKEN_EXPIRED: "missing_authorization_header",
};

// Misma estructura que devuelve el backend
export const buildResponse = ({
  status_code,
  status_message,
  message,
  data = {},
}) => ({
  status_code,
  status_message,
  message,
  timestamp: new Date().toISOString(),
  data,
});

// Convierte CUALQUIER error de axios en el formato estándar
export const normalizeError = (error) => {
  // Petición cancelada a propósito (AbortController / unmount de React)
  if (axios.isCancel(error)) {
    return buildResponse({
      status_code: 0,
      status_message: STATUS_MESSAGES.CANCELED,
      message: "La solicitud fue cancelada.",
    });
  }
  const body = error?.response?.data?.body;
  if (body?.status_code) return body;

  // El backend respondió, pero SIN estructura (HTML de un 502, 404 de proxy,401 etc.)
  if (error?.response) {
    //Validación de token expirado
    let httpStatusCode = error?.response?.status;
    let msgToken = error?.response?.data?.msg;
    let msgTokenConvert = msgToken.toLowerCase().replaceAll(" ", "_");
    //Token expirado y 401:
    if (
      msgTokenConvert === STATUS_MESSAGES.TOKEN_EXPIRED &&
      httpStatusCode == 401
    ) {
      return buildResponse({
        status_code: error.response.status,
        status_message: STATUS_MESSAGES.TOKEN_EXPIRED,
        message:
          "La sesión ha expirado. Por seguridad será redireccionado al Login.",
      });
    }
    return buildResponse({
      status_code: error.response.status,
      status_message: STATUS_MESSAGES.SERVER_ERROR,
      message: "El servidor no pudo procesar la solicitud. Intenta más tarde.",
    });
  }

  // Timeout
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return buildResponse({
      status_code: 0,
      status_message: STATUS_MESSAGES.TIMEOUT,
      message: "El servidor tardó demasiado en responder.",
    });
  }

  //Sin respuesta: backend caído, sin internet o CORS
  if (error?.request || error?.code === "ERR_NETWORK") {
    return buildResponse({
      status_code: 0,
      status_message: STATUS_MESSAGES.NETWORK_ERROR,
      message: "No se pudo conectar con el servidor. Verifica tu conexión.",
    });
  }

  // Error inesperado del propio cliente
  return buildResponse({
    status_code: 0,
    status_message: STATUS_MESSAGES.CLIENT_ERROR,
    message: "Ocurrió un error inesperado.",
  });
};
