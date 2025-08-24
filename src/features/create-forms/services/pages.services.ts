// src/create-forms/services/pages.service.ts
export interface CreatePaginaDto {
  /** Si false, NO crea nueva versión; default true */
  bump?: boolean;
  sequence: number;
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

const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8081";

export async function createPagina(
  formId: string,
  dto: CreatePaginaDto,
  opts?: { signal?: AbortSignal }
): Promise<AgregarPaginaResponse> {
  const bumpParam = dto.bump === false ? "0" : "1";

  const body = {
    secuencia: dto.sequence,
    nombre: dto.title,
    descripcion: dto.description,
    //color_fondo: normalizeHex(dto.bgColor),
    //color_texto: normalizeHex(dto.textColor),
  };

  // Usa URL absoluta (evita 404 si no hay proxy). Incluye trailing slash.
  const url = `${BASE}/api/formularios/${formId}/agregar-pagina/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: opts?.signal,
    // Si usas sesión/CSRF de Django:
    // credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Error al crear página (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json();
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

export async function getPaginas(opts?: {
  signal?: AbortSignal;
  formId?: string; // <-- filtro opcional
}): Promise<PaginaAPI[]> {
  // Si el backend acepta querystring, lo usamos
  const qs = new URLSearchParams();
  if (opts?.formId) qs.set("formulario", opts.formId);

  const url = `${BASE}/api/paginas/${qs.toString() ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Error al obtener páginas (${res.status}): ${text || res.statusText}`
    );
  }

  const raw: PaginaListItemAPI[] = await res.json();

  // Red de seguridad: si el backend ignora el querystring, filtramos acá
  const filtered =
    opts?.formId ? raw.filter((p) => p.formulario === opts.formId) : raw;

  return filtered.map(normalizePagina);
}
