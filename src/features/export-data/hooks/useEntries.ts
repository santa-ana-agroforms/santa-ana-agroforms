import { useQuery } from "@tanstack/react-query";

import { getEntries, type EntryItem } from "../services/entries.services";

/**
 * Hook para obtener los formularios (entries)
 */
export function useEntries() {
  return useQuery<EntryItem[], Error>({
    queryKey: ["entries", "list"],
    queryFn: ({ signal }) => getEntries({ signal }),
  });
}
