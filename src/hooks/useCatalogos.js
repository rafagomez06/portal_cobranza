import { useQuery } from "@tanstack/react-query";
import { fetchCatalogos } from "../services/catalogoService";

// Claves de caché centralizadas para reutilizarlas fácilmente
export const QUERY_KEYS = {
  tiposFacturas: ["catalogos", "tipos-facturas"],
};

export function useCatalogos() {
  // Queries
  const {
    data: tiposFacturas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.tiposFacturas,
    queryFn: fetchCatalogos,
    staleTime: 1000 * 60 * 30, // 30 min
  });

  return {
    tiposFacturas,
    isLoading,
    isError,
    error,
    refetch,
  };
}
