import {
  CreateUsuarioPayload,
  UpdateUsuarioPayload,
  Usuario,
  UsuarioResponse,
} from "./types";

export async function getUsuarios(options?: {
  signal?: AbortSignal;
}): Promise<Usuario[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/usuarios/`,
    {
      headers: { Accept: "application/json" },
      signal: options?.signal,
    }
  );
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function createUsuario(
  payload: CreateUsuarioPayload
): Promise<UsuarioResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/usuarios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function deleteUsuario(nombreUsuario: string): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(
    `${baseUrl}/api/usuarios/${encodeURIComponent(nombreUsuario)}/`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }
}

export async function updateUsuarioPatch(
  nombreUsuario: string,
  payload: Partial<UpdateUsuarioPayload>
): Promise<UsuarioResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/usuarios/${nombreUsuario}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}
