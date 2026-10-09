import { ApiConexion } from "../configs/ApiConexion";

export const fetchHistorialNotasCredito = (paramsData, config = {}) =>
  ApiConexion.get("/pago/historial-notas-credito", {
    params: paramsData,
    ...config,
  });
