// src/pages/LoginPage.tsx
import React from 'react'
import { Card, Form, Input, Button } from 'antd'
import type { FormInstance } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LoginCard } from '../components/LoginCard'

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<FormInstance>()
  const navigate = useNavigate()

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Datos de login:', values)
    // Aquí iría tu llamada al API de autenticación…
    const fakeLoginOk = true
    if (fakeLoginOk) {
      // Si el login es exitoso, navegamos a /home
      navigate('/home')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <LoginCard onFinish={onFinish} />
    </div>
  )
}
