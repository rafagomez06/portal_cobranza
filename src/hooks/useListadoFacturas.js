import { useQuery } from "@tanstack/react-query";
import { fetchListadoFacturas } from "../services/listadoFacturasService";

// Claves de caché centralizadas
export const QUERY_KEYS = {
  listadoFacturas: (parametro) => ["listado-facturas", parametro],
};

export function useListadoFacturas(parametro, options = {}) {
  const {
    data: listadoFacturas = { t_header: [], t_body: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.listadoFacturas(parametro),
    queryFn: () => fetchListadoFacturas(parametro),
    enabled: Boolean(parametro) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 1, // 30 min
    ...options,
  });

  return {
    listadoFacturas,
    isLoading,
    isError,
    error,
    refetch,
  };
}
