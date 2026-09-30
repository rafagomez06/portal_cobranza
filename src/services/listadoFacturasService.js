import { ApiConexion } from "../configs/ApiConexion";

export const fetchListadoFacturas = (paramsData, config = {}) =>
  ApiConexion.get("/pago/listado-facturas", {
    params: paramsData,
    ...config,
  });
