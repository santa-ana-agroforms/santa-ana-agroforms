import { useMutation } from "@tanstack/react-query";

import { deleteCampoActualSingle } from "../services/campos.services";

/**
 * Hook que elimina un (1) campo por su id_campo.
 * Usa react-query para manejar loading/error/success.
 */
export function useDeleteCampoActualSingle() {
  return useMutation({
    mutationFn: async ({ campoId }: { campoId: string }) => {
      return await deleteCampoActualSingle(campoId);
    },
  });
}
