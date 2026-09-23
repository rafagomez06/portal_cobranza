import { ApiConexion } from "../configs/ApiConexion";

export const mapTipoFactura = (item) => ({
  idTipoFactura: item.id_tipo_factura,
  descripcion: item.descripcion ?? "",
});

// Obtiene catálogo de tipos de facturas
export const fetchCatalogos = (config = {}) =>
  ApiConexion.get("/catalogo/tipos-facturas", config);
