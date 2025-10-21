// src/components/DataSources.tsx
import React, { useCallback, useState } from "react";

import { TableProps } from "antd";

import CategoryTables from "@/components/CategoryTables";
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import { categories, getColumns } from "@/features/data-sources/data";

import DataModal from "./components/DataModal";
import DataSourceModal, { NewFormValues } from "./components/DataSourceModal";

export interface ItemType {
  key: string;
  codigo: string;
  descripcion: string;
  tipoFuente: string;
  conexion?: string;
  comando?: string;
  intervalo?: string;
  ultActualizacion?: string;
  ultMensaje?: string;
  datos?: string;
}

type OnChange = NonNullable<TableProps<ItemType>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

const removeItemFromCategories = (
  categories: CategoryType[],
  itemKey: string
): CategoryType[] => {
  return categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((it) => it.key !== itemKey),
  }));
};

const DataSources: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);
  const [data, setData] = useState(categories);

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  };

  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    setSelectedItem(record);
  }, []);

  const handleDelete = useCallback((_record: ItemType) => {
    setSelectedItem(_record);
    setModalDeleteVisible(true);
  }, []);

  const handleCreate = (values: NewFormValues) => {
    console.log("Nuevos valores:", values);
  };

  const handleDatos = (record: ItemType) => {
    setSelected(record);
    setModalVisible(true);
  };

  const columns = getColumns(
    sortedInfo,
    filteredInfo,
    handleAdd,
    handleEdit,
    handleDelete,
    handleDatos
  );

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleSubmit = () => {
    console.log("Subiendo archivos para registro:", selected);
    setModalVisible(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <CategoryTables<ItemType>
        data={data}
        columns={columns}
        onTableChange={handleChange}
      />

      <DataModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <DataSourceModal
        visible={open}
        initialValues={selectedItem || undefined}
        onCancel={() => setOpen(false)}
        onCreate={handleCreate}
      />

      <DeleteFormModal
        open={modalDeleteVisible}
        confirmText={`¿Estás seguro de querer borrar el dato: ${selectedItem?.descripcion}?`}
        loading={false}
        onConfirm={() => {
          if (selectedItem) {
            setData((prev) => removeItemFromCategories(prev, selectedItem.key));
          }
          setModalDeleteVisible(false);
          setSelectedItem(null);
        }}
        onCancel={() => {
          setModalDeleteVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default DataSources;