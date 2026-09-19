const API_BASE_URL = "http://192.168.51.13:5000/api/v1/sic";

//###################################################
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

//Fetch a la Api
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (res.status === 401) throw new Error("Sesión expirada");
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  return res.json();
}

//Obtiene Catalogo de Tipos Facturas
export async function fetchCatalogos() {
  const json = await apiFetch("/catalogo/tipos-facturas");

  return (json?.body?.data ?? []).map((item) => ({
    idTipoFactura: item.id_tipo_factura,
    descripcion: item.descripcion ?? "",
  }));
}

// export async function fetchCatalogos() {
//   const res = await fetch(`${API_BASE_URL}/catalogo/tipos-facturas`, {
//     headers: getAuthHeaders(),
//   });
//   if (!res.ok) throw new Error("Error al cargar catalogo");
//   const json = await res.json();

//   //Retorno de valores obtenidos
//   return json.body.data.map((item) => ({
//     idTipoFactura: item.id_tipo_factura,
//     descripcion: item.descripcion || "",
//   }));
// }
