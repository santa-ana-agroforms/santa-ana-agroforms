// src/pages/HomePage.tsx
import React, { useCallback, useState } from 'react'
import { Card, Button, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Layout } from 'antd/lib'
import { AppHeader } from '@/components/AppHeader'
import { AppSidebar } from '@/components/AppSideBar'
import FormsLists from '@/features/forms-list'
import { titles } from './data'
import CreateForms from '@/features/create-forms'
import FlatTable, { ItemType } from '@/components/DeviceTables'
import { devices } from '@/features/devices-list/data'
import DevicesTable from '@/components/DeviceTables'
import DevicesList from '@/features/devices-list'
import UserList from '@/features/users-list'

const { Content, Sider } = Layout

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(prev => !prev);
  const [selectedKey, setSelected]  = useState<string>('1');

  // Estado para saber si estoy viendo el detalle “móvil” de un formulario
  const [activeFormId, setActiveFormId] = useState<number | null>(null)
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [search, setSearch] = useState('');

  const title  = titles[selectedKey] || '';

  console.warn("selectedKey: ", selectedKey);

  // 1) filtrar globalmente si quieres
  const dataToShow = devices.filter(item =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 2) manejar cambio de tabla (filtros / orden)
  const handleTableChange: TableProps<ItemType>['onChange'] = (
    _pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // 3) callbacks de acción
  const handleEdit = useCallback((rec: ItemType) => {
    console.log('Editar', rec);
  }, []);

  const handleDelete = useCallback((rec: ItemType) => {
    console.log('Borrar', rec);
  }, []);

  const handleIdClick = useCallback((id: string) => {
    console.log('Ir a detalle de', id);
  }, []);

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
            {selectedKey === 'terminales' && activeFormId === null && (
              <DevicesList/>
            )}
            {selectedKey === 'usuarios' && activeFormId === null && (
              <UserList />
            )}

        </Content>
      </Layout>
    </Layout>
  </div>
);

}
