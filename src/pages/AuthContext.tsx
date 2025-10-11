// src/features/user-autentication/context/AuthContext.tsx
import React from "react";

export interface AuthUser {
  nombre_usuario: string;
  nombre: string;
  email: string;
  activo: boolean;
  acceso_web?: boolean;
  // ... cualquier otro campo que te devuelva tu backend
}

interface AuthState {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("auth:user");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const setUserPersist = React.useCallback((u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem("auth:user", JSON.stringify(u));
      else localStorage.removeItem("auth:user");
    } catch {}
  }, []);

  const logout = React.useCallback(() => {
    setUserPersist(null);
    // si manejas token/cookies, también límpialos aquí
  }, [setUserPersist]);

  const value = React.useMemo(() => ({ user, setUser: setUserPersist, logout }), [user, setUserPersist, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

export function toAuthUser(u: any): AuthUser {
  return {
    nombre_usuario: String(u?.nombre_usuario ?? ""),
    nombre: String(u?.nombre ?? ""),
    email: String(u?.email ?? u?.correo ?? ""), // ← mapea correo → email
    activo: Boolean(u?.activo ?? true),        // ← default si no viene
    acceso_web: u?.acceso_web ?? undefined,
  };
}