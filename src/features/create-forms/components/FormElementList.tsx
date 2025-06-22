// src/components/FormElementsList.tsx
import React from 'react'
import { Menu } from 'antd'
import {
  FontSizeOutlined,
  DatabaseOutlined,
  SlidersOutlined,
  SwitcherOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  EditOutlined,
  PictureOutlined,
  BarcodeOutlined,
  MailOutlined,
  SketchOutlined,
  CalculatorOutlined,
  TeamOutlined,
  FormOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

interface FormElementsListProps {
  onSelect: (key: string) => void
}

const items = [
  { key: 'texto',            icon: <FontSizeOutlined />,      label: 'Texto' },
  { key: 'dato',             icon: <DatabaseOutlined />,      label: 'Dato' },
  { key: 'niveles',          icon: <SlidersOutlined />,       label: 'Niveles' },
  { key: 'switch',           icon: <SwitcherOutlined />,      label: 'Switch' },
  { key: 'fecha',            icon: <CalendarOutlined />,      label: 'Fecha' },
  { key: 'hora',             icon: <ClockCircleOutlined />,   label: 'Hora' },
  { key: 'combo',            icon: <UnorderedListOutlined />, label: 'Combo' },
  { key: 'multicombo',       icon: <MenuOutlined />,          label: 'MultiCombo' },
  { key: 'barra',            icon: <BarChartOutlined />,      label: 'Barra' },
  { key: 'completadoAuto',   icon: <CheckCircleOutlined />,   label: 'Completado Auto' },
  { key: 'linea',            icon: <LineChartOutlined />,     label: 'Linea' },
  { key: 'firma',            icon: <EditOutlined />,          label: 'Firma' },
  { key: 'fotos',            icon: <PictureOutlined />,       label: 'Fotos' },
  { key: 'codigoBarra',      icon: <BarcodeOutlined />,       label: 'CodigoBarra' },
  { key: 'email',            icon: <MailOutlined />,          label: 'Email' },
  { key: 'dibujo',           icon: <SketchOutlined />,        label: 'Dibujo' },
  { key: 'calc',             icon: <CalculatorOutlined />,    label: 'Calc' },
  { key: 'grupo',            icon: <TeamOutlined />,          label: 'Grupo' },
  { key: 'datoFormulario',   icon: <FormOutlined />,          label: 'Dato Formulario' },
  { key: 'geoLocalizacion',  icon: <EnvironmentOutlined />,  label: 'Geo Localización' },
]

const FormElementsList: React.FC<FormElementsListProps> = ({ onSelect }) => (
  <Menu
    mode="inline"
    style={{ height: '100%', borderRight: 0 }}
    onClick={e => onSelect(e.key)}
  >
    {items.map(item => (
      <Menu.Item key={item.key} icon={item.icon}>
        {item.label}
      </Menu.Item>
    ))}
  </Menu>
)

export default FormElementsList
