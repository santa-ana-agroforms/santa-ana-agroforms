// src/components/DataSources.tsx
import React, { useCallback, useState } from "react";

import { TableProps } from "antd";

import CategoryTables from "@/components/CategoryTables";
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

const DataSources: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  };
  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    setSelectedItem(record);
    setModalVisible(true);
  }, []);
  const handleDelete = useCallback((_record: ItemType) => {
    setOpen(false);
    setModalVisible(false);
  }, []);

  const handleCreate = (values: NewFormValues) => {
    console.log("Nuevos valores:", values);
    // aquí haces el post o actualización de estado…
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
    // → aquí llamas a tu API
    setModalVisible(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <CategoryTables<ItemType>
        data={categories}
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
        onCancel={() => setOpen(false)}
        onCreate={handleCreate}
      />
      {/* Aquí podrías añadir tu modal de edición/creación usando `open`, `selectedItem`, `modalVisible`, etc. */}
    </div>
  );
};

export default DataSources;
