// src/components/AppSidebar.tsx
import React from "react";
import { NavigateFunction } from "react-router-dom";

import {
  BarChartOutlined,
  CloudDownloadOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
  FormOutlined,
  KeyOutlined,
  MobileOutlined,
  PoweroffOutlined,
  QuestionOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu } from "antd";

const { Sider } = Layout;

interface AppSideBarProps {
  navigate: NavigateFunction;
  collapsed: boolean;
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const AppSidebar: React.FC<AppSideBarProps> = ({
  navigate,
  collapsed,
  selectedKey,
  onSelect,
}) => (
  <Sider
    trigger={null}
    collapsible
    collapsed={collapsed}
    theme="dark"
    className="h-full"
    width={260}
  >
    <div className="logo p-4 flex flex-row items-center justify-self-start w-full text-white">
      {/* Avatar */}
      <Avatar size={45} icon={<UserOutlined />} />

      {/* Info de usuario junto al avatar */}
      {!collapsed && (
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
      )}
    </div>

    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => onSelect(key)}
      items={[
        {
          key: "1",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "2",
          icon: <TableOutlined />,
          label: "Formularios",
          children: [
            { key: "listado", icon: <FormOutlined />, label: "Listado" },
            {
              key: "datos",
              icon: <DatabaseOutlined />,
              label: "Fuentes de Datos",
            },
            // {
            //   key: "formularios",
            //   icon: <AuditOutlined />,
            //   label: "Asignación de Formularios",
            // },
            // {
            //   key: "proceso",
            //   icon: <ThunderboltOutlined />,
            //   label: "Asignaciones en proceso",
            // },
            // {
            //   key: "aprobacion",
            //   icon: <UserAddOutlined />,
            //   label: "Rutas de Aprobación",
            // },
            {
              key: "exportacion",
              icon: <CloudDownloadOutlined />,
              label: "Procesos de Exportación",
            },
            {
              key: "excel",
              icon: <FileExcelOutlined />,
              label: "Crear desde Excel",
            },
          ],
        },
        {
          key: "sub2",
          icon: <BarChartOutlined />,
          label: "Reportes",
          children: [
            { key: "3", label: "Resultados en Excel" },
            { key: "4", label: "Ver WebDashboard" },
          ],
        },
        {
          key: "5",
          icon: <QuestionOutlined />,
          label: "Ayuda",
        },
        {
          key: "6",
          icon: <KeyOutlined />,
          label: "Sesión",
          children: [
            {
              key: "terminales",
              icon: <MobileOutlined />,
              label: "Terminales",
            },
            { key: "usuarios", icon: <TeamOutlined />, label: "Usuarios" },
          ],
        },
        {
          key: "7",
          icon: <PoweroffOutlined />,
          label: "Cerrar sesión",
          onClick: () => navigate("/"),
        },
      ]}
    />
  </Sider>
);
