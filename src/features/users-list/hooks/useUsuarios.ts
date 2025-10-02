// src/hooks/useUsuarios.ts
import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Usuario } from "../services/types";
import { getUsuarios } from "../services/usuarios-services";

export function useUsuarios() {
  const query = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: ({ signal }) => getUsuarios({ signal }),
    staleTime: 60_000,
  });

  const qc = useQueryClient();

  useEffect(() => {
    if (query.data) {
      query.data.forEach((u) =>
        qc.setQueryData(["usuario", u.nombre_usuario], u)
      );
    }
  }, [query.data, qc]);

  return query;
}
