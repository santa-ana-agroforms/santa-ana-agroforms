// src/hooks/useCategorias.ts
import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategoria, getCategorias } from "../services/categories.service";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion: string;
}

// src/hooks/useCategorias.ts
export function useCategorias() {
  const { data } = useQuery({
    queryKey: ["categorias"],
    queryFn: ({ signal }) => getCategorias(),
    staleTime: 60_000,
  });

  const qc = useQueryClient();
  useEffect(() => {
    if (data) {
      data.forEach((c) => qc.setQueryData(["categoria", c.id], c));
    }
  }, [data, qc]);

  // Retorna todas las propiedades de useQuery
  return useQuery({
    queryKey: ["categorias"],
    queryFn: ({ signal }) => getCategorias(),
    staleTime: 60_000,
  });
}

export function useCreateCategoria() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoriaDto) => createCategoria(dto),
    onSuccess: (created: Categoria) => {
      // 1) Inserta al principio en lista de categorias (si está en cache)
      qc.setQueryData<Categoria[]>(["categorias"], (old) =>
        old ? [created, ...old] : [created]
      );
      // 2) Guarda por id
      qc.setQueryData(["categoria", created.id], created);
    },
    onSettled: () => {
      // Como alternativa: invalidar para refetch y asegurar consistencia
      // qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}
