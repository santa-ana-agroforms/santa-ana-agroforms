// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min: evita refetch inmediato
      gcTime: 5 * 60_000, // 5 min en caché si no se usa
      refetchOnWindowFocus: false,
    },
  },
});
