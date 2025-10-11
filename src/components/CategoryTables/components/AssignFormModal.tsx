// components/AssignFormModal.tsx
import BaseModal, { BaseModalProps } from "@/components/BaseModal";
import { CloseOutlined, SendOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Select, Space, Typography } from "antd";
import React from "react";

const { Text } = Typography;

export type UserOption = { label: string; value: string; disabled?: boolean };

export interface AssignFormModalProps
  extends Omit<BaseModalProps, "title" | "children"> {
  /** Opciones del dropdown (id + nombre) */
  options?: UserOption[];
  /** Placeholder del Select */
  placeholder?: string;
  /** Texto bajo el select (útil para instrucciones) */
  helperText?: string;
  /** Estado de carga del Select (p.ej. mientras traes usuarios) */
  loadingOptions?: boolean;
  /** Estado de envío (deshabilita botones y muestra spinners) */
  submitting?: boolean;
  /** Selección inicial (para uno o varios usuarios) */
  defaultSelected?: string[];
  /** Callback cuando se confirma la asignación */
  onAssign: (userIds: string[]) => void;
  /** Búsqueda remota opcional (se activa con showSearch) */
  onSearchUsers?: (query: string) => void;
  /** Si quieres permitir solo 1 selección, cambia a false (por defecto múltiple) */
  multiple?: boolean;
  resetOnClose?: boolean;
}

const AssignFormModal: React.FC<AssignFormModalProps> = ({
  options = [],
  placeholder = "Selecciona uno o más usuarios…",
  helperText,
  loadingOptions = false,
  submitting = false,
  defaultSelected = [],
  onAssign,
  onCancel,
  onSearchUsers,
  multiple = true,
  open,
  resetOnClose = true,
  ...restProps
}) => {
  const [userIds, setUserIds] = React.useState<string[]>(defaultSelected);

  const canAssign = userIds.length > 0 && !submitting;

  const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
    if (resetOnClose) setUserIds([]);
    onCancel?.(e as any);
  };

  return (
    <BaseModal
      title={
        <div className="flex items-center">
          <UserAddOutlined className="text-blue-500 mr-2" />
          <span>Asignar formulario</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={520}
      {...restProps}
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Selector de usuarios */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {multiple ? "Usuarios" : "Usuario"}
          </label>
          <Select
            mode={multiple ? "multiple" : undefined}
            showSearch
            allowClear
            loading={loadingOptions}
            placeholder={placeholder}
            options={options}
            value={multiple ? userIds : userIds[0]}
            onChange={(v) =>
              setUserIds(Array.isArray(v) ? v : v ? [v] : [])
            }
            onSearch={onSearchUsers}
            filterOption={
              onSearchUsers
                ? false // búsqueda remota
                : (input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
            }
            maxTagCount="responsive"
          />
          {helperText ? (
            <Text type="secondary" className="text-xs">
              {helperText}
            </Text>
          ) : null}
        </div>

        {/* Botones */}
        <Space size="middle" className="self-end">
          <Button
            onClick={handleCancel}
            disabled={submitting}
            className="px-5 py-2 h-auto flex items-center"
          >
            <CloseOutlined className="mr-1" />
            Cancelar
          </Button>

          <Button
            type="primary"
            onClick={() => canAssign && onAssign(userIds)}
            disabled={!canAssign}
            loading={submitting}
            className="px-5 py-2 h-auto flex items-center"
          >
            <SendOutlined className="mr-1" />
            {submitting ? "Asignando…" : "Asignar"}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
};

export default AssignFormModal;
