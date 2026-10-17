import { ApiConexion } from "../configs/ApiConexion";

//Envia Solicitud de Cartera
export const fetchEnviarCartera = (data) =>
  ApiConexion.post("/archivo/solicitud-estado-cuenta", data);
