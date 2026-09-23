import { ApiConexion } from "../configs/ApiConexion";

export const fetchLogin = (userData) =>
  ApiConexion.post("/auth/login", userData);

// Manejo centralizado de errores
const handleResponse = async (res) => {
  try {
    const body = await res.json();
    if (res.status === STATUS_CODES.CODE_200) {
      console.log("Respuesta Exitosa", body);

      const dataResponse = body?.data;

      return {
        success: true,
        message: body?.message || "Error al iniciar sesión",
      };
    } else {
      console.log("Error en respuesta", body);
    }
    return body;
  } catch (err) {
    console.error("Error parseando respuesta", err);
    return null;
  }
};
