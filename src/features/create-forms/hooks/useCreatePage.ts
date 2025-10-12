// src/create-forms/hooks/useCreatePagina.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPagina,
  type AgregarPaginaResponse,
  type CreatePaginaDto,
} from "../services/pages.services";

export function useCreatePagina(formId: string) {
  const qc = useQueryClient();

  // Derivamos el tipo de "pagina" desde la respuesta
  type Pagina = AgregarPaginaResponse["pagina"];
  type Ctx = { previous?: Pagina[] };

  

  return useMutation<AgregarPaginaResponse, Error, CreatePaginaDto, Ctx>({
    mutationFn: (payload) => createPagina(formId, payload),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["paginas", formId] });
      const previous = qc.getQueryData<Pagina[]>(["paginas", formId]);
      return { previous }; // <- ahora esto coincide con Ctx
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData<Pagina[]>(["paginas", formId], ctx.previous);
      }
    },


    onSuccess: (resp) => {
      const pagina = resp?.pagina;
      // resp ya es AgregarPaginaResponse
      qc.setQueryData<Pagina>(["pagina", pagina.id], resp.pagina);
      qc.invalidateQueries({ queryKey: ["paginas", formId] });
      qc.invalidateQueries({ queryKey: ["formulario", formId] });
    },
  });
}
