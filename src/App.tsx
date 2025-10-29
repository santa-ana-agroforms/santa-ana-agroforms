// src/App.tsx
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./pages/AuthContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta de login */}
          <Route path="/" element={<LoginPage />} />

          {/* Ruta de home (dashboard, por ejemplo) */}
          <Route path="/home" element={<HomePage />} />
          {/* Cualquier otra ruta que quieras añadir */}
          {/* <Route path="/perfil" element={<ProfilePage />} /> */}

          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Si la URL no coincide con ninguna ruta, redirige a "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
