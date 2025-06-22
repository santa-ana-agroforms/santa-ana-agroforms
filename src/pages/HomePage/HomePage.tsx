// src/pages/HomePage.tsx
import React, { useState } from 'react'
import { Card, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Layout } from 'antd/lib'
import { AppHeader } from '@/components/AppHeader'
import { AppSidebar } from '@/components/AppSideBar'
import FormsLists from '@/features/forms-list'
import { titles } from './data'
import { Header } from 'antd/es/layout/layout'
import PhoneMockup from '@/features/create-forms'
import CreateForms from '@/features/create-forms'

const { Content, Sider } = Layout

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(prev => !prev);
  const [selectedKey, setSelected]  = useState<string>('1');

  // Estado para saber si estoy viendo el detalle “móvil” de un formulario
  const [activeFormId, setActiveFormId] = useState<number | null>(null)

  const title  = titles[selectedKey] || '';

  console.warn("selectedKey: ", selectedKey);

  return (
  <div className="h-screen w-screen bg-white">
    <Layout className="h-full w-full">

      <AppHeader collapsed={collapsed} onToggle={toggle} title={title} />

      {/* CONTENIDO PRINCIPAL: Sidebar + contenido */}
      <Layout className="h-full">
        {/* SIDEBAR */}
        <Sider
          trigger={null}
          collapsed={collapsed}
          width={260}
          className="bg-slate-900"
        >
          <AppSidebar
            navigate={navigate}
            collapsed={collapsed}
            selectedKey={selectedKey}
            onSelect={setSelected}
          />
        </Sider>

        {/* CONTENIDO */}
        <Content className="bg-white p-6 overflow-auto">
          {selectedKey === 'listado' && activeFormId === null && (
              // Paso el callback onSelectForm
              <FormsLists onSelectForm={setActiveFormId} />
            )}

            {activeFormId !== null && (
              <CreateForms
                formId={activeFormId}
                onBack={() => setActiveFormId(null)}
              />
            )}
        </Content>
      </Layout>
    </Layout>
  </div>
);

}
