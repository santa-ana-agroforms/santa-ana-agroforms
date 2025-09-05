// components/SuspendFormModal.tsx
import React from "react";

import { CloseOutlined, MoonOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

import BaseModal, { BaseModalProps } from "@/components/BaseModal";

export interface SuspendFormModalProps
  extends Omit<BaseModalProps, "title" | "children"> {
  /** Título del formulario a suspender */
  formTitle?: string;
  /** Texto personalizado para la pregunta de confirmación */
  confirmText?: string;
  /** Si está en estado de carga (deshabilitar botones) */
  loading?: boolean;
  /** Callback cuando se confirma la suspensión */
  onConfirm: () => void;
}

const SuspendFormModal: React.FC<SuspendFormModalProps> = ({
  formTitle = "este formulario",
  confirmText,
  loading = false,
  onConfirm,
  onCancel,
  ...restProps
}) => {
  // Texto por defecto si no se proporciona uno personalizado
  const defaultConfirmText = `¿Estás seguro de querer suspender el formulario "${formTitle}"? Podrás reactivarlo más adelante.`;

  return (
    <BaseModal
      title={
        <div className="flex items-center">
          <MoonOutlined className="text-yellow-500 mr-2" />
          <span>Confirmar suspensión</span>
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
            // Estilo “warning” con Tailwind para diferenciar de eliminar
            className="px-5 py-2 h-auto flex items-center bg-yellow-500 hover:bg-yellow-600 border-none"
          >
            <MoonOutlined className="mr-1" />
            {loading ? "Suspendiendo..." : "Suspender"}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
};

export default SuspendFormModal;
