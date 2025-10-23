// services/forms.service.ts

import { api } from "@/features/user-autentication/services/auth.service";

import {
  Categoria,
  CreateAsignacionDto,
  FormularioAPI,
  UpdateFormularioDto,
} from "./types";

// export const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_BASE_URL ??
//     "https://unexpected-janine-uvg-9d84ed75.koyeb.app",
//   // headers: { Authorization: `Bearer ${token}` } // si aplica
// });

export interface Formulario {
  id: number;
  nombre: string;
  descripcion?: string;
  formulario_id?: string;
  paginas: string[];
}

export interface CreateFormularioDto {
  id?: number;
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaDto {
  nombre?: string;
  descripcion?: string;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use((config) => {
  // Solo agrega CSRF en métodos que lo requieran
  const needsCsrf =
    config.method && ["post", "put", "patch", "delete"].includes(config.method);
  if (needsCsrf) {
    const token = getCookie("csrftoken");
    if (token) {
      config.headers.set("X-CSRFToken", token);
    }
  }
  return config;
});

export async function getFormularios() {
  const res = await api.get("/api/formularios-lite/");
  return res.data;
}

export async function createFormulario(
  payload: CreateFormularioDto,
  opts?: { signal?: AbortSignal }
): Promise<Formulario> {
  const res = await api.post<Formulario>("/api/formularios/", payload, {
    signal: opts?.signal,
  });
  return res.data;
}

export async function getFormularioById(
  id: string,
  opts?: { signal?: AbortSignal }
) {
  const res = await api.get<Formulario>(`/api/formularios/${id}/`, {
    signal: opts?.signal,
  });
  return res.data;
}

export async function deleteFormulario(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  await api.delete(`/api/formularios/${id}/`, {
    signal: opts?.signal,
  });
}

export async function duplicateFormulario(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<Formulario> {
  const res = await api.post<Formulario>(
    `/api/formularios/${id}/duplicar/`,
    {},
    { signal: opts?.signal }
  );
  return res.data;
}

/** Crea una asignación: un usuario → varios formularios */
export async function crearAsignacion(
  payload: CreateAsignacionDto,
  opts?: { signal?: AbortSignal }
) {
  const res = await api.post("/api/asignaciones/crear-asignacion/", payload, {
    signal: opts?.signal,
  });
  return res.data; // backend puede devolver {detail, ...} u otro shape
}

/**
 * Helper opcional:
 * Asignar los mismos formularios a múltiples usuarios.
 * Ejecuta una llamada por usuario y te devuelve un resumen.
 */
export async function crearAsignacionMultipleUsuarios(
  usuarios: string[],
  formularios: string[],
  opts?: { signal?: AbortSignal }
) {
  const results = await Promise.allSettled(
    usuarios.map((u) => crearAsignacion({ usuario: u, formularios }, opts))
  );

  const ok: { usuario: string; data: unknown }[] = [];
  const errors: { usuario: string; message: string }[] = [];

  results.forEach((r, i) => {
    const usuario = usuarios[i];
    if (r.status === "fulfilled") {
      ok.push({ usuario, data: r.value });
    } else {
      errors.push({
        usuario,
        message:
          r.reason instanceof Error ? r.reason.message : String(r.reason),
      });
    }
  });

  return { ok, errors };
}

/** Suspende un formulario específico por ID */
export async function suspendFormulario(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<Formulario> {
  const res = await api.post<Formulario>(
    `/api/formularios/${id}/suspender/`,
    {},
    { signal: opts?.signal }
  );
  return res.data;
}

/**
 * Actualiza un formulario existente vía PATCH
 */
export async function updateFormulario(
  id: string,
  payload: UpdateFormularioDto,
  opts?: { signal?: AbortSignal }
): Promise<FormularioAPI> {
  const res = await api.patch<FormularioAPI>(
    `/api/formularios/${id}/`,
    payload,
    { signal: opts?.signal }
  );
  return res.data;
}

/**
 * Elimina una categoría por su ID
 * @param id ID de la categoría
 */
export async function deleteCategoria(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  await api.delete(`/api/categorias/${id}/`, {
    signal: opts?.signal,
  });
}

/**
 * PATCH — Actualiza una categoría existente
 */
export async function updateCategoria(
  id: string | undefined,
  payload: UpdateCategoriaDto,
  opts?: { signal?: AbortSignal }
): Promise<Categoria> {
  const res = await api.patch<Categoria>(`/api/categorias/${id}/`, payload, {
    signal: opts?.signal,
  });
  return res.data;
}
