// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage/HomePage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route path="/" element={<LoginPage />} />

        {/* Ruta de home (dashboard, por ejemplo) */}
        <Route path="/home" element={<HomePage />} />

        {/* Cualquier otra ruta que quieras añadir */}
        {/* <Route path="/perfil" element={<ProfilePage />} /> */}
        
        {/* Si la URL no coincide con ninguna ruta, redirige a "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
