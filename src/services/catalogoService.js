import { ApiConexion } from "../configs/ApiConexion";

//Obtiene Catalogo de Tipos Facturas
export async function fetchCatalogos() {
  const json = await ApiConexion.get("/catalogo/tipos-facturas");

  return (json?.body?.data ?? []).map((item) => ({
    idTipoFactura: item.id_tipo_factura,
    descripcion: item.descripcion ?? "",
  }));
}
