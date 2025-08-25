// services/forms.service.ts
import axios from "axios";

import { FormularioAPI } from "./types";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "https://unexpected-janine-uvg-9d84ed75.koyeb.app",
  // headers: { Authorization: `Bearer ${token}` } // si aplica
});

export interface Formulario {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CreateFormularioDto {
  id?: number;
  nombre: string;
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

export async function getFormularios(options?: {
  signal?: AbortSignal;
}): Promise<FormularioAPI[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/formularios/`,
    {
      headers: { Accept: "application/json" },
      signal: options?.signal,
    }
  );
  if (!res.ok) throw new Error("Error al obtener formularios");
  return res.json();
}

export async function createFormulario(
  payload: CreateFormularioDto,
  opts?: { signal?: AbortSignal }
): Promise<Formulario> {
  const csrf = getCookie?.("csrftoken"); // si tienes el helper en el mismo archivo

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/formularios/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(csrf ? { "X-CSRFToken": csrf } : {}),
      },
      body: JSON.stringify(payload),
      signal: opts?.signal,
      // credentials: "include", // descomenta si usas cookies/sesión
    }
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Error al crear formulario");
  }

  return res.json();
}

export async function getFormularioById(
  id: string,
  opts?: { signal?: AbortSignal }
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/formularios/${id}/`,
    { signal: opts?.signal }
  );
  if (!res.ok) throw new Error("No se pudo cargar el formulario");
  return res.json();
}

export async function deleteFormulario(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const csrf = getCookie("csrftoken");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/formularios/${id}/`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(csrf ? { "X-CSRFToken": csrf } : {}),
      },
      signal: opts?.signal,
    }
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Error al eliminar formulario");
  }
}
