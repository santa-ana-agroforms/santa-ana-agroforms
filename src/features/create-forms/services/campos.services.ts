// src/create-forms/services/campos.service.ts
import type { AxiosError } from "axios";

import { api } from "@/features/user-autentication/services/auth.service";

import { FieldJson } from "../types";
import { getGrupoByIdCampoGroup } from "./grupos.service";

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
export async function postCamposSecuenciales(
  pageId: string,
  campos: CampoAPI[]
) {
  const gruposMap: Record<string, { id: string; nombre: string }> = {}; // { nombreTemporal: id_campoReal }
  const ok: any[] = [];
  const errors: any[] = [];
  let grupoId = "";

  // Función auxiliar con reintentos
  async function fetchGrupoWithRetry(
    idCampoGroup: string,
    maxRetries = 5,
    delay = 300
  ) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const grupo = await getGrupoByIdCampoGroup(idCampoGroup);
        return grupo;
      } catch (e) {
        if (i === maxRetries - 1) throw e;
        console.warn(`Reintentando obtener grupo (${i + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error(
      `No se pudo obtener grupo con id_campo_group=${idCampoGroup}`
    );
  }

  try {
    // 🟩 Paso 1: crear primero los grupos
    // console.warn("grupos: ", campos);
    const grupos = campos.filter((c) => c.clase === "group");
    for (const grupo of grupos) {
      try {
        const res = await postCampoActualSingle(pageId, grupo);
        ok.push(res);
        const idCampoGroup = res.id_campo;
        // console.warn(
        //   `✅ Grupo creado: ${grupo.nombre_campo} (id_campo=${idCampoGroup})`
        // );

        // Obtener el id_grupo con reintento
        const grupoData = await fetchGrupoWithRetry(idCampoGroup);
        const idGrupoReal = grupoData.id_grupo;

        gruposMap[grupo.nombre_campo] = {
          id: idGrupoReal,
          nombre: grupoData.nombre,
        };
        grupoId = grupo.nombre_campo;
        console.warn(`✅ id_grupo asignado: ${idGrupoReal}`);
      } catch (err) {
        console.error("Error creando grupo:", grupo.nombre_campo, err);
        errors.push({ campo: grupo.nombre_campo, err });
      }
    }

    // 🟦 Paso 2: crear los campos hijos (no grupos)
    const hijos = campos.filter((c) => c.clase !== "group");
    for (const hijo of hijos) {
      try {
        // console.warn("gruposMap: ", gruposMap);
        // console.warn("Creando hijo (antes de grupo):", hijo, grupoId);
        // Si tiene grupoTemporal, buscar su id real
        if (hijo.grupoTemporal) {
          const grupoInfo = gruposMap[grupoId];
          if (grupoInfo) {
            hijo.grupo = grupoInfo.id;
            delete hijo.grupoTemporal;

            // 🔧 Aquí agregas tu config
            hijo.config = {
              id_group: grupoInfo.id,
              name: grupoInfo.nombre,
            };

            console.warn(
              `Asignado id_grupo=${hijo.grupo} (nombre=${grupoInfo.nombre}) a hijo ${hijo.nombre_campo}`
            );
          } else {
            console.warn(`⚠ No se encontró grupoInfo para ${grupoId}`);
          }
        }

        const res = await postCampoActualSingle(pageId, hijo);
        ok.push(res);
      } catch (err) {
        console.error("Error creando campo:", hijo.nombre_campo, err);
        errors.push({ campo: hijo.nombre_campo, err });
      }
    }
  } catch (e) {
    console.error("Error general:", e);
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

/** DELETE de un (1) campo existente */
export async function deleteCampoActualSingle(
  campoId: string,
  opts?: { signal?: AbortSignal }
) {
  if (!campoId) throw new Error("campoId es requerido");

  const url = `/api/campos/${campoId}/`;

  try {
    const res = await api.delete(url, {
      signal: opts?.signal,
    });

    // El endpoint devuelve 204 No Content → sin body
    if (res.status === 204) return { success: true };

    return res?.data ?? { success: true };
  } catch (e) {
    const { status, detail } = extractAxiosError(e);
    throw new Error(
      `Error al eliminar campo (${status ?? "sin status"}): ${detail}`
    );
  }
}
