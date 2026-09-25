import { useQuery } from "@tanstack/react-query";
import { fetchCatalogos, mapTipoFactura } from "../services/catalogoService";

// Claves de caché centralizadas para reutilizarlas fácilmente
export const QUERY_KEYS = {
  tiposFacturas: (parametroCatalogo) => ["tipos-facturas", parametroCatalogo],
};

// Constantes fuera del hook: mantienen la misma referencia entre renders
const CATALOGO_VACIO = [];

const selectTiposFacturas = (response) =>
  Array.isArray(response.data) ? response.data.map(mapTipoFactura) : [];

export function useCatalogos(parametroCatalogo, options = {}) {
  const {
    data: tiposFacturas = CATALOGO_VACIO,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.tiposFacturas, parametroCatalogo],
    queryFn: ({ signal }) => fetchCatalogos(parametroCatalogo, { signal }),
    select: selectTiposFacturas,
    staleTime: 1000 * 60 * 30, // 30 min
    ...options,
  });

  return { tiposFacturas, isLoading, isError, error, refetch };
}
