// src/components/EditUserModal.tsx
import { FC, useEffect } from "react";

import { Button, Checkbox, Form, Input, Select, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";
import { useRoles } from "@/features/users-list/hooks/useRoles";

const { Option } = Select;

// La forma de los valores que devuelve el form
export interface EditUserValues {
  id: string;
  nombre: string;
  nombre_usuario: string;
  contrasena?: string;
  activo: boolean;
  email: string;
  roles: string[];
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
  const { roles, loading, error } = useRoles();

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

  const handleFinish = (values: EditUserValues) => {
    onSave(values); // 👈 delegamos al padre
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
            rules={[
              { required: true, message: "Marca para activar el usuario" },
            ]}
          >
            <Checkbox className="flex-row-reverse">Activo</Checkbox>
          </Form.Item>
        </div>

        <div className="w-full pl-25">
          <Form.Item
            label="Rol"
            name="roles"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Selecciona los roles"
              options={roles.map((rol) => ({
                label: rol.nombre,
                value: rol.id,
              }))}
            />
          </Form.Item>
        </div>

        <div className="w-full pl-[1.65rem]">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "El email no es válido" }]}
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
