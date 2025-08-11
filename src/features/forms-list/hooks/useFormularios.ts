// hooks/useFormularios.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFormulario,
  CreateFormularioDto,
  Formulario,
  getFormularios,
} from "../services/forms-services";

export function useFormularios() {
  return useQuery<Formulario[]>({
    queryKey: ["formularios"],
    queryFn: getFormularios,
  });
}

export function useCreateFormulario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFormularioDto) => createFormulario(payload),
    onSuccess: () => {
      // invalida y refresca la lista
      qc.invalidateQueries({ queryKey: ["formularios"] });
    },
  });
}
