// src/create-forms/hooks/usePaginas.ts
import { useQuery } from "@tanstack/react-query";

import { getPaginas, type PaginaAPI } from "../services/pages.services";

export function usePaginas(formId?: string) {
  return useQuery<PaginaAPI[], Error>({
    queryKey: ["paginas", formId ?? "all"],
    queryFn: ({ signal }) => getPaginas({ signal, formId }),
  });
}
