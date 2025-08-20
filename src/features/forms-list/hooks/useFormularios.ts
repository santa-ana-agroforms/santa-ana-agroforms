// hooks/useFormularios.ts
import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFormulario,
  CreateFormularioDto,
  Formulario,
  getFormularioById,
  getFormularios,
} from "../services/forms-services";

export function useFormularios() {
  const { data } = useQuery({
    queryKey: ["formularios"],
    queryFn: ({ signal }) => getFormularios({ signal }),
    staleTime: 60_000,
  });

  const qc = useQueryClient();
  useEffect(() => {
    if (data) {
      data.forEach((f) => qc.setQueryData(["formulario", f.id], f));
    }
  }, [data, qc]);

  return { data };
}

export function useFormulario(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["formulario", id],
    queryFn: ({ signal }) => getFormularioById(id, { signal }),
    initialData: () => qc.getQueryData(["formulario", id]), // usa datos de la lista si ya están
    placeholderData: (prev) => prev, // evita parpadeo
    staleTime: 60_000,
  });
}

export function useCreateFormulario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFormularioDto) => createFormulario(payload),
    onSuccess: (nuevo) => {
      // agrega al final de la lista en cache
      qc.setQueryData<Formulario[]>(["formularios"], (prev) =>
        prev ? [...prev, nuevo] : [nuevo]
      );
      qc.setQueryData(["formulario", nuevo.id], nuevo);
    },
  });
}
