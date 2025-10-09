// src/services/auth.service.ts
import axios from "axios";

// ✅ Instancia global
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8081/api",
});

// ✅ Interceptor de request — agrega token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor de respuesta — refresca token si vence
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8081/api"}/auth/refresh/`,
            { refresh_token: refresh }
          );
          localStorage.setItem("access_token", data.access_token);
          api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest); // reintenta
        } catch (err) {
          console.error("Error al refrescar token:", err);
          localStorage.clear();
          window.location.href = "/";
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
  const { data } = await api.post<AuthResponse>("/api/auth/login/", payload);
  return data;
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(
    `${import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8081/api"}/auth/refresh/`,
    { refresh_token: refreshToken }
  );
  return data;
}
