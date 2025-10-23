import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  patchPagina,
  type UpdatePaginaDto,
  type UpdatePaginaResponse,
} from "../services/pages.services";

/**
 * Hook para actualizar una página existente vía PATCH.
 * Ejemplo de uso:
 * const { mutate, isPending } = usePatchPagina();
 * mutate({ pageId: "123", payload: { title: "Nuevo título" } });
 */
export function usePatchPagina() {
  const qc = useQueryClient();

  type Vars = { pageId: string; payload: UpdatePaginaDto };
  type Ctx = { previous?: any };

  return useMutation<UpdatePaginaResponse, Error, Vars, Ctx>({
    mutationFn: ({ pageId, payload }) => patchPagina(pageId, payload),

    onMutate: async ({ pageId }) => {
      // Cancelamos queries activas para evitar conflictos
      await qc.cancelQueries({ queryKey: ["pagina", pageId] });
      const previous = qc.getQueryData(["pagina", pageId]);
      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(["pagina", _vars.pageId], ctx.previous);
      }
    },

    onSuccess: (resp, vars) => {
      const { pagina } = resp;
      if (pagina) {
        qc.setQueryData(["pagina", vars.pageId], pagina);
        // refrescar la lista de páginas
        qc.invalidateQueries({ queryKey: ["paginas", pagina.formularioId] });
        qc.invalidateQueries({ queryKey: ["formulario", pagina.formularioId] });
      }
    },
  });
}
