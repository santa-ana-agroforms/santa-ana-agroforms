// src/hooks/useCampoActual.ts (o useCampoActualSingle.ts)

import { useMutation } from "@tanstack/react-query";

import {
  postCampoActualSingle,
  type CampoAPI,
} from "../services/campos.services";

/**
 * Hook que crea un (1) campo en la página especificada.
 * Usa react-query para manejar estados de loading/error/success.
 */
export function usePostCampoActualSingle() {
  return useMutation({
    mutationFn: async ({
      pageId,
      campo,
    }: {
      pageId: string;
      campo: CampoAPI;
    }) => {
      return await postCampoActualSingle(pageId, campo);
    },
  });
}
