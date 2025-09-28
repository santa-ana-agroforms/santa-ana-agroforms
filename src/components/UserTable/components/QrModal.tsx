// components/QrModal.tsx
import React from "react";

import { Button } from "antd";

import BaseModal from "@/components/BaseModal";

interface QrModalProps {
  open: boolean;
  onClose: () => void;
  qrSrc: string; // URL o base64 del QR
}

const QrModal: React.FC<QrModalProps> = ({ open, onClose, qrSrc }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <BaseModal open={open} onCancel={onClose} title="Código QR" width={400}>
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Imagen del QR */}
        <img src={qrSrc} alt="Código QR" className="w-48 h-48" />

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
