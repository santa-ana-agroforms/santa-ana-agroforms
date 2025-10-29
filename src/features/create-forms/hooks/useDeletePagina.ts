import { useMutation } from "@tanstack/react-query";

import { deletePagina } from "../services/pages.services";

/**
 * Hook para eliminar una página por su ID.
 * Usa React Query para manejar estados de loading/error/success.
 */
export function useDeletePagina() {
  return useMutation({
    mutationFn: async ({ pageId }: { pageId: string }) => {
      return await deletePagina(pageId);
    },
  });
}
