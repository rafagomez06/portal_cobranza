import { fetchLogin } from "../services/loginService";
import { buildResponse, STATUS_MESSAGES } from "../utils/ApiResponse";

export const useLogin = () => {
  const IniciarSesion = async (userData) => {
    try {
      const response = await fetchLogin(userData);
      const { token, cod_cliente, nom_cliente, correo_cliente, id_cliente } =
        response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "cliente",
        JSON.stringify({
          cod_cliente,
          nom_cliente,
          correo_cliente,
          id_cliente,
        }),
      );

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

  return { IniciarSesion };
};
