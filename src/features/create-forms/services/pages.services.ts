// src/create-forms/services/pages.service.ts

import { api } from "@/features/user-autentication/services/auth.service";

export interface CreatePaginaDto {
  /** Si false, NO crea nueva versión; default true */
  bump?: boolean;
  description: string;
  title: string;
}

export interface PaginaListItemAPI {
  id_pagina: string;
  secuencia: number;
  nombre: string;
  descripcion: string;
  index_version: string;
  formulario: string; // formularioId
}

export interface PaginaAPI {
  id: string;
  secuencia: number;
  nombre: string;
  descripcion: string;
  indexVersion?: string;
  formularioId?: string;
}

export interface AgregarPaginaResponse {
  detail: string;
  version: string;
  version_bumpeada: boolean;
  pagina: PaginaAPI;
}

export interface UpdatePaginaDto {
  title?: string;
  description?: string;
}

export interface UpdatePaginaResponse {
  detail?: string;
  pagina?: PaginaAPI;
}

// ----------------------
// Helpers
// ----------------------

function normalizeHex(col: string) {
  if (!col) return col;
  const hex = col.startsWith("#") ? col.slice(1) : col;
  if (hex.length === 3) {
    return hex
      .split("")
      .map((c) => c + c)
      .join("")
      .toUpperCase();
  }
  return hex.toUpperCase();
}

function normalizePagina(p: PaginaListItemAPI): PaginaAPI {
  return {
    id: p.id_pagina,
    secuencia: p.secuencia,
    nombre: p.nombre,
    descripcion: p.descripcion,
    indexVersion: p.index_version,
    formularioId: p.formulario,
  };
}

// ----------------------
// API Calls usando axios `api`
// ----------------------

// pages.service.ts
export async function createPagina(
  formId: string,
  dto: CreatePaginaDto,
  opts?: { signal?: AbortSignal }
): Promise<AgregarPaginaResponse> {
  const bumpParam = dto.bump === false ? "0" : "1";

  const body = {
    nombre: dto.title,
    descripcion: dto.description,
  };

  const res = await api.post(
    `/api/formularios/${formId}/agregar-pagina/?bump=${bumpParam}`,
    body,
    { signal: opts?.signal }
  );

  const d: any = res.data;
  // a) forma “completa”
  if (d?.pagina?.id) {
    return d as AgregarPaginaResponse;
  }

  // b) forma “plana”: { ok, id_pagina, ... }
  if (d?.id_pagina) {
    const pagina: PaginaAPI = {
      id: String(d.id_pagina),
      secuencia: Number(d.secuencia ?? 1),
      nombre: d.nombre ?? dto.title,
      descripcion: d.descripcion ?? dto.description,
      indexVersion: d.index_version,
      formularioId: d.formulario ?? formId,
    };
    return {
      detail: d.detail ?? "",
      version: d.version ?? "",
      version_bumpeada: Boolean(d.version_bumpeada),
      pagina,
    };
  }

  // c) forma inesperada → lanza
  throw new Error("Respuesta inesperada de crear página");
}

export async function getPaginas(opts?: {
  signal?: AbortSignal;
  formId?: string;
}): Promise<PaginaAPI[]> {
  const params = new URLSearchParams();
  if (opts?.formId) params.set("formulario", opts.formId);

  const res = await api.get<PaginaListItemAPI[]>(`/api/paginas/`, {
    params,
    signal: opts?.signal,
  });

  const raw = res.data;

  // Red de seguridad por si el backend ignora el filtro
  const filtered =
    opts?.formId ? raw.filter((p) => p.formulario === opts.formId) : raw;

  return filtered.map(normalizePagina);
}

/**
 * Actualiza una página existente (PATCH /api/paginas/{pageId}/)
 */
export async function patchPagina(
  pageId: string,
  dto: UpdatePaginaDto,
  opts?: { signal?: AbortSignal }
): Promise<UpdatePaginaResponse> {
  if (!pageId) throw new Error("pageId es requerido");

  const body = {
    nombre: dto.title,
    descripcion: dto.description,
  };

  const res = await api.patch(`/api/paginas/${pageId}/`, body, {
    signal: opts?.signal,
  });

  const data = res.data;

  // Formateamos la respuesta en un objeto coherente
  const pagina: PaginaAPI = {
    id: String(data.id_pagina ?? pageId),
    secuencia: Number(data.secuencia ?? 1),
    nombre: data.nombre ?? dto.title ?? "",
    descripcion: data.descripcion ?? dto.description ?? "",
    indexVersion: data.index_version,
    formularioId: data.formulario,
  };

  return {
    detail: data.detail ?? "Página actualizada correctamente",
    pagina,
  };
}

/**
 * DELETE de una (1) página existente
 * Endpoint: DELETE /api/paginas/{id_pagina}/
 */
export async function deletePagina(
  pageId: string,
  opts?: { signal?: AbortSignal }
): Promise<{ success: boolean }> {
  if (!pageId) throw new Error("pageId es requerido");

  const url = `/api/paginas/${pageId}/`;

  try {
    const res = await api.delete(url, { signal: opts?.signal });

    // El endpoint devuelve 204 → sin body
    if (res.status === 204) return { success: true };

    return res?.data ?? { success: true };
  } catch (error: any) {
    const status = error?.response?.status;
    const detail =
      error?.response?.data?.detail ||
      error?.message ||
      "Error desconocido al eliminar la página";

    throw new Error(
      `Error al eliminar página (${status ?? "sin status"}): ${detail}`
    );
  }
}
