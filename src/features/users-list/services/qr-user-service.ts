import { QrStartResponse } from "./types";

export async function startQrForUser(
  nombre_usuario: string
): Promise<QrStartResponse> {
  const baseUrl = import.meta.env.VITE_API_MOBILE_URL;
  const apiKey = import.meta.env.VITE_API_MOBILE_KEY;

  const res = await fetch(`${baseUrl}/auth/qr/start-for-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ nombre_usuario }),
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<QrStartResponse>;
}
