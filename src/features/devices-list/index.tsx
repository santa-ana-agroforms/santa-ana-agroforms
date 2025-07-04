// src/components/DevicesList/DevicesList.tsx
import React, { useState, useCallback } from 'react';
import { Button, Col, Input } from 'antd';
import type { TableProps } from 'antd';
import { FilterOutlined, ArrowUpOutlined } from '@ant-design/icons';

import DevicesTable, { ItemType as DeviceType } from '@/components/DeviceTables';
import { devices } from './data';

const DevicesList: React.FC = () => {
  // estados para búsqueda, filtros y orden
  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<any>({});

  // filtrar globalmente según el texto
  const filteredData = devices.filter((item) =>
    Object.values(item as unknown as Record<string, unknown>)
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // onChange estándar de ant-table
  const handleTableChange: TableProps<DeviceType>['onChange'] = (
    _pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleEdit = useCallback((rec: DeviceType) => {
    console.log('EDIT:', rec);
    // aquí tu lógica para editar…
  }, []);

  const handleDelete = useCallback((rec: DeviceType) => {
    console.log('DELETE:', rec);
    // aquí tu lógica para borrar…
  }, []);

  const handleIdClick = useCallback((id: string) => {
    console.log('GO TO DETAIL FOR ID:', id);
    // navegación o callback…
  }, []);

  return (
    <div className="flex flex-col p-4 w-full gap-7">
      <div className="flex justify-between items-center w-full">
        {/* Botón de “Categoría” (igual que antes) */}
        <Button icon={<FilterOutlined />} className="flex items-center gap-1">
          Categoría <ArrowUpOutlined />
        </Button>

        {/* Input.Search para filtrar */}
        <Col className="w-60">
          <Input
            placeholder="Introduzca el texto a buscar..."
            allowClear
            className="w-48"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </div>

      {/* Nuestra tabla “plana” sin Collapse */}
      <DevicesTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onIdClick={handleIdClick}
        onTableChange={handleTableChange}
      />
    </div>
  );
};

export default DevicesList;
