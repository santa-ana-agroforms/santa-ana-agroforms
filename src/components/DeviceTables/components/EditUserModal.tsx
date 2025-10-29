// src/components/EditUserModal.tsx
import { FC, useEffect } from "react";

import { Button, Checkbox, Form, Input, Select, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";
import { useUpdateUsuario } from "@/features/users-list/hooks/useUpdateUsuario";

const { Option } = Select;

// La forma de los valores que devuelve el form
export interface EditUserValues {
  id: string;
  nombre: string;
  nombre_usuario: string;
  contrasena?: string;
  activo: boolean;
  email: string;
  acceso_web?: boolean;
  //roles: string[];
}

// Props que recibe este modal
export interface EditUserModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al guardar */
  onSave: (values: EditUserValues) => void;
  initialValues?: Partial<EditUserValues>;
  creating?: boolean;
}

const EditUserModal: FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  creating,
  ...modalProps
}) => {
  const [form] = Form.useForm<EditUserValues>();
  //const { roles, loading, error } = useRoles();

  const { update, loading, error } = useUpdateUsuario();

  // Al mostrarse el modal, cargamos o reseteamos los valores
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = async (values: EditUserValues) => {
    onSave(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Edición de Usuario"
      width={600}
      {...modalProps}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        initialValues={{ activo: false }}
      >
        <div className="w-full pl-[0.375rem]">
          <Form.Item
            label="Nombre completo"
            name="nombre"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-full pl-[0.125rem]">
          <Form.Item
            label="Nombre de usuario"
            name="nombre_usuario"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2/3 pl-13">
          <Form.Item
            label="Contraseña"
            name="contrasena"
            rules={[
              { required: true, message: "Por favor ingresa la contraseña" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </div>

        <div className="flex-row-reverse pl-23">
          <Form.Item
            name="activo"
            valuePropName="checked"
            initialValue={false}
            rules={[
              { required: true, message: "Marca para activar el usuario" },
            ]}
          >
            <Checkbox className="flex-row-reverse">Activo</Checkbox>
          </Form.Item>
        </div>

        <div className="w-full pl-[5.9%]">
          <Form.Item
            name="acceso_web"
            valuePropName="checked"
            initialValue={false}
            // rules={[{ message: "Marca para activar acceso a la web" }]}
          >
            <Checkbox className="flex-row-reverse">Acceso a la web</Checkbox>
          </Form.Item>
        </div>

        <div className="w-full pl-[1.65rem]">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "El email no es válido",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-end h-9">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating}
              disabled={creating}
            >
              Guardar
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={handleCancel}
              disabled={creating}
            >
              Cancelar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};

export default EditUserModal;
