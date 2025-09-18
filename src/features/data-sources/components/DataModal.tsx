// components/DataModal.tsx
import React, { useCallback, useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, TableProps, Upload } from "antd";
// Remove this import, it's not needed
import type { UploadFile } from "antd/lib/upload/interface";

import BaseModal from "@/components/BaseModal";
import FlatTables from "@/components/FlatTables";

import { categories, getColumns, ItemType } from "./data";
import DataManualModal from "./DataManualModa";

const { Dragger } = Upload;

interface DataModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (files: UploadFile[]) => void;
}

const DataModal: React.FC<DataModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /** Estados para el modal “añadir/editar manualmente” */
  const [manualVisible, setManualVisible] = useState(false);
  const [manualInitialValues, setManualInitialValues] = useState<
    Partial<ItemType> | undefined
  >(undefined);

  /** Estados para el modal de detalle de datos (si lo necesitas) */
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<ItemType | null>(
    null
  );

  const uploadProps = {
    multiple: false,
    fileList,
    beforeUpload: () => false, // deshabilita el upload automático
    onChange(info: { fileList: UploadFile[] }) {
      setFileList(info.fileList);
    },
  };

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
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);

  const handleAdd = () => {
    setManualInitialValues(undefined); // nuevo
    setManualVisible(true);
  };

  const handleEdit = useCallback((record: ItemType) => {
    setManualInitialValues(record); // editas con valores del registro
    setManualVisible(true);
  }, []);

  const handleDelete = useCallback((_record: ItemType) => {
    setOpen(false);
    setModalVisible(false);
  }, []);

  const handleDatos = (record: ItemType) => {
    setSelectedDetailItem(record);
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
    setSelected(null);
  };

  const handleSubmit = () => {
    console.log("Subiendo archivos para registro:", selected);
    // → aquí llamas a tu API
    setModalVisible(false);
    setSelected(null);
  };

  // Create a Form instance
  const [formInstance] = Form.useForm();

  return (
    <>
      <BaseModal
        open={visible}
        onCancel={() => {
          setFileList([]);
          onCancel();
        }}
        title="Contenido de Datos"
        width={1350}
        footer={[
          <Form.Item>
            <Button type="primary" htmlType="submit">
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
            data={categories}
            columns={columns}
            onTableChange={() => {}}
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
          if (manualInitialValues) {
            console.log("Actualizando registro con:", values);
            // → tu lógica de edición
          } else {
            console.log("Añadiendo nuevo registro:", values);
            // → tu lógica de alta
          }
          setManualVisible(false);
        }}
      />
    </>
  );
};

export default DataModal;
