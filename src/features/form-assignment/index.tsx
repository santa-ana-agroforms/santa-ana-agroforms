// src/components/FormAssignment.tsx
import { FC, useEffect } from "react";

import { Button, Form, Input, Select } from "antd";

const { Option } = Select;
const { TextArea } = Input;

/** Tipo de cada opción de formulario/usuario */
export interface OptionType {
  label: string;
  value: string;
}

/** Valores que devuelve el form */
export interface FormAssignmentValues {
  formulario: string;
  usuario: string;
  titulo: string;
  notas: string;
}

/** Props del componente */
export interface FormAssignmentProps {
  /** Opciones para el select de formularios */
  formularios: OptionType[];
  /** Opciones para el select de usuarios */
  usuarios: OptionType[];
  /** Callback al hacer submit */
  onAssign: (values: FormAssignmentValues) => void;
  /** Callback al pulsar “Pre llenar Formulario” */
  onPrefill: () => void;
  /** Valores iniciales (opcional) */
  initialValues?: Partial<FormAssignmentValues>;
}

const FormAssignment: FC<FormAssignmentProps> = ({
  formularios,
  usuarios,
  onAssign,
  onPrefill,
  initialValues,
}) => {
  const [form] = Form.useForm<FormAssignmentValues>();

  // Si nos pasan initialValues, los cargamos en el form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: FormAssignmentValues) => {
    onAssign(values);
    form.resetFields();
  };

  return (
    <div className="p-4 flex h-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-2/3"
      >
        <Form.Item
          label="Formulario"
          name="formulario"
          rules={[
            { required: true, message: "Por favor selecciona un formulario" },
          ]}
          className="w-1/2"
        >
          <Select placeholder="Selecciona formulario">
            {formularios.map((f) => (
              <Option key={f.value} value={f.value}>
                {f.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Usuario"
          name="usuario"
          rules={[
            { required: true, message: "Por favor selecciona un usuario" },
          ]}
          className="w-1/2"
        >
          <Select placeholder="Selecciona usuario">
            {usuarios.map((u) => (
              <Option key={u.value} value={u.value}>
                {u.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Título"
          name="titulo"
          rules={[{ required: true, message: "Por favor ingresa un título" }]}
        >
          <Input placeholder="Escribe un título" />
        </Form.Item>

        <Form.Item
          label="Notas"
          name="notas"
          rules={[{ required: false, message: "Por favor ingresa las notas" }]}
        >
          <TextArea
            rows={4}
            maxLength={350}
            placeholder="Escribe las notas aquí"
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 18, offset: 0 }}
          style={{ marginBottom: 0 }}
        >
          <Button type="primary" htmlType="submit">
            Asignar
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => onPrefill()}>
            Pre llenar Formulario
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormAssignment;
