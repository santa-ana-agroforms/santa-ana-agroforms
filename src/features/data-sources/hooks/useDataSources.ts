import { useQuery } from "@tanstack/react-query";

import {
  getFuentesDatos,
  type FuenteDatoAPI,
} from "../services/data-sources.services";

export function useFuentesDatos() {
  return useQuery<FuenteDatoAPI[], Error>({
    queryKey: ["fuentes-datos"],
    queryFn: ({ signal }) => getFuentesDatos({ signal }),
  });
}
