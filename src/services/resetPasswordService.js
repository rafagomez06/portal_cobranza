import { ApiConexion } from "../configs/ApiConexion";

//Envia Correo a cliente con instrucciones
export const fetchSolicitudReiniciarPass = (userData) =>
  ApiConexion.post("/auth/solicitar-reiniciar-password", userData);

//Actualiza Pass en BD.
export const fetchActualizarPass = (userData) =>
  ApiConexion.post("/auth/actualizar-password", userData);
