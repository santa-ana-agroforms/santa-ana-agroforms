// src/hooks/useRoles.ts
import { useCallback, useEffect, useState } from "react";

import { fetchRoles } from "../services/roles-service";
import { Rol } from "../services/types";

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles(); // carga automática al montar
  }, [loadRoles]);

  return { roles, loading, error, reload: loadRoles };
}
