import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  crearFuenteDato,
  type CrearFuenteDatoParams,
} from "../services/data-sources.services";

/**
 * Hook para crear una fuente de datos nueva (subir archivo a Azure)
 */
export function useCreateFuenteDato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearFuenteDatoParams) => crearFuenteDato(data),
    onSuccess: () => {
      // Invalida el listado de fuentes para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["fuentes-datos"] });
    },
  });
}
