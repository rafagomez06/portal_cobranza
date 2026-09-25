import { ApiConexion } from "../configs/ApiConexion";

export const fetchResetPass = (userData) =>
  ApiConexion.put("/auth/actualizar-password", userData);

// Manejo centralizado de errores
const handleResponse = async (res) => {
  try {
    console.log("AAAAAAAAA");
    const body = await res.json();
    if (res.status === STATUS_CODES.CODE_200) {
      console.log("Respuesta Exitosa", body);

      const dataResponse = body?.data;

      return {
        success: true,
        message: body?.message || "Error al reiniciar password",
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
