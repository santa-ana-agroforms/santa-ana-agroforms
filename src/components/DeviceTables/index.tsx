// src/components/FormsLists/FlatTable.tsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';

export interface ItemType {
  key: string;
  id: string;
  descripcion: string;
  activa: boolean;
  centroCosto: string;
  lastLogon: string; // en formato DD/MM/YYYY
  version?: string;
}

interface Props {
  /** 
   * Array ya filtrado/ordenado desde el padre 
   * (p. ej. tras tu Input.Search) 
   **/
  data: ItemType[];
  onEdit: (record: ItemType) => void;
  onDelete: (record: ItemType) => void;
  onIdClick: (id: string) => void;
  onTableChange?: TableProps<ItemType>['onChange'];
}

const DevicesTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  onIdClick,
  onTableChange,
}) => {
  // derive filtros únicos de cada columna
  const descripcionFilters = Array.from(new Set(data.map(i => i.descripcion))).map(t => ({ text: t, value: t }));
  const centroCostoFilters = Array.from(new Set(data.map(i => i.centroCosto))).map(t => ({ text: t, value: t }));
  const versionFilters = Array.from(new Set(data.map(i => i.version).filter(v => v))).map(v => ({ text: v!, value: v! }));

  // helper para ordenar fechas DD/MM/YYYY
  const parseDate = (s: string) => {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d).getTime();
  };

  const columns: ColumnsType<ItemType> = [
    {
      title: '#',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_: any,_record: ItemType) => (
        <>
          <FormOutlined
            onClick={() => onEdit(_record)}
            style={{ cursor: 'pointer', marginRight: 8 }}
          />
          <DeleteOutlined
            onClick={() => onDelete(_record)}
            style={{ cursor: 'pointer' }}
          />
        </>
      ),
      
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: { id: string; }, b: { id: any; }) => a.id.localeCompare(b.id),
      render: (value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
        typeof value === 'string' ? (
          <a onClick={() => onIdClick(value)} style={{ color: '#1890ff' }}>
            {value}
          </a>
        ) : (
          <span>{value}</span>
        )
      ),
      ellipsis: true,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      filters: descripcionFilters,
      onFilter: (value: string | number | boolean, record: ItemType) =>
        typeof record.descripcion === 'string' && typeof value === 'string'
          ? record.descripcion.includes(value)
          : false,
      sorter: (a: { descripcion: string; }, b: { descripcion: any; }) => a.descripcion.localeCompare(b.descripcion),
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Activa',
      dataIndex: 'activa',
      key: 'activa',
      filters: [
        { text: 'Sí', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (val: any, rec: { activa: any; }) => rec.activa === val,
      render: (v: any) => (v ? '✔️' : ''),
      sorter: (a: { activa: any; }, b: { activa: any; }) => Number(a.activa) - Number(b.activa),
      width: 120,
    },
    {
      title: 'Centro Costo',
      dataIndex: 'centroCosto',
      key: 'centroCosto',
      filters: centroCostoFilters,
      onFilter: (value, record) => record.centroCosto.includes(value.toString()),
      sorter: (a: { centroCosto: string; }, b: { centroCosto: any; }) => a.centroCosto.localeCompare(b.centroCosto),
      ellipsis: true,
    },
    {
      title: 'Last Logon',
      dataIndex: 'lastLogon',
      key: 'lastLogon',
      sorter: (a: { lastLogon: string; }, b: { lastLogon: string; }) => parseDate(a.lastLogon) - parseDate(b.lastLogon),
      ellipsis: true,
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      filters: versionFilters,
      onFilter: (val: any, rec: ItemType) => rec.version === val,
      sorter: (a: ItemType, b: ItemType) => (a.version ?? '').localeCompare(b.version ?? ''),
      ellipsis: true,
      width: 100,
    },
  ];

  return (
    <Table<ItemType>
      rowKey="key"
      columns={columns}
      dataSource={data}
      onChange={onTableChange}
      pagination={false}
    />
  );
};

export default DevicesTable;
