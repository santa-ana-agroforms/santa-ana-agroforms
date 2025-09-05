// src/hooks/useCategorias.ts
import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCategorias } from "../services/categories.service";

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
    queryFn: ({ signal }) => getCategorias({ signal }),
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
    queryFn: ({ signal }) => getCategorias({ signal }),
    staleTime: 60_000,
  });
}

export async function createCategoria(
  dto: CreateCategoriaDto,
  options?: { signal?: AbortSignal }
): Promise<Categoria> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/categorias/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto), // { nombre, descripcion }
      signal: options?.signal,
    }
  );

  if (!res.ok) {
    // Intenta extraer mensaje del backend si viene en JSON
    try {
      const err = await res.json();
      const msg =
        err?.message ??
        err?.detail ??
        "No se pudo crear la categoría. Intenta de nuevo.";
      throw new Error(msg);
    } catch {
      throw new Error("No se pudo crear la categoría. Intenta de nuevo.");
    }
  }

  return res.json();
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
