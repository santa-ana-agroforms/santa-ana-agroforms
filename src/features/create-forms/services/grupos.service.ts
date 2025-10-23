import { api } from "@/features/user-autentication/services/auth.service";

export interface GrupoAPI {
  id_grupo: string;
  resource: string;
  id_campo_group: string;
  nombre: string;
}

// ----------------------
// API Calls usando axios `api`
// ----------------------

/**
 * Obtener grupo por id_campo_group
 * GET /api/grupos/campo/{id_campo_group}/
 */
export async function getGrupoByIdCampoGroup(
  id_campo_group: string,
  opts?: { signal?: AbortSignal }
): Promise<GrupoAPI> {
  const res = await api.get<GrupoAPI>(`/api/grupos/campo/${id_campo_group}/`, {
    signal: opts?.signal,
  });

  return res.data;
}
