// src/pages/HomePage.tsx
import React from 'react'
import { Card, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-amber-900">
      <Card title="Bienvenido" className="w-72">
        <p>¡Ya estás logueado!</p>
        <Button
          type="primary"
          block
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Cerrar sesión
        </Button>
      </Card>
    </div>
  )
}
