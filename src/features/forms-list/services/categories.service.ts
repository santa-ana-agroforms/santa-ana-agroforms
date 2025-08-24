export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export async function getCategorias(options?: {
  signal?: AbortSignal;
}): Promise<Categoria[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/categorias/`,
    {
      headers: { Accept: "application/json" },
      signal: options?.signal,
    }
  );
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
}
