import { ApiConexion } from "../configs/ApiConexion";

export const mapTipoFactura = (item) => ({
  idTipoFactura: item.id_tipo_factura,
  descripcion: item.descripcion ?? "",
});

// Obtiene catálogo de tipos de facturas
export const fetchCatalogos = (clv_tipo, config = {}) =>
  ApiConexion.get("/catalogo/tipos-facturas", {
    params: { clv_tipo },
    ...config,
  });

export const fetchListadoFacturas = (cod_cliente, config = {}) =>
  ApiConexion.get("/pago/listado-facturas", {
    params: { cod_cliente },
    ...config,
  });
