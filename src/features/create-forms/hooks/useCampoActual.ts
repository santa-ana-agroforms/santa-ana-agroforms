// src/create-forms/hooks/useCamposActual.ts
import { useMutation } from "@tanstack/react-query";

import {
  postCamposActualBatch,
  type CampoAPI,
} from "../services/campos.services";

type BatchVars = { pageId: string; campos: CampoAPI[] };

export function usePostCamposActualBatch() {
  return useMutation({
    mutationKey: ["campos-actual", "batch"],
    mutationFn: ({ pageId, campos }: BatchVars) =>
      postCamposActualBatch(pageId, campos),
  });
}
