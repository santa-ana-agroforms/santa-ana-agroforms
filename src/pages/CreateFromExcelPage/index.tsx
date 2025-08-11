// src/pages/DataSourcesPage.tsx
import React, { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Typography, Upload } from "antd";
import type { UploadFile } from "antd/lib/upload/interface";

const { Dragger } = Upload;
const { Title } = Typography;

const CreateFromExcelPage: React.FC = () => {
  // Estado para mantener la lista de archivos seleccionados
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Props para <Dragger>
  const uploadProps = {
    multiple: false,
    fileList,
    // Evitamos el upload automático
    beforeUpload: () => false,
    onChange(info: { fileList: UploadFile[] }) {
      setFileList(info.fileList);
    },
  };

  // Función que se dispara al pulsar “CARGAR”
  const handleUpload = () => {
    if (fileList.length === 0) return;
    // Aquí llamas a tu API / backend para procesar el Excel
    console.log("Subiendo archivo(s):", fileList);
    // … tu lógica de subida …
    // Al terminar, puedes limpiar el estado
    setFileList([]);
  };

  return (
    <div className="flex flex-col w-full h-full gap-10">
      <Title level={4}>Seleccione el archivo Excel:</Title>

      <Dragger {...uploadProps} style={{ padding: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Arrastra el archivo aquí</p>
        <p className="ant-upload-hint">o haz clic para seleccionarlo</p>
      </Dragger>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        CARGAR
      </Button>
    </div>
  );
};

export default CreateFromExcelPage;
