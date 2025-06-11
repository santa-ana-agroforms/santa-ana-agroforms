// src/pages/HomePage.tsx
import React from 'react'
import { Card, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <div className="w-full h-16 bg-[#92D050]" >
        <p>Pene xD</p>
      </div>

      <div className='flex-1 flex items-center justify-center bg-amber-950'>
      <Card title="Bienvenido" className="w-72 bg-amber-950">
        <p className='Open-Sans'>¡Ya estás logueado!</p>
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
    </div>
  )
}
