// src/components/EditUserModal.tsx
import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Select, Button } from 'antd'
import type { ModalProps } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import BaseModal from '@/components/BaseModal'

const { Option } = Select

// La forma de los valores que devuelve el form
export interface EditUserValues {
  id: string
  nombre: string
  contrasena?: string
  activo: boolean
  email: string
}

// Props que recibe este modal
export interface EditUserModalProps extends Omit<ModalProps, 'title'> {
  visible: boolean
  onCancel: () => void
  /** Callback con los valores al guardar */
  onSave: (values: EditUserValues) => void
  initialValues?: Partial<EditUserValues>
}

const EditUserModal: FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm<EditUserValues>()

  // Al mostrarse el modal, cargamos o reseteamos los valores
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues)
      } else {
        form.resetFields()
      }
    }
  }, [visible, initialValues, form])

  const handleFinish = (values: EditUserValues) => {
    onSave(values)
    form.resetFields()
    onCancel()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

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
        <div className='w-full pl-[2.7rem]'>
            <Form.Item
            label="Id"
            name="id"
            rules={[{ required: true, message: 'Por favor ingresa el Id' }]}
            >
            <Input />
            </Form.Item>
        </div>

    <div className='w-full pl-[0.375rem]'>
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
        >
          <Input />
        </Form.Item>
    </div>

    <div className='w-2/3'>
        <Form.Item
          label="Contraseña"
          name="contrasena"
        >
          <Input.Password />
        </Form.Item>
    </div>

    <div className='flex-row-reverse pl-7'>
            <Form.Item
            name="activo"
            valuePropName="checked"
            rules={[{ required: true, message: 'Marca para activar el usuario' }]}
            >
            <Checkbox className='flex-row-reverse'>Activo</Checkbox>
            </Form.Item>
    </div>

    <div className='w-full pl-7'>
        <Form.Item
            label="Perfil"
            name="perfil"
            rules={[{ required: true, message: 'Selecciona un perfil' }]}
            >
            <Select placeholder="Selecciona perfil">
                <Option value="Usuario">Usuario</Option>
                <Option value="Administrador">Administrador</Option>
            </Select>
        </Form.Item>
    </div>

    <div className='w-full pl-[1.65rem]'>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Por favor ingresa el email' },
            { type: 'email', message: 'El email no es válido' }
          ]}
        >
          <Input />
        </Form.Item>
    </div>

        <div className='flex justify-end h-9'>
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
  )
}

export default EditUserModal
