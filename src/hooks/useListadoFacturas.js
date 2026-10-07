import { useQuery } from "@tanstack/react-query";
import { fetchListadoFacturas } from "../services/listadoFacturasService";

// Claves de caché centralizadas
export const QUERY_KEYS = {
  listadoFacturas: (parametro) => [
    "listado-facturas",
    parametro?.rfc ?? null,
    parametro?.moneda ?? null,
  ],
};

const LISTADO_VACIO = { t_header: [], t_body: [] };

export function useListadoFacturas(parametro, options = {}) {
  //Valida que vengan parametros
  const parametroValido = Boolean(parametro?.rfc) && Boolean(parametro?.moneda);

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
    enabled: parametroValido && (options.enabled ?? true),
  });

  return { listadoFacturas, isLoading, isError, error, refetch };
}
