// components/DataModal.tsx
import React, { useCallback, useEffect, useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, TableProps, Upload } from "antd";
import type { UploadFile } from "antd/lib/upload/interface";

import BaseModal from "@/components/BaseModal";
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import FlatTables from "@/components/FlatTables";

import { useExcelUpload } from "../hooks/useExcelUpload";
import { CategoryType, DataManualType, getColumns, ItemType } from "./data";
import DataManualModal from "./DataManualModa";

const { Dragger } = Upload;

interface DataModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (files: UploadFile[]) => void;
}

const updateItemInCategory = (
  category: CategoryType,
  initialValues: Partial<ItemType> | undefined,
  newValues: DataManualType
): CategoryType => {
  if (category.key !== "local") return category;

  if (initialValues) {
    return {
      ...category,
      items: category.items.map((it) =>
        it.key === initialValues.key ? { ...it, ...newValues } : it
      ),
    };
  }

  return {
    ...category,
    items: [
      ...category.items,
      {
        ...newValues,
        key: Date.now().toString(),
      },
    ],
  };
};

const removeItemFromCategory = (
  category: CategoryType,
  itemKey: string
): CategoryType => ({
  ...category,
  items: category.items.filter((it) => it.key !== itemKey),
});

const DataModal: React.FC<DataModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  useEffect(() => {
    if (!visible) {
      setFileList([]);
      setDataManual([
        { key: "local", name: "Local", items: [] },
        { key: "externa", name: "Externa", items: [] },
      ]);
    }
  }, [visible]);

  const [manualVisible, setManualVisible] = useState(false);
  const [manualInitialValues, setManualInitialValues] = useState<
    Partial<ItemType> | undefined
  >(undefined);

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
    setModalVisible(false);
    setSelectedItem(null);
  };

  const [formInstance] = Form.useForm();

  const [dataManual, setDataManual] = useState<CategoryType[]>([
    { key: "local", name: "Local", items: [] },
    { key: "externa", name: "Externa", items: [] },
  ]);

  const { uploadProps, fileList, setFileList } = useExcelUpload(setDataManual);

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
          <Form.Item key="submit">
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
          <Dragger {...uploadProps} style={{ padding: 16 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Arrastra el archivo aquí</p>
            <p className="ant-upload-hint">o haz clic para seleccionarlo</p>
          </Dragger>

          <FlatTables
            data={dataManual}
            columns={columns}
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
            prev.map((cat) =>
              updateItemInCategory(cat, manualInitialValues, values as DataManualType)
            )
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
            // ✅ Usar función auxiliar
            setDataManual((prev) =>
              prev.map((cat) => removeItemFromCategory(cat, selectedItem.key))
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