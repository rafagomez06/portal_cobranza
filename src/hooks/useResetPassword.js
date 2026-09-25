import {
  fetchActualizarPass,
  fetchSolicitudReiniciarPass,
} from "../services/resetPasswordService";
import { buildResponse, STATUS_MESSAGES } from "../utils/ApiResponse";

export const useResetPassword = () => {
  //Envio de correo al usuario con instrucciones
  const SolicitudReiniciarPassword = async (userData) => {
    try {
      const response = await fetchSolicitudReiniciarPass(userData);
      return { success: true, ...response };
    } catch (error) {
      const err =
        error?.status_code !== undefined
          ? error
          : buildResponse({
              status_code: 0,
              status_message: STATUS_MESSAGES.CLIENT_ERROR,
              message: "Ocurrió un error inesperado.",
            });

      return { success: false, ...err };
    }
  };

  //Actualiza Pass en BD
  const ActualizarPassword = async (userData) => {
    try {
      const response = await fetchActualizarPass(userData);
      return { success: true, ...response };
    } catch (error) {
      const err =
        error?.status_code !== undefined
          ? error
          : buildResponse({
              status_code: 0,
              status_message: STATUS_MESSAGES.CLIENT_ERROR,
              message: "Ocurrió un error inesperado.",
            });

      return { success: false, ...err };
    }
  };

  return { SolicitudReiniciarPassword, ActualizarPassword };
};
