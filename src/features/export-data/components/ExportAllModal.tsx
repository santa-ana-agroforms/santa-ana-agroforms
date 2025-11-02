// src/components/ExportAllModal.tsx
import { FC, useState } from "react";

import { Button, Form, message, Radio, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";

import { exportAllEntries } from "../hooks/useEntriesExport";

/** Props del modal */
export interface ExportAllModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
}

const ExportAllModal: FC<ExportAllModalProps> = ({
  visible,
  onCancel,
  ...modalProps
}) => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"xlsx" | "csv" | "json">("xlsx");

  const handleExportAll = async () => {
    try {
      setLoading(true);
      await exportAllEntries(format);
      message.success(
        `Todos los formularios exportados (${format.toUpperCase()}) ✅`
      );
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("No se pudieron exportar los formularios ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={visible}
      onCancel={onCancel}
      title="Exportar todos los formularios"
      width={400}
      {...modalProps}
    >
      <Form layout="vertical">
        <Form.Item label="Formato de exportación">
          <Radio.Group
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <Radio value="json">Excel (.xlsx)</Radio>
            <Radio value="csv" disabled>
              CSV (.csv)
            </Radio>
            <Radio value="xlsx" disabled>
              JSON (.json)
            </Radio>
          </Radio.Group>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" onClick={handleExportAll} loading={loading}>
            Exportar Todo
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default ExportAllModal;
