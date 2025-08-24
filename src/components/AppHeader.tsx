// src/components/AppHeader.tsx
import React from "react";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";

import logo from "@/assets/Santa-Ana-logo.png";

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  collapsed,
  onToggle,
  title,
}) => (
  <Header className="flex items-center !bg-[#5BC500] px-6">
    <div className="flex items-center flex-row gap-4">
      {/* Logo a la izquierda */}
      <img src={logo} alt="Mi Logo" className="h-15" />

      {/* Título */}
      <span className="font-sans text-white text-lg font-medium">
        Santa Ana AgroForms
      </span>

      <Button
        type="text"
        onClick={onToggle}
        className="flex items-center w-2.5 bg-[#FFED00]"
      >
        {collapsed ?
          <MenuUnfoldOutlined />
        : <MenuFoldOutlined />}
      </Button>

      {/* Título */}
      <span className="font-sans text-white text-lg font-medium">
        {title || "Santa Ana AgroForms"}
      </span>
    </div>
  </Header>
);
