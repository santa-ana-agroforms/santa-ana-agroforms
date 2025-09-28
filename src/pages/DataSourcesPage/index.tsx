// src/pages/DataSourcesPage.tsx
import React, { useCallback, useState } from "react";

import { TableProps } from "antd";

import DataSources from "@/features/data-sources";
import { getColumns } from "@/features/data-sources/data";

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

const DataSourcesPage: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  };
  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    setSelectedItem(record);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback((record: ItemType) => {
    setOpen(false);
    setModalVisible(false);
  }, []);

  const columns = getColumns(
    sortedInfo,
    filteredInfo,
    handleAdd,
    handleEdit,
    handleDelete
  );

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 ">
      <DataSources />
    </div>
  );
};

export default DataSourcesPage;
