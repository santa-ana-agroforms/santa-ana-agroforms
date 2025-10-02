// components/QrModal.tsx
import React from "react";

import { Button, QRCode, Space, Spin } from "antd";

import BaseModal from "@/components/BaseModal";

interface QrModalProps {
  open: boolean;
  onClose: () => void;
  qrSrc: string | undefined;
  qrUserName: string | undefined;
}

const QrModal: React.FC<QrModalProps> = ({
  open,
  onClose,
  qrSrc,
  qrUserName,
}) => {
  const handleDownload = () => {
    if (!qrSrc) return;
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = `qr-code-${qrUserName}.png`;
    link.click();
  };

  return (
    <BaseModal open={open} onCancel={onClose} title="Código QR" width={400}>
      <div className="flex flex-col items-center justify-center gap-6">
        {qrSrc === undefined ?
          <QRCode
            value="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Ejemplo"
            status="loading"
            statusRender={() => (
              <Space direction="vertical" align="center">
                <Spin />
                <p>Cargando...</p>
              </Space>
            )}
          />
        : <img src={qrSrc} alt="Código QR" className="w-48 h-48" />}

        {/* Botones */}
        <div className="flex gap-3">
          <Button type="primary" onClick={handleDownload}>
            Descargar QR
          </Button>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QrModal;
