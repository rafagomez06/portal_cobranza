import { ApiConexion } from "../configs/ApiConexion";

export const fetchHistorialPagosFacturas = (paramsData, config = {}) =>
  ApiConexion.get("/pago/historial-pagos-factura", {
    params: paramsData,
    ...config,
  });
