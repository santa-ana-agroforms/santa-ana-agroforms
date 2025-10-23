import { useQuery } from "@tanstack/react-query";

import {
  getGrupoByIdCampoGroup,
  type GrupoAPI,
} from "../services/grupos.service";

// Hook para obtener un grupo específico por id_campo_group
export function useGrupoByIdCampoGroup(id_campo_group?: string) {
  return useQuery<GrupoAPI, Error>({
    queryKey: ["grupo", id_campo_group],
    queryFn: ({ signal }) => {
      if (!id_campo_group) {
        throw new Error("id_campo_group es requerido");
      }
      return getGrupoByIdCampoGroup(id_campo_group, { signal });
    },
    enabled: !!id_campo_group, // Solo ejecutar si id_campo_group existe
  });
}
