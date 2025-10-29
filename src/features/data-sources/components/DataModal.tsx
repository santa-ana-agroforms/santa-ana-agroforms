// components/DataModal.tsx
import React, { useCallback, useEffect, useState } from "react";

import { Button, Form, TableProps, Upload } from "antd";
// Remove this import, it's not needed
import type { UploadFile } from "antd/lib/upload/interface";

import BaseModal from "@/components/BaseModal";
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import FlatTables from "@/components/FlatTables";

import { useExcelUpload } from "../hooks/useExcelUpload";
import { FuenteDatoAPI } from "../services/data-sources.services";
import { CategoryType, DataManualType, getColumns, ItemType } from "./data";
import DataManualModal from "./DataManualModa";

const { Dragger } = Upload;

interface DataModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (files: UploadFile[]) => void;
  fuenteSeleccionada?: FuenteDatoAPI | null;
}

const DataModal: React.FC<DataModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  fuenteSeleccionada,
}) => {
  //const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!visible) {
      setFileList([]);
      setDataManual([
        { key: "local", name: "Local", items: [] },
        { key: "externa", name: "Externa", items: [] },
      ]);
    }
  }, [visible]);

  /** Estados para el modal “añadir/editar manualmente” */
  const [manualVisible, setManualVisible] = useState(false);
  const [manualInitialValues, setManualInitialValues] = useState<
    Partial<ItemType> | undefined
  >(undefined);

  /** Estados para el modal de detalle de datos (si lo necesitas) */
  const [detailVisible, setDetailVisible] = useState(false);

  const handleOk = () => {
    onSubmit(fileList);
    setFileList([]);
  };

  type OnChange = NonNullable<TableProps<ItemType>["onChange"]>;
  type GetSingle<T> = T extends (infer U)[] ? U : never;
  type Sorts = GetSingle<Parameters<OnChange>[2]>;
  type Filters = Parameters<OnChange>[1];

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    setManualInitialValues(undefined);
    setManualVisible(true);
  };

  const handleEdit = (record: ItemType) => {
    setManualInitialValues(record);
    setManualVisible(true);
  };

  const handleDelete = useCallback((_record: ItemType) => {
    //setOpen(true);
    setSelectedItem(_record);
    setModalVisible(true);
  }, []);

  const handleDatos = (record: ItemType) => {
    setSelectedItem(record);
    setDetailVisible(true);
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
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    console.log("Subiendo archivos para registro:", selectedItem);
    // → aquí llamas a tu API
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Create a Form instance
  const [formInstance] = Form.useForm();

  const [dataManual, setDataManual] = useState<CategoryType[]>([
    { key: "local", name: "Local", items: [] },
    { key: "externa", name: "Externa", items: [] },
  ]);

  const { uploadProps, fileList, setFileList } = useExcelUpload(setDataManual);

  console.warn("Data manual:", fuenteSeleccionada);

  return (
    <>
      <BaseModal
        open={visible}
        onCancel={() => {
          setFileList([]);
          onCancel();
          setDataManual([
            { key: "local", name: "Local", items: [] },
            { key: "externa", name: "Externa", items: [] },
          ]);
        }}
        title="Contenido de Datos"
        width={1350}
        footer={[
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                dataManual[0].items.length === 0 &&
                dataManual[1].items.length === 0
              }
              onClick={handleOk}
            >
              Guardar
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onCancel}>
              Cancelar
            </Button>
          </Form.Item>,
        ]}
      >
        <div className="flex flex-col w-full h-full gap-4">
          {/* <Dragger {...uploadProps} style={{ padding: 16 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Arrastra el archivo aquí</p>
            <p className="ant-upload-hint">o haz clic para seleccionarlo</p>
          </Dragger> */}

          <FlatTables
            data={[
              {
                key: fuenteSeleccionada?.id ?? "sin-id",
                name: fuenteSeleccionada?.nombre ?? "Sin nombre",
                items:
                  fuenteSeleccionada?.preview_data?.map((p, i) => ({
                    key: i.toString(),
                    ...p,
                  })) ?? [],
              },
            ]}
            columns={
              fuenteSeleccionada?.columnas
                ?.filter((col) => col !== "0")
                .map((col) => ({
                  title: col,
                  dataIndex: col,
                  key: col,
                })) ?? []
            }
            onTableChange={handleChange}
          />
        </div>
      </BaseModal>
      <DataManualModal
        visible={manualVisible}
        initialValues={manualInitialValues}
        onCancel={() => {
          setManualVisible(false);
          setManualInitialValues(undefined);
        }}
        onSubmit={(values) => {
          setDataManual((prev) =>
            prev.map((cat) => {
              if (cat.key === "local") {
                if (manualInitialValues) {
                  // Actualizar registro existente
                  return {
                    ...cat,
                    items: cat.items.map((it) =>
                      it.key === manualInitialValues.key ?
                        { ...it, ...values }
                      : it
                    ),
                  };
                } else {
                  // Añadir nuevo
                  return {
                    ...cat,
                    items: [
                      ...cat.items,
                      {
                        ...(values as DataManualType),
                        key: Date.now().toString(),
                      },
                    ],
                  };
                }
              }
              return cat;
            })
          );

          setManualVisible(false);
          setManualInitialValues(undefined);
        }}
      />

      <DeleteFormModal
        open={modalVisible}
        confirmText={`¿Estás seguro de querer borrar el dato: ${selectedItem?.descripcion}?`}
        loading={false}
        onConfirm={() => {
          if (selectedItem) {
            setDataManual((prev) =>
              prev.map((cat) => ({
                ...cat,
                items: cat.items.filter((it) => it.key !== selectedItem.key),
              }))
            );
          }
          setModalVisible(false);
          setSelectedItem(null);
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </>
  );
};

export default DataModal;
