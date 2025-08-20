// src/hooks/useCategorias.ts
import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCategorias } from "../services/categories.service";

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
