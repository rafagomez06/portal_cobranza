import { useQuery } from "@tanstack/react-query";
import { fetchListadoFacturas } from "../services/listadoFacturasService";

// Claves de caché centralizadas
export const QUERY_KEYS = {
  listadoFacturas: (parametro) => ["listado-facturas", parametro],
};

const LISTADO_VACIO = { t_header: [], t_body: [] };

export function useListadoFacturas(parametro, options = {}) {
  const {
    data: listadoFacturas = LISTADO_VACIO,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.listadoFacturas(parametro),
    queryFn: ({ signal }) => fetchListadoFacturas(parametro, { signal }),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5 min
    ...options,
    enabled: Boolean(parametro) && (options.enabled ?? true),
  });

  return { listadoFacturas, isLoading, isError, error, refetch };
}
