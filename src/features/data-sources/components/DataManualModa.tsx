// components/DataManualModal.tsx
import React, { useEffect } from "react";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";

import BaseModal from "@/components/BaseModal";

import { DataManualType } from "./data";

export interface DataManualModalProps {
  /** Controla la visibilidad del modal */
  visible: boolean;
  /** Se dispara al cerrar sin guardar */
  onCancel: () => void;
  /** Se dispara al hacer submit exitoso del form */
  onSubmit: (values: DataManualType) => void;
  /** Valores iniciales (para editar) */
  initialValues?: Record<string, any>;
}

const DataManualModal: React.FC<DataManualModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: DataManualType) => {
    onSubmit(values);
    form.resetFields();
  };

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, visible, form]);

  return (
    <BaseModal
      title="Formulario de edición"
      open={visible}
      onCancel={onCancel}
      width={800}
      /** Reemplazamos el footer por dos botones iconográficos */
      footer={[
        <Button
          key="submit"
          type="primary"
          shape="circle"
          icon={<CheckOutlined />}
          onClick={() => form.submit()}
        />,
        <Button
          key="cancel"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
        />,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={24}>
          {/* Columna izquierda: Código + Campos impares */}
          <Col span={12}>
            <Form.Item
              name="codigo"
              label="Código"
              rules={[{ required: true, message: "Código es obligatorio" }]}
            >
              <Input />
            </Form.Item>
            {["campo1", "campo3", "campo5", "campo7", "campo9"].map((campo) => (
              <Form.Item
                key={campo}
                name={campo}
                label={campo.replace(/^\w/, (l) => l.toUpperCase())}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>

          {/* Columna derecha: Descripción + Campos pares */}
          <Col span={12}>
            <Form.Item
              name="descripcion"
              label="Descripción"
              rules={[
                { required: true, message: "Descripción es obligatoria" },
              ]}
            >
              <Input />
            </Form.Item>
            {["campo2", "campo4", "campo6", "campo8", "campo10"].map(
              (campo) => (
                <Form.Item
                  key={campo}
                  name={campo}
                  label={campo.replace(/^\w/, (l) => l.toUpperCase())}
                >
                  <Input />
                </Form.Item>
              )
            )}
          </Col>
        </Row>
      </Form>
    </BaseModal>
  );
};

export default DataManualModal;
