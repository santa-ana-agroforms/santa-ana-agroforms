// src/create-forms/hooks/useCamposActual.ts
import { useMutation } from "@tanstack/react-query";

import {
  patchCampoActualSingle,
  patchCamposActualBatch,
  postCamposSecuenciales,
  type CampoAPI,
} from "../services/campos.services";

type BatchVars = { pageId: string; campos: CampoAPI[] };
interface PatchCampoVars {
  campoId: string;
  campo: CampoAPI;
}

export function usePostCamposActualBatch() {
  return useMutation({
    mutationKey: ["campos-actual", "batch"],
    mutationFn: ({ pageId, campos }: BatchVars) =>
      postCamposSecuenciales(pageId, campos),
  });
}

export function usePatchCamposActualBatch() {
  return useMutation({
    mutationKey: ["campos-actual", "batch", "patch"],
    mutationFn: ({ pageId, campos }: BatchVars) =>
      patchCamposActualBatch(pageId, campos),
  });
}

/**
 * Hook para hacer PATCH de un solo campo existente.
 * Usa React Query para manejar estados de carga, éxito y error.
 */
export function usePatchCampoActualSingle() {
  return useMutation({
    mutationKey: ["campos-actual", "single", "patch"],
    mutationFn: async ({ campoId, campo }: PatchCampoVars) => {
      if (!campoId) throw new Error("campoId es requerido");
      return await patchCampoActualSingle(campoId, campo);
    },
  });
}
