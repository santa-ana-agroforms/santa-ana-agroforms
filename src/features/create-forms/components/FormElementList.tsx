// src/components/FormElementsList.tsx
import React, { useState } from "react";

import {
  BarChartOutlined,
  BarcodeOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FontSizeOutlined,
  FormOutlined,
  LineChartOutlined,
  MailOutlined,
  MenuOutlined,
  PictureOutlined,
  SketchOutlined,
  SlidersOutlined,
  SwitcherOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";

import EditFieldModal, { FieldFormValues, VariantType } from "./EditFieldModal";

interface FormElementsListProps {
  onSelect: (key: string) => void;
}

const items = [
  { key: "texto", icon: <FontSizeOutlined />, label: "Texto" },
  { key: "dato", icon: <DatabaseOutlined />, label: "Dato" },
  { key: "niveles", icon: <SlidersOutlined />, label: "Niveles" },
  { key: "switch", icon: <SwitcherOutlined />, label: "Switch" },
  { key: "fecha", icon: <CalendarOutlined />, label: "Fecha" },
  { key: "hora", icon: <ClockCircleOutlined />, label: "Hora" },
  { key: "combo", icon: <UnorderedListOutlined />, label: "Combo" },
  { key: "multicombo", icon: <MenuOutlined />, label: "MultiCombo" },
  { key: "barra", icon: <BarChartOutlined />, label: "Barra" },
  {
    key: "completadoAuto",
    icon: <CheckCircleOutlined />,
    label: "Completado Auto",
  },
  { key: "linea", icon: <LineChartOutlined />, label: "Linea" },
  { key: "firma", icon: <EditOutlined />, label: "Firma" },
  { key: "fotos", icon: <PictureOutlined />, label: "Fotos" },
  { key: "codigoBarra", icon: <BarcodeOutlined />, label: "CodigoBarra" },
  { key: "email", icon: <MailOutlined />, label: "Email" },
  { key: "dibujo", icon: <SketchOutlined />, label: "Dibujo" },
  { key: "calc", icon: <CalculatorOutlined />, label: "Calc" },
  { key: "grupo", icon: <TeamOutlined />, label: "Grupo" },
  { key: "datoFormulario", icon: <FormOutlined />, label: "Dato Formulario" },
  {
    key: "geoLocalizacion",
    icon: <EnvironmentOutlined />,
    label: "Geo Localización",
  },
];

const opciones = ["Decimal", "Entero", "Texto"];
const grupos = ["Grupo A", "Grupo B", "Otro"];

const FormElementsList: React.FC<FormElementsListProps> = ({ onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<VariantType>();
  const [fieldData, setFieldData] = useState<Partial<FieldFormValues>>({});

  // Cuando el usuario hace click en un item, guardamos la key y abrimos modal
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    setSelectedKey(key as VariantType);

    // aquí podrías hacer setFieldData(...) con datos por defecto según el tipo
    setVisible(true);
  };

  const handleSave = (vals: FieldFormValues) => {
    console.log("Guardado:", vals);
    if (selectedKey) {
      onSelect(selectedKey);
    }
    setVisible(false);
  };

  return (
    <>
      <Menu
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        //onClick={e => onSelect(e.key)}
        onClick={handleMenuClick}
        items={items}
      />
      <EditFieldModal
        visible={visible}
        initialValues={fieldData}
        variant={selectedKey}
        opcionesList={opciones}
        gruposList={grupos}
        onSave={handleSave}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default FormElementsList;
