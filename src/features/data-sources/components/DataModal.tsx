// components/DataModal.tsx
import React, { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadFile } from "antd/lib/upload/interface";

import BaseModal from "@/components/BaseModal";

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

  return (
    <BaseModal
      open={visible}
      onCancel={() => {
        setFileList([]);
        onCancel();
      }}
      title="Contenido de Datos"
      width={600}
    >
      <Dragger {...uploadProps} style={{ padding: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Arrastra el archivo aquí</p>
        <p className="ant-upload-hint">o haz clic para seleccionarlo</p>
      </Dragger>
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancelar
        </Button>
        <Button
          type="primary"
          disabled={fileList.length === 0}
          onClick={handleOk}
        >
          Subir
        </Button>
      </div>
    </BaseModal>
  );
};

export default DataModal;
