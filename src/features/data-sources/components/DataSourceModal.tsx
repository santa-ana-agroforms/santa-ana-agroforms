// src/components/NewFormModal.tsx
import { FC, useEffect } from "react";

import { Button, Form, Input, Select, type ModalProps } from "antd";
import type { Moment } from "moment";

import BaseModal from "@/components/BaseModal";

const { Option } = Select;

// Definimos la forma de los valores que devuelve el form
export interface NewFormValues {
  descripcion: string;
  titulo: string;
  permitirFotos: boolean;
  permitirGPS: boolean;
  desde: Moment;
  hasta: Moment;
  estado: string;
  formaEnvio: string;
  esPublico: boolean;
  autoEnvio: boolean;
}

// Props que recibe este modal
export interface NewFormModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al hacer submit */
  onCreate: (values: NewFormValues) => void;
  initialValues?: Partial<NewFormValues>;
}

const DataSouceModal: FC<NewFormModalProps> = ({
  visible,
  onCancel,
  onCreate,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm<NewFormValues>();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: NewFormValues) => {
    onCreate(values);
    form.resetFields();
    onCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Adición de Formulario"
      {...modalProps}
      width={750}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        initialValues={{
          permitirFotos: false,
          permitirGPS: false,
          esPublico: false,
          autoEnvio: false,
        }}
      >
        <div className="w-2xl">
          <Form.Item
            label="Código"
            name="codigo"
            rules={[
              { required: true, message: "Por favor ingresa una código" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl pl-9">
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[
              { required: true, message: "Por favor ingresa una descripcion" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl pl-3">
          <Form.Item
            label="Tipo fuente:"
            name="tipo_fuente"
            rules={[
              { required: true, message: "Seleccione un tipo de fuente" },
            ]}
          >
            <Select placeholder="Selecciona un tipo de fuente"></Select>
          </Form.Item>
        </div>

        <div className="w-2xl pl-9">
          <Form.Item label="Conexión:" name="conexion">
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl pl-9">
          <Form.Item label="Comando:" name="comando">
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl pl-9">
          <Form.Item label="Intervalo (segs):" name="intervalo">
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-end h-9">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancelar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};

export default DataSouceModal;
