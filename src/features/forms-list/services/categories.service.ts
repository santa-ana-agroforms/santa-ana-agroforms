import { api } from "@/features/user-autentication/services/auth.service";

import { CreateCategoriaDto } from "../hooks/useCategorias";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export async function getCategorias(): Promise<Categoria[]> {
  const res = await api.get("/api/categorias/");
  return res.data;
}

/**
 * Crea una nueva categoría
 */
export async function createCategoria(
  payload: CreateCategoriaDto,
  opts?: { signal?: AbortSignal }
): Promise<Categoria> {
  const res = await api.post<Categoria>("/api/categorias/", payload, {
    signal: opts?.signal,
  });
  return res.data;
}
