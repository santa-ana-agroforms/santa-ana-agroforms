// src/hooks/useAuth.ts
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { api, AuthResponse, LoginDto, loginUser, logoutUser, refreshToken } from "../services/auth.service";

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⚡ Línea clave: Axios usará el token correcto a partir de ahora
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
 
    },
  });
}

export function useRefreshToken() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
    // Limpia independientemente del resultado (por si el token ya no es válido)
    onSettled: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
      queryClient.clear();
    },
  });
}