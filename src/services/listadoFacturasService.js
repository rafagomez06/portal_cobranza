import { ApiConexion } from "../configs/ApiConexion";

export const fetchListadoFacturas = (cod_cliente, config = {}) =>
  ApiConexion.get("/pago/listado-facturas", {
    params: { cod_cliente },
    ...config,
  });
