// src/services/usuarios.service.ts
import { api } from "@/features/user-autentication/services/auth.service";
import type { AxiosRequestConfig } from "axios";
import {
  CreateUsuarioPayload,
  UpdateUsuarioPayload,
  Usuario,
  UsuarioResponse,
} from "./types";

// Helper para pasar signal a axios cuando exista
const withSignal = (signal?: AbortSignal): AxiosRequestConfig => (signal ? { signal } : {});

export async function getUsuarios(options?: {
  signal?: AbortSignal;
}): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>("/api/usuarios/", withSignal(options?.signal));
  return data;
}

export async function createUsuario(
  payload: CreateUsuarioPayload
): Promise<UsuarioResponse> {
  const { data } = await api.post<UsuarioResponse>("/api/usuarios/", payload);
  return data;
}

export async function deleteUsuario(nombreUsuario: string): Promise<void> {
  await api.delete<void>(`/api/usuarios/${encodeURIComponent(nombreUsuario)}/`);
}

export async function updateUsuarioPatch(
  nombreUsuario: string,
  payload: Partial<UpdateUsuarioPayload>
): Promise<UsuarioResponse> {
  const { data } = await api.patch<UsuarioResponse>(
    `/api/usuarios/${encodeURIComponent(nombreUsuario)}/`,
    payload
  );
  return data;
}
