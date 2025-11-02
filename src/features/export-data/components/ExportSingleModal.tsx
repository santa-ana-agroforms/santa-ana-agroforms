// src/components/ExportSingleModal.tsx
import { FC, useState } from "react";

import { Button, Form, message, Radio, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";

import { exportEntry } from "../hooks/useEntriesExport";

/** Props del modal */
export interface ExportSingleModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  formId: string;
}

const ExportSingleModal: FC<ExportSingleModalProps> = ({
  visible,
  onCancel,
  formId,
  ...modalProps
}) => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"xlsx" | "csv" | "json">("xlsx");

  const handleExport = async () => {
    if (!formId) {
      message.error("No se encontró el ID del formulario.");
      return;
    }

    try {
      setLoading(true);
      await exportEntry(formId, format);
      message.success(
        `Formulario exportado correctamente (${format.toUpperCase()}) ✅`
      );
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("No se pudo exportar el formulario ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={visible}
      onCancel={onCancel}
      title="Exportar formulario individual"
      width={400}
      {...modalProps}
    >
      <Form layout="vertical">
        <Form.Item label="Formato de exportación">
          <Radio.Group
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <Radio value="xlsx">Excel (.xlsx)</Radio>
            <Radio value="csv">CSV (.csv)</Radio>
            <Radio value="json">JSON (.json)</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" onClick={handleExport} loading={loading}>
            Exportar
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default ExportSingleModal;
