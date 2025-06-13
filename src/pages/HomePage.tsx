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

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <Layout className='flex w-full'>
        <AppHeader collapsed={collapsed} onToggle={toggle}/>



        <Content>
          
          <AppSidebar  navigate={navigate} collapsed={collapsed}/>
       
          {/* aquí tu contenido */}
        </Content>
      </Layout>
    </div>
  )
}
