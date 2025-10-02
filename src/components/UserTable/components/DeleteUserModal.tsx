// src/components/DeleteUserModal.tsx
import React, { useCallback } from "react";

import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, message, Space } from "antd";

import BaseModal, { BaseModalProps } from "@/components/BaseModal";
import { useDeleteUsuario } from "@/features/users-list/hooks/useDeleteUsuario";

export interface DeleteUserModalProps
  extends Omit<BaseModalProps, "title" | "children"> {
  /** Nombre del usuario a eliminar */
  userName?: string;
  /** Texto personalizado para la pregunta de confirmación */
  confirmText?: string;
  /** Si está en estado de carga (deshabilitar botones) */
  loading?: boolean;
  /** Callback cuando se confirma la eliminación */
  onConfirm: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  userName = "este usuario",
  confirmText,
  loading = false,
  onConfirm,
  onCancel,
  ...restProps
}) => {
  const { mutate: deleteUsuario, isPending } = useDeleteUsuario();

  const handleConfirm = useCallback(() => {
    if (!userName) return;

    deleteUsuario(userName, {
      onSuccess: () => {
        message.success(`Usuario "${userName}" eliminado correctamente`);
        if (onCancel) {
          // Create a synthetic event to satisfy the expected argument
          onCancel({} as React.MouseEvent<HTMLButtonElement>);
        }

        onConfirm();
      },
      onError: (err: any) => {
        message.error(`Error eliminando usuario: ${err.message}`);
      },
    });
  }, [deleteUsuario, userName, onCancel]);
  const defaultConfirmText = `¿Estás seguro de querer eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`;

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
            onClick={handleConfirm}
            loading={isPending}
            disabled={isPending}
            className="px-5 py-2 h-auto flex items-center"
          >
            <DeleteOutlined className="mr-1" />
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
};

export default DeleteUserModal;
