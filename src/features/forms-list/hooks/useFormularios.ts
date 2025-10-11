// hooks/useFormularios.ts
import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  crearAsignacion,
  crearAsignacionMultipleUsuarios,
  createFormulario,
  CreateFormularioDto,
  deleteFormulario,
  duplicateFormulario,
  Formulario,
  getFormularioById,
  getFormularios,
} from "../services/forms-services";
import { CreateAsignacionDto } from "../services/types";

export function useFormularios() {
  const { data } = useQuery({
    queryKey: ["formularios"],
    queryFn: ({ signal }) => getFormularios(),
    staleTime: 60_000,
  });

  const qc = useQueryClient();
  useEffect(() => {
    if (data) {
      data.forEach((f: any) => qc.setQueryData(["formulario", f.id], f));
    }
  }, [data, qc]);

  return { data };
}

export function useFormulario(id: string) {
  const qc = useQueryClient();
  return useQuery<Formulario, Error>({
    queryKey: ["formulario", id],
    queryFn: ({ signal }) => getFormularioById(id, { signal }),
    // muestra lo que haya en cache mientras se pide el detalle
    placeholderData: () =>
      qc.getQueryData<Formulario>(["formulario", id]),
    // o 0 si quieres que siempre refetchee al montar
    staleTime: 0,
    enabled: !!id,
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

export function useDeleteFormulario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFormulario(id),
    onSuccess: (_, id) => {
      // Elimina el formulario de la cache
      qc.setQueryData<Formulario[]>(["formularios"], (prev) =>
        prev ? prev.filter((form) => form.id.toString() !== id) : []
      );

      // Elimina también la query individual si existe
      qc.removeQueries({ queryKey: ["formulario", id] });
    },
    onError: (error) => {
      console.error("Error al eliminar formulario:", error);
      // Puedes mostrar una notificación de error aquí
    },
  });
}

export function useDuplicateFormulario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateFormulario(id),
    onSuccess: (duplicado) => {
      // agrega el duplicado a la lista y cache individual
      qc.setQueryData<Formulario[]>(["formularios"], (prev) =>
        prev ? [...prev, duplicado] : [duplicado]
      );
      qc.setQueryData(["formulario", duplicado.id], duplicado);
    },
    onError: (error) => {
      console.error("Error al duplicar formulario:", error);
    },
  });
}

/** Hook simple: una asignación (usuario → formularios[]) */
export function useCrearAsignacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAsignacionDto) => crearAsignacion(payload),
    // Opcional: invalidar algo si tu UI depende de ello
    // onSuccess: () => qc.invalidateQueries({ queryKey: ["asignaciones"] }),
  });
}

/**
 * Hook batch: múltiples usuarios a la vez.
 * Recibe { usuarios: string[], formularios: string[] }
 */
export function useCrearAsignacionMultiple() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { usuarios: string[]; formularios: string[] }) =>
      crearAsignacionMultipleUsuarios(input.usuarios, input.formularios),
    // onSuccess: () => qc.invalidateQueries({ queryKey: ["asignaciones"] }),
  });
}