import { api } from "@/features/user-autentication/services/auth.service";

export interface EntryItem {
  form_id: string;
  form_name: string;
  respuestas: number;
}

/**
 * Obtiene la lista de formularios (meta)
 */
export async function getEntries(opts?: {
  signal?: AbortSignal;
}): Promise<EntryItem[]> {
  const res = await api.get<EntryItem[]>("/api/entries/", {
    signal: opts?.signal,
  });

  return res.data;
}
