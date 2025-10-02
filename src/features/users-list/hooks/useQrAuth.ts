// src/hooks/useQrAuth.ts
import { useCallback, useState } from "react";

import { startQrForUser } from "../services/qr-user-service";
import { QrStartResponse } from "../services/types";

export function useQrAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QrStartResponse | null>(null);

  const startQr = useCallback(async (nombre_usuario: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await startQrForUser(nombre_usuario);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { startQr, data, loading, error, reset };
}
