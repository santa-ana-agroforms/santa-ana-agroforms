// src/components/FormElementsList.tsx
import React from "react";

import {
  CalculatorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FieldNumberOutlined,
  FontSizeOutlined,
  MenuOutlined,
  SwitcherOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";

interface FormElementsListProps {
  onMenuClick: MenuProps["onClick"];
}

const items = [
  { key: "texto", icon: <FontSizeOutlined />, label: "Texto" },
  // { key: "dato", icon: <DatabaseOutlined />, label: "Dato" },
  { key: "numero", icon: <FieldNumberOutlined />, label: "Numero" },
  // { key: "niveles", icon: <SlidersOutlined />, label: "Niveles" },
  { key: "switch", icon: <SwitcherOutlined />, label: "Switch" },
  { key: "fecha", icon: <CalendarOutlined />, label: "Fecha" },
  { key: "hora", icon: <ClockCircleOutlined />, label: "Hora" },
  { key: "combo", icon: <UnorderedListOutlined />, label: "Combo" },
  {
    key: "dataset",
    icon: <MenuOutlined />,
    label: "DataSet",
  },
  // { key: "barra", icon: <BarChartOutlined />, label: "Barra" },
  // {
  //   key: "completadoAuto",
  //   icon: <CheckCircleOutlined />,
  //   label: "Completado Auto",
  // },
  // { key: "linea", icon: <LineChartOutlined />, label: "Linea" },
  { key: "firma", icon: <EditOutlined />, label: "Firma" },
  // { key: "fotos", icon: <PictureOutlined />, label: "Fotos" },
  // { key: "codigoBarra", icon: <BarcodeOutlined />, label: "CodigoBarra" },
  // { key: "email", icon: <MailOutlined />, label: "Email" },
  // { key: "dibujo", icon: <SketchOutlined />, label: "Dibujo" },
  { key: "calc", icon: <CalculatorOutlined />, label: "Calculado" },
  { key: "grupo", icon: <TeamOutlined />, label: "Grupo" },
  // { key: "datoFormulario", icon: <FormOutlined />, label: "Dato Formulario" },
  // {
  //   key: "geoLocalizacion",
  //   icon: <EnvironmentOutlined />,
  //   label: "Geo Localización",
  // },
];

const FormElementsList: React.FC<FormElementsListProps> = ({ onMenuClick }) => {
  return (
    <>
      <Menu
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        //onClick={e => onSelect(e.key)}
        onClick={onMenuClick}
        items={items}
      />
    </>
  );
};

export default FormElementsList;
