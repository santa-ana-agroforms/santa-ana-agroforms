import React, { useCallback, useState } from 'react';
import { Button, Col, Collapse, Input, Table, TableColumnsType, TableProps, Typography } from 'antd';
import { FilterOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getColumns, categories } from '@/components/CategoryTables/data';
import CategoryTables from '@/components/CategoryTables';
import NewFormModal, { NewFormValues } from '@/components/CategoryTables/components/NewFormModal';
import moment from 'moment';

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

interface FormsListsProps {
  onSelectForm: (id: number) => void
}

type OnChange = NonNullable<TableProps<ItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

const FormsLists: React.FC<FormsListsProps> = ({ onSelectForm }) => {

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false)

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  }

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    setSelectedItem(record);
    setModalVisible(true);
  }, [])
  
  const columns = getColumns(sortedInfo, filteredInfo, handleAdd, onSelectForm, handleEdit);

  const handleCreate = (values: NewFormValues) => {
    console.log('Nuevos valores:', values)
    // aquí haces el post o actualización de estado…
  }

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
      <NewFormModal
        visible={open}
        onCancel={() => setOpen(false)}
        onCreate={handleCreate}
        initialValues={
          selectedItem
            ? {
                titulo: selectedItem.titulo,
                desde: moment(selectedItem.desde, 'DD/MM/YYYY'),
                hasta: moment(selectedItem.hasta, 'DD/MM/YYYY'),
                estado: selectedItem.estado,
                esPublico: selectedItem.esPublico,
                autoEnvio: selectedItem.autoEnvio,
                categoria: categories.find((c) =>
                  c.items.some((i) => i.key === selectedItem.key)
                )!.key,
              }
            : undefined
        }
      />
    </div>
  );
};

export default FormsLists;
