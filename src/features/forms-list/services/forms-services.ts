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
  id: number;
  nombre: string;
  descripcion?: string;
}

export async function getFormularios(options?: {
  signal?: AbortSignal;
}): Promise<FormularioAPI[]> {
  const res = await fetch("/api/formularios/", {
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });
  if (!res.ok) throw new Error("Error al obtener formularios");
  return res.json();
}
