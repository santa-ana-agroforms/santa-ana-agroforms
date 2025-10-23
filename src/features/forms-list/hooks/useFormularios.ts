// hooks/useFormularios.ts
import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  crearAsignacion,
  crearAsignacionMultipleUsuarios,
  createFormulario,
  CreateFormularioDto,
  deleteCategoria,
  deleteFormulario,
  duplicateFormulario,
  Formulario,
  getFormularioById,
  getFormularios,
  suspendFormulario,
  updateCategoria,
  UpdateCategoriaDto,
  updateFormulario,
} from "../services/forms-services";
import {
  Categoria,
  CreateAsignacionDto,
  FormularioAPI,
  UpdateFormularioDto,
} from "../services/types";

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
    placeholderData: () => qc.getQueryData<Formulario>(["formulario", id]),
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

export function useSuspendFormulario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendFormulario(id),
    onSuccess: (suspendido, id) => {
      // 🔄 Actualiza el formulario suspendido en cache
      qc.setQueryData<Formulario[]>(["formularios"], (prev) =>
        prev ?
          prev.map((f) => (f.id.toString() === id ? suspendido : f))
        : [suspendido]
      );
      qc.setQueryData(["formulario", id], suspendido);
    },
    onError: (error) => {
      console.error("Error al suspender formulario:", error);
      // opcional: notificación o mensaje visual
    },
  });
}

export function useUpdateFormulario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFormularioDto;
    }) => updateFormulario(id, payload),

    onSuccess: (actualizado, { id }) => {
      // Actualiza el cache individual
      qc.setQueryData(["formulario", id], actualizado);

      // Actualiza la lista de formularios
      qc.setQueryData<FormularioAPI[]>(["formularios"], (prev) =>
        prev ? prev.map((f) => (f.id === id ? actualizado : f)) : [actualizado]
      );
    },

    onError: (error) => {
      console.error("❌ Error al actualizar formulario:", error);
    },
  });
}

export function useDeleteCategoria() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoria(id),

    onSuccess: (_, id) => {
      // 🧹 Elimina la categoría de la lista cacheada
      qc.setQueryData<any[]>(["categorias"], (prev) =>
        prev ? prev.filter((cat) => cat.id.toString() !== id) : []
      );

      // 🗑️ Elimina también la query individual
      qc.removeQueries({ queryKey: ["categoria", id] });
    },

    onError: (error) => {
      console.error("❌ Error al eliminar categoría:", error);
      // Opcional: mostrar mensaje de error con antd
      // message.error("No se pudo eliminar la categoría");
    },
  });
}

/**
 * Hook para actualizar (editar) una categoría
 */
export function useUpdateCategoria() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | undefined;
      payload: UpdateCategoriaDto;
    }) => updateCategoria(id, payload),

    onSuccess: (actualizada, { id }) => {
      // Actualiza cache de lista
      qc.setQueryData<Categoria[]>(["categorias"], (old) =>
        old ?
          old.map((c) => (c.id.toString() === id ? actualizada : c))
        : [actualizada]
      );

      // Actualiza cache individual
      qc.setQueryData(["categoria", id], actualizada);
    },

    onError: (error) => {
      console.error("❌ Error al actualizar categoría:", error);
    },
  });
}
