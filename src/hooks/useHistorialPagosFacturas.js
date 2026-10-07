import { useQuery } from "@tanstack/react-query";
import { fetchHistorialPagosFacturas } from "../services/fetchHistorialPagosFacturas";

// Claves de caché centralizadas
export const QUERY_KEYS = {
  historialPagosFacturas: (parametro) => [
    "historial-pagos-facturas",
    parametro?.cod_cliente ?? null,
    parametro?.factura ?? null,
  ],
};
const LISTADO_VACIO = { t_header: [], t_body: [] };

export function useHistorialPagosFacturas(parametro, options = {}) {
  //Valida que vengan parametros
  const parametroValido =
    Boolean(parametro?.cod_cliente) && Boolean(parametro?.factura);

  const {
    data: historialPagosFacturas = LISTADO_VACIO,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.historialPagosFacturas(parametro),
    queryFn: ({ signal }) => fetchHistorialPagosFacturas(parametro, { signal }),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, //5 min
    ...options,
    enabled: parametroValido && (options.enabled ?? true),
  });

  return { historialPagosFacturas, isLoading, isError, error, refetch };
}
