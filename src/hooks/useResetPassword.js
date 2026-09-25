import { fetchResetPass } from "../services/resetPasswordService";
import { buildResponse, STATUS_MESSAGES } from "../utils/ApiResponse";

export const useResetPassword = () => {
  const ReiniciarPassword = async (userData) => {
    try {
      console.log("HOOOK userData ", userData);

      const response = await fetchResetPass(userData);

      console.log("response ", response);

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

  return { ReiniciarPassword };
};
