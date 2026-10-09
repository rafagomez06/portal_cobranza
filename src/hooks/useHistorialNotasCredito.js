import { useQuery } from "@tanstack/react-query";
import { fetchHistorialNotasCredito } from "../services/historialNotasCreditoService";

// Claves de caché centralizadas
export const QUERY_KEYS = {
  historialNotasCredito: (parametro) => [
    "historial-notas-credito",
    parametro?.cod_cliente ?? null,
    parametro?.factura ?? null,
  ],
};
const LISTADO_VACIO = { t_header: [], t_body: [] };

export function useHistorialNotasCredito(parametro, options = {}) {
  //Valida que vengan parametros
  const parametroValido =
    Boolean(parametro?.cod_cliente) && Boolean(parametro?.factura);

  const {
    data: historialNotasCredito = LISTADO_VACIO,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.historialNotasCredito(parametro),
    queryFn: ({ signal }) => fetchHistorialNotasCredito(parametro, { signal }),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, //5 min
    ...options,
    enabled: parametroValido && (options.enabled ?? true),
  });

  return { historialNotasCredito, isLoading, isError, error, refetch };
}
