// src/pages/HomePage.tsx
import React, { useState } from 'react'
import { Card, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Layout } from 'antd/lib'
import { AppHeader } from '@/components/AppHeader'
import { AppSidebar } from '@/components/AppSideBar'

const { Content, Sider } = Layout

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(prev => !prev);
  const [selectedKey, setSelected]  = useState<string>('1');

  // Mapeo de keys de menú a títulos
  const titles: Record<string,string> = {
    '1': 'Dashboard',
    '2': 'Formularios',
    '3': 'Resultados en Excel',
    '4': 'Ver WebDashboard',
    '5': 'Ayuda',
    '6': 'Sesión',
    '7': 'Cerrar sesión',
    'listado': "Listado de Formularios",
    'datos': "Fuentes de Datos",
    'formularios': "Asignación de Formularios",
    'proceso': "Asignaciones en proceso",
    'aprobacion': "Rutas de Aprobación",  
    'exportacion': "Procesos de Exportación",
    'excel': "Crear desde Excel",
  };

  const title  = titles[selectedKey] || '';

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <Layout className='flex w-full'>
        <AppHeader collapsed={collapsed} onToggle={toggle} title={title}/>



        <Content>
          
          <AppSidebar  navigate={navigate} collapsed={collapsed} selectedKey={selectedKey} onSelect={setSelected}/>
       
          {/* aquí tu contenido */}
        </Content>
      </Layout>
    </div>
  )
}
