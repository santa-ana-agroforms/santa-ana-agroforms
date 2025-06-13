// src/components/AppSidebar.tsx
import React from 'react'
import { Avatar, Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  TableOutlined,
  BarChartOutlined,
  QuestionOutlined,
  KeyOutlined,
  PoweroffOutlined,
  UserOutlined,
  // …tus íconos
} from '@ant-design/icons'
import { NavigateFunction } from 'react-router-dom'

const { Sider } = Layout

interface AppSideBarProps {
    navigate: NavigateFunction
    collapsed: boolean
}

export const AppSidebar: React.FC<AppSideBarProps> = ({ navigate, collapsed }) => (
  <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" className='h-full' width={260}>
    <div className="logo p-4 flex flex-row items-center justify-self-start w-full text-white">
        {/* Avatar */}
        <Avatar size={45} icon={<UserOutlined />} />

        {/* Info de usuario junto al avatar */}
        {!collapsed && 
        <div className="flex flex-col ml-4">
            {/* Rol */}
            <span className="text-xl font-bold">Administrador</span>

            {/* Estado online */}
            <div className="flex items-center mt-1">
            {/* Puntito verde */}
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span className="text-sm">Online</span>
            </div>
        </div>
        }
        
    </div>

    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        Dashboard
      </Menu.Item>

      <Menu.Item key="2" icon={<TableOutlined />}>
        Formularios
      </Menu.Item>
      
      <Menu.SubMenu key="sub1" icon={<BarChartOutlined />} title="Reportes">
        <Menu.Item key="3">Resultados en Excel</Menu.Item>
        <Menu.Item key="4">Ver WebDashboard</Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="5" icon={<QuestionOutlined />}>
        Ayuda
      </Menu.Item>

      <Menu.Item key="6" icon={<KeyOutlined />}>
        Sesión
      </Menu.Item>

      <Menu.Item key="7" icon={<PoweroffOutlined />}  onClick={() => navigate('/')}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  </Sider>
)
