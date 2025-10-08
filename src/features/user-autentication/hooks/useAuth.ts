// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { AuthResponse, LoginDto, loginUser, refreshToken } from "../services/auth.service";

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: (payload) => loginUser(payload),
    onSuccess: (data) => {
      // Guarda tokens y usuario en localStorage (o cookies, según tu diseño)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (err) => {
      console.error("Error de login:", err);
    },
  });
}

export function useRefreshToken() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: (refresh) => refreshToken(refresh),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
    },
  });
}
