// src/create-forms/services/campos.service.ts
import { FieldJson } from "../types";

const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8084"; // ← según tu log

export type CampoAPI = FieldJson;

/** Convierte undefined → null para evitar rechazos del serializer */
function sanitize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_k, v) => (v === undefined ? null : v))
  );
}

async function readError(res: Response) {
  try {
    const data = await res.clone().json();
    return JSON.stringify(data);
  } catch {}
  try {
    return await res.clone().text();
  } catch {}
  return res.statusText;
}

/** POST de un (1) campo: body = {tipo, clase, nombre_campo, etiqueta, ...} */
export async function postCampoActualSingle(
  pageId: string,
  campo: CampoAPI,
  opts?: { signal?: AbortSignal }
) {
  if (!pageId) throw new Error("pageId es requerido");

  const url = `${BASE}/api/paginas/${pageId}/campos/`;

  console.warn("Fetch páginas URL:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sanitize(campo)), // 👈 objeto, NO array, NO wrapper
    signal: opts?.signal,
  });

  if (!res.ok) {
    const detail = await readError(res);
    throw new Error(`Error al enviar campo (${res.status}): ${detail}`);
  }

  return res.json().catch(() => null);
}

/** Helper para enviar una lista secuencialmente (con reporte de errores) */
export async function postCamposActualBatch(
  pageId: string,
  campos: CampoAPI[],
  opts?: { signal?: AbortSignal }
) {
  const ok: unknown[] = [];
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < campos.length; i++) {
    try {
      const r = await postCampoActualSingle(pageId, campos[i], opts);
      ok.push(r);
    } catch (e) {
      errors.push({
        index: i,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return { ok, errors };
}
