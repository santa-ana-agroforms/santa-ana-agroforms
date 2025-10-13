// src/create-forms/services/campos.service.ts
import type { AxiosError } from "axios";

import { api } from "@/features/user-autentication/services/auth.service";

import { FieldJson } from "../types";

export type CampoAPI = FieldJson;

/** Convierte undefined → null para evitar rechazos del serializer */
function sanitize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_k, v) => (v === undefined ? null : v))
  );
}

function extractAxiosError(e: unknown) {
  const err = e as AxiosError<any>;
  const status = err?.response?.status;

  // 1) Si el backend devolvió JSON, lo serializamos
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    try {
      return { status, detail: JSON.stringify(data) };
    } catch {
      /* no-op */
    }
  }

  // 2) Si devolvió texto plano
  if (typeof data === "string" && data.trim()) {
    return { status, detail: data };
  }

  // 3) Fallback al message
  return { status, detail: err?.message ?? "Error desconocido" };
}

/** POST de un (1) campo: body = {tipo, clase, nombre_campo, etiqueta, ...} */
export async function postCampoActualSingle(
  pageId: string,
  campo: CampoAPI,
  opts?: { signal?: AbortSignal }
) {
  if (!pageId) throw new Error("pageId es requerido");

  const url = `/api/paginas/${pageId}/campos/`;

  try {
    const res = await api.post(url, sanitize(campo), {
      signal: opts?.signal,
      // axios setea headers JSON automáticamente; no hace falta sobrescribirlos
    });

    // Igual que antes: si no hay body o no es JSON, devolvemos null
    return res?.data ?? null;
  } catch (e) {
    const { status, detail } = extractAxiosError(e);
    throw new Error(
      `Error al enviar campo (${status ?? "sin status"}): ${detail}`
    );
  }
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

/** PATCH de un (1) campo existente: body = {nombre_campo, etiqueta, ...} */
export async function patchCampoActualSingle(
  campoId: string,
  campo: CampoAPI,
  opts?: { signal?: AbortSignal }
) {
  if (!campoId) throw new Error("campoId es requerido");

  const url = `/api/campos/${campoId}/`;

  try {
    const res = await api.patch(url, sanitize(campo), {
      signal: opts?.signal,
    });

    return res?.data ?? null;
  } catch (e) {
    const { status, detail } = extractAxiosError(e);
    throw new Error(
      `Error al actualizar campo (${status ?? "sin status"}): ${detail}`
    );
  }
}

/** PATCH batch secuencial de varios campos existentes */
export async function patchCamposActualBatch(
  _pageId: string, // opcional, se incluye por consistencia con el POST
  campos: CampoAPI[],
  opts?: { signal?: AbortSignal }
) {
  const ok: unknown[] = [];
  const errors: { index: number; message: string }[] = [];

  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const campoId = campo.id_campo?.toString();

    console.warn("todoOK: ", campo, campoId, opts);

    if (!campoId) {
      errors.push({
        index: i,
        message: "Campo sin id_campo (no se puede hacer PATCH)",
      });
      continue;
    }

    try {
      const r = await patchCampoActualSingle(campoId, campo, opts);
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
