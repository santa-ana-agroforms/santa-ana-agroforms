// components/BaseModal.tsx
import React, { ReactNode } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Modal, type ModalProps } from "antd";

export interface BaseModalProps
  extends Omit<ModalProps, "title" | "closeIcon"> {
  /** Título que aparecerá en la cabecera */
  title: ReactNode;
  /** Contenido interno del modal */
  children: ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  title,
  children,
  open: visible,
  onCancel,
  width = 800,
  ...restProps
}) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    width={width}
    title={title}
    footer={null}
    closeIcon={<CloseOutlined />}
    {...restProps}
  >
    <div className="border-t border-gray-300 mt-3 mb-6" />
    {children}
  </Modal>
);

export default BaseModal;
