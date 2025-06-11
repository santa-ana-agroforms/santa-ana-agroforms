// src/pages/LoginPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginCard } from '../components/LoginCard'
import SantaAna from '../assets/Santa-Ana.jpg'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Login datos:', values)
    // aquí tu llamada real al API…
    const fakeOk = true
    if (fakeOk) navigate('/home')
  }

  return (
   <div
      className="relative h-screen w-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${SantaAna})` }}
    >

      {/* contenedor del formulario */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <LoginCard onFinish={onFinish} />
      </div>
    </div>
  )
}
