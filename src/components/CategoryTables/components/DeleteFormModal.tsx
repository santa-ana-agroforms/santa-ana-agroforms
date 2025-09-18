// components/DeleteFormModal.tsx
import React from "react";

import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Space } from "antd";

import BaseModal, { BaseModalProps } from "@/components/BaseModal";

export interface DeleteFormModalProps
  extends Omit<BaseModalProps, "title" | "children"> {
  /** Título del formulario a eliminar */
  formTitle?: string;
  /** Texto personalizado para la pregunta de confirmación */
  confirmText?: string;
  /** Si está en estado de carga (deshabilitar botones) */
  loading?: boolean;
  /** Callback cuando se confirma la eliminación */
  onConfirm: () => void;
}

const DeleteFormModal: React.FC<DeleteFormModalProps> = ({
  formTitle = "este formulario",
  confirmText,
  loading = false,
  onConfirm,
  onCancel,
  ...restProps
}) => {
  // Texto por defecto si no se proporciona uno personalizado
  const defaultConfirmText = `¿Estás seguro de querer borrar el formulario "${formTitle}"? Esta acción no se puede deshacer.`;

  return (
    <BaseModal
      title={
        <div className="flex items-center">
          <ExclamationCircleFilled className="text-red-500 mr-2" />
          <span>Confirmar eliminación</span>
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
            danger
            size="middle"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="px-5 py-2 h-auto flex items-center"
          >
            <DeleteOutlined className="mr-1" />
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
};

export default DeleteFormModal;
