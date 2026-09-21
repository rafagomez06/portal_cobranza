import { ApiConexion } from "../configs/ApiConexion.js";

// Obtiene listado de facturas por cliente
export async function fetchListadoFacturas(parametro) {
  // Si el parámetro puede ser undefined, evita enviarlo
  const query = parametro
    ? `?cod_cliente=${encodeURIComponent(parametro)}`
    : "";

  const json = await ApiConexion.get(`/pago/listado-facturas${query}`);

  console.log("Listado:", json);

  // El backend devuelve { t_header, t_body }
  return json?.body?.data ?? { t_header: [], t_body: [] };
}
