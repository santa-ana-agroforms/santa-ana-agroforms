// src/create-forms/hooks/useCamposActual.ts
import { useMutation } from "@tanstack/react-query";

import {
  patchCamposActualBatch,
  postCamposSecuenciales,
  type CampoAPI,
} from "../services/campos.services";

type BatchVars = { pageId: string; campos: CampoAPI[] };

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
