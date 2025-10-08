// src/services/auth.service.ts
import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8081/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si obtenemos 401 y no hemos reintentado todavía
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const data = await refreshToken(refresh);
          localStorage.setItem("access_token", data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest); // reintenta la petición original
        } catch (err) {
          console.error("Error al refrescar token:", err);
          localStorage.clear();
          window.location.href = "/"; // redirige al login
        }
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginDto {
  nombre_usuario: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user: {
    nombre_usuario: string;
    nombre: string;
    correo: string;
    acceso_web: boolean;
  };
}

export async function loginUser(payload: LoginDto): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/api/auth/login/", payload);
    return res.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      "Error al iniciar sesión";
    throw new Error(msg);
  }
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/api/auth/refresh/", {
      refresh_token: refreshToken,
    });
    return res.data;
  } catch (error: any) {
    throw new Error("Error al refrescar el token");
  }
}
