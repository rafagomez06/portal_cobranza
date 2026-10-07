import { fetchRegistrarPago } from "../services/registrarPagoService";
import { buildResponse, STATUS_MESSAGES } from "../utils/ApiResponse";

export const useRegistrarPago = () => {
  const RegistrarPago = async (formData) => {
    try {
      const response = await fetchRegistrarPago(formData);
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

  return { RegistrarPago };
};
