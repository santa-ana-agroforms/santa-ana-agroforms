import React, { useState } from 'react';
import { Button, Col, Collapse, Input, Table, TableColumnsType, TableProps, Typography } from 'antd';
import { FilterOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getColumns, categories } from '@/components/CategoryTables/data';
import CategoryTables from '@/components/CategoryTables';

const { Panel } = Collapse;
const { Title } = Typography;

interface ItemType {
  key: string;
  id: number;
  titulo: string;
  desde: string;
  hasta: string;
  estado: string;
  esPublico: boolean;
  autoEnvio: boolean;
}

interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

type OnChange = NonNullable<TableProps<ItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

const FormsLists: React.FC = () => {

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  
  const columns = getColumns(sortedInfo, filteredInfo);

  return (
    <div className="flex flex-col p-4 w-full gap-7 ">
      <div className="flex justify-between items-center w-full">
        {/* Botón de Categoría */}
        <Button icon={<FilterOutlined />} className="flex items-center gap-1">
          Categoría <ArrowUpOutlined />
        </Button>


        <Col className='w-60'>
          {/* Input de búsqueda */}
          <Input
            placeholder="Introduzca el texto a buscar..."
            className="w-48"
          />
        </Col>
      </div>

      <CategoryTables
        data={categories}
        columns={columns}
        onTableChange={handleChange}
      />
    </div>
  );
};

export default FormsLists;
