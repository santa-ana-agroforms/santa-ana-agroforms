// src/components/DataSources.tsx
import React, { useCallback, useState } from "react";

import { message, TableProps } from "antd";

import CategoryTables, { Category } from "@/components/CategoryTables";
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import { categories, getColumns } from "@/features/data-sources/data";

import DataModal from "./components/DataModal";
import DataSourceModal, { NewFormValues } from "./components/DataSourceModal";
import { useFuentesDatos } from "./hooks/useDataSources";
import { useDeleteFuenteDato } from "./hooks/useDeleteFuenteDato";
import { FuenteDatoAPI } from "./services/data-sources.services";

export interface ItemType {
  key: string;
  nombre: string;
  descripcion: string;
  tipoFuente: string;
  datos: string;
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
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);
  const [data, setData] = useState(categories);
  const [selectedFuente, setSelectedFuente] = useState<FuenteDatoAPI | null>(
    null
  );

  const { data: dataSources, isLoading, error } = useFuentesDatos();
  const { mutateAsync: eliminarFuenteDato, isPending: deleting } =
    useDeleteFuenteDato();

  console.warn("Fuentes de datos cargadas:", dataSources, isLoading, error);

  const transformedData: Category<ItemType>[] = [
    {
      key: "fuentes-datos",
      name: "Fuentes de Datos locales",
      items:
        dataSources?.map((item) => ({
          key: item.id,
          nombre: item.nombre,
          descripcion: item.descripcion,
          tipoFuente: item.tipo_archivo,
          datos: item.columnas?.join(", ") ?? "",
        })) ?? [],
    },
  ];

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
    // aquí haces el post o actualización de estado…
  };

  const handleDatos = (record: ItemType) => {
    const fuente = dataSources?.find((d) => d.nombre === record.nombre);
    setSelectedFuente(fuente ?? null);
    setModalVisible(true);
  };

  const columns = getColumns(
    sortedInfo,
    filteredInfo,
    handleAdd,
    //handleEdit,
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
    <div className="flex flex-col w-full h-full gap-5">
      <CategoryTables<ItemType>
        data={transformedData}
        columns={columns}
        onTableChange={handleChange}
        showOptions={false}
      />

      <DataModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        fuenteSeleccionada={selectedFuente}
      />

      <DataSourceModal
        visible={open}
        initialValues={selectedItem || undefined}
        onCancel={() => setOpen(false)}
        onCreate={handleCreate}
      />

      <DeleteFormModal
        open={modalDeleteVisible}
        confirmText={`¿Estás seguro de querer borrar la fuente de dato: ${selectedItem?.nombre}?`}
        loading={deleting}
        onConfirm={async () => {
          if (selectedItem) {
            try {
              await eliminarFuenteDato(selectedItem.key); // key = id de la fuente
              message.success("Fuente de datos eliminada correctamente");
            } catch (err) {
              console.error(err);
              message.error("Error al eliminar la fuente de datos");
            }
          }
          setModalDeleteVisible(false);
          setSelectedItem(null);
        }}
        onCancel={() => {
          setModalDeleteVisible(false);
          setSelectedItem(null);
        }}
      />
      {/* Aquí podrías añadir tu modal de edición/creación usando `open`, `selectedItem`, `modalVisible`, etc. */}
    </div>
  );
};

export default DataSources;
