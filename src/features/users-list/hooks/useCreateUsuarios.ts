// src/hooks/useCreateUsuario.ts
import { useCallback, useState } from "react";

import { CreateUsuarioPayload, UsuarioResponse } from "../services/types";
import { createUsuario } from "../services/usuarios-services";

export function useCreateUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UsuarioResponse | null>(null);

  const create = useCallback(async (payload: CreateUsuarioPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUsuario(payload);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, data, loading, error };
}
