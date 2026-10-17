import { fetchEnviarCartera } from "../services/enviarCarteraService";
import { buildResponse, STATUS_MESSAGES } from "../utils/ApiResponse";

export const useEnviarCartera = () => {
  //Envio de correo al usuario con instrucciones
  const EnviarCartera = async (data) => {
    try {
      console.log(data);
      const response = await fetchEnviarCartera(data);
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

  return { EnviarCartera };
};
