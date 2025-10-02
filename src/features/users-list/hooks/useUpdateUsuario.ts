// src/hooks/useUpdateUsuario.ts
import { useCallback, useState } from "react";

import { UpdateUsuarioPayload, UsuarioResponse } from "../services/types";
import { updateUsuarioPatch } from "../services/usuarios-services";

export function useUpdateUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UsuarioResponse | null>(null);

  const update = useCallback(
    async (nombreUsuario: string, payload: Partial<UpdateUsuarioPayload>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateUsuarioPatch(nombreUsuario, payload);
        setData(response);
        return response;
      } catch (err: any) {
        setError(err.message ?? "Error desconocido");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, data, loading, error };
}
