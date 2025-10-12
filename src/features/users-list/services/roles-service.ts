import { Rol } from "./types";

export async function fetchRoles(): Promise<Rol[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/roles/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener roles: ${res.status}`);
  }

  return res.json();
}
