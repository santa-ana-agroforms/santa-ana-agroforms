// components/DuplicateFormModal.tsx
import React from "react";

import {
  CloseOutlined,
  CopyOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Space } from "antd";

import BaseModal, { BaseModalProps } from "@/components/BaseModal";

export interface DuplicateFormModalProps
  extends Omit<BaseModalProps, "title" | "children"> {
  /** Título del formulario a duplicar */
  formTitle?: string;
  /** Texto personalizado para la pregunta de confirmación */
  confirmText?: string;
  /** Si está en estado de carga (deshabilitar botones y mostrar spinner) */
  loading?: boolean;
  /** Callback cuando se confirma la duplicación */
  onConfirm: () => void;
}

const DuplicateFormModal: React.FC<DuplicateFormModalProps> = ({
  formTitle = "este formulario",
  confirmText,
  loading = false,
  onConfirm,
  onCancel,
  ...restProps
}) => {
  // Texto por defecto si no se proporciona uno personalizado
  const defaultConfirmText = `¿Estás seguro de querer duplicar el formulario "${formTitle}"? Se creará una copia con el mismo contenido.`;

  return (
    <BaseModal
      title={
        <div className="flex items-center">
          <ExclamationCircleFilled className="text-blue-500 mr-2" />
          <span>Confirmar duplicación</span>
        </div>
      }
      onCancel={onCancel}
      width={500}
      {...restProps}
    >
      <div className="flex flex-col items-center py-4 gap-10">
        {/* Descripción */}
        <p className="text-gray-600 text-center mb-6">
          {confirmText || defaultConfirmText}
        </p>

        {/* Botones de acción */}
        <Space size="middle">
          <Button
            size="middle"
            onClick={onCancel}
            loading={loading}
            disabled={loading}
            className="px-5 py-2 h-auto flex items-center"
          >
            <CloseOutlined className="mr-1" />
            Cancelar
          </Button>

          <Button
            type="primary"
            size="middle"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="px-5 py-2 h-auto flex items-center"
          >
            <CopyOutlined className="mr-1" />
            {loading ? "Duplicando..." : "Duplicar"}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
};

export default DuplicateFormModal;
