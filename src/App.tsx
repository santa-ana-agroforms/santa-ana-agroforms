// src/App.tsx
<<<<<<< HEAD
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './pages/AuthContext'
import { HomePage } from './pages/HomePage/HomePage'
import { LoginPage } from './pages/LoginPage'
=======
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage";
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta de login */}
          <Route path="/" element={<LoginPage />} />

          {/* Ruta de home (dashboard, por ejemplo) */}
          <Route path="/home" element={<HomePage />} />

<<<<<<< HEAD
          {/* Cualquier otra ruta que quieras añadir */}
          {/* <Route path="/perfil" element={<ProfilePage />} /> */}
          
          {/* Si la URL no coincide con ninguna ruta, redirige a "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
=======
        {/* Cualquier otra ruta que quieras añadir */}
        {/* <Route path="/perfil" element={<ProfilePage />} /> */}

        {/* Si la URL no coincide con ninguna ruta, redirige a "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466

export default App;
