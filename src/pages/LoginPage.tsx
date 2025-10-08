// src/pages/LoginPage.tsx
import { useLogin } from '@/features/user-autentication/hooks/useAuth'
import { message } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import SantaAna from '../assets/Santa-Ana.jpg'
import { LoginCard } from '../components/LoginCard'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { mutateAsync: login } = useLogin();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      // Llamamos el hook (usa tu endpoint POST /api/auth/login/)
      const data = await login({
        nombre_usuario: values.username,
        password: values.password,
      });

      if (data?.ok) {
        message.success(`Bienvenido ${data.user.nombre}`);
        navigate("/home");
      } else {
        message.error("Usuario o contraseña incorrectos");
        console.warn("Error de login:", data);
      }
    } catch (error: any) {
      console.warn("Error de autenticación:", error);
      message.error("Usuario o contraseña incorrectos");
    }
  };

  return (
   <div
      className="relative h-screen w-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${SantaAna})` }}
    >

      {/* contenedor del formulario */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <LoginCard onFinish={handleLogin} />
      </div>
    </div>
  )
}
