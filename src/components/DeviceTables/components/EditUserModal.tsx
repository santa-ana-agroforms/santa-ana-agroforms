// src/components/EditUserModal.tsx
<<<<<<< HEAD
import { FC, useEffect } from "react";

=======
import React, { FC, useEffect } from "react";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
import { Button, Checkbox, Form, Input, Select, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";

const { Option } = Select;

// La forma de los valores que devuelve el form
export interface EditUserValues {
  id: string;
  nombre: string;
<<<<<<< HEAD
  nombre_usuario: string;
  contrasena?: string;
  activo: boolean;
  email: string;
  acceso_web?: boolean;
  //roles: string[];
=======
  contrasena?: string;
  activo: boolean;
  email: string;
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
}

// Props que recibe este modal
export interface EditUserModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al guardar */
  onSave: (values: EditUserValues) => void;
  initialValues?: Partial<EditUserValues>;
<<<<<<< HEAD
  creating?: boolean;
=======
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
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
<<<<<<< HEAD
  //const { roles, loading, error } = useRoles();
=======
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466

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
<<<<<<< HEAD
    onSave(values); // 👈 delegamos al padre
=======
    onSave(values);
    form.resetFields();
    onCancel();
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
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
<<<<<<< HEAD
        <div className="w-full pl-[0.375rem]">
          <Form.Item
            label="Nombre completo"
            name="nombre"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
=======
        <div className="w-full pl-[2.7rem]">
          <Form.Item
            label="Id"
            name="id"
            rules={[{ required: true, message: "Por favor ingresa el Id" }]}
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
          >
            <Input />
          </Form.Item>
        </div>

<<<<<<< HEAD
        <div className="w-full pl-[0.125rem]">
          <Form.Item
            label="Nombre de usuario"
            name="nombre_usuario"
=======
        <div className="w-full pl-[0.375rem]">
          <Form.Item
            label="Nombre"
            name="nombre"
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
        </div>

<<<<<<< HEAD
        <div className="w-2/3 pl-13">
          <Form.Item
            label="Contraseña"
            name="contrasena"
            rules={[
              { required: true, message: "Por favor ingresa la contraseña" },
            ]}
          >
=======
        <div className="w-2/3">
          <Form.Item label="Contraseña" name="contrasena">
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
            <Input.Password />
          </Form.Item>
        </div>

<<<<<<< HEAD
        <div className="flex-row-reverse pl-23">
=======
        <div className="flex-row-reverse pl-7">
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
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

<<<<<<< HEAD
        <div className="w-full pl-[5.9%]">
          <Form.Item
            name="acceso_web"
            valuePropName="checked"
            rules={[
              { required: true, message: "Marca para activar acceso a la web" },
            ]}
          >
            <Checkbox className="flex-row-reverse">Acceso a la web</Checkbox>
=======
        <div className="w-full pl-7">
          <Form.Item
            label="Perfil"
            name="perfil"
            rules={[{ required: true, message: "Selecciona un perfil" }]}
          >
            <Select placeholder="Selecciona perfil">
              <Option value="Usuario">Usuario</Option>
              <Option value="Administrador">Administrador</Option>
            </Select>
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
          </Form.Item>
        </div>

        <div className="w-full pl-[1.65rem]">
          <Form.Item
            label="Email"
            name="email"
<<<<<<< HEAD
            rules={[{ type: "email", message: "El email no es válido" }]}
=======
            rules={[
              { required: true, message: "Por favor ingresa el email" },
              { type: "email", message: "El email no es válido" },
            ]}
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-end h-9">
          <Form.Item>
<<<<<<< HEAD
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
=======
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
>>>>>>> 3d0b0bc47cf700228bfb51b8e76d69525dc15466
              Cancelar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};

export default EditUserModal;
