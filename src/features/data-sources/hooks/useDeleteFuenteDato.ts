import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFuenteDato } from "../services/data-sources.services";

/**
 * Hook para eliminar una fuente de datos.
 * Usa React Query para invalidar la lista después de borrar.
 */
export function useDeleteFuenteDato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFuenteDato(id),
    onSuccess: () => {
      // ✅ Actualiza la cache del listado
      queryClient.invalidateQueries({ queryKey: ["fuentes-datos"] });
    },
  });
}
