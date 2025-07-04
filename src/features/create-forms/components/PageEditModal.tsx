// src/components/PageEditModal.tsx
import React, { FC, useEffect } from 'react'
import { Form, InputNumber, Input, Button } from 'antd'
import type { ModalProps } from 'antd'
import BaseModal from '@/components/BaseModal'

/** Forma de los datos de página */
export interface PageValues {
  sequence: number
  description: string
  title: string
  bgColor: string
  textColor: string
}

/** Props del modal */
export interface PageEditModalProps extends Omit<ModalProps, 'title'> {
  visible: boolean
  /** Inicializamos el form con estos valores */
  initialValues: PageValues
  onCancel: () => void
  /** Se dispara al hacer click en “Guardar” */
  onUpdate: (values: PageValues) => void
   /** Prop para validar existencia de paginas */
  existingPages: PageValues[] 
}

const PageEditModal: FC<PageEditModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onUpdate,
  existingPages,
  ...modalProps
}) => {
  const [form] = Form.useForm<PageValues>()

  const handleFinish = (values: PageValues) => {
    onUpdate(values)
    form.resetFields()
    onCancel()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

    useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [visible, initialValues])


  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Edición de Página"
      width={500}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={undefined}
      >
        <div className="grid grid-cols-1 gap-0 px-6 py-4">
          
          {/* Secuencia */}
          <Form.Item
            label="Secuencia"
            name="sequence"
            rules={[
              { required: true, message: 'Por favor ingresa la secuencia' },
              {
                // ⚠️ aquí va el validator correcto:
                validator: (_rule, value: number) => {
                  // buscamos conflicto con cualquier otra página (mismo sequence distinto title)
                  const conflict = existingPages.find(
                    p => p.sequence === value && p.title !== initialValues.title
                  )
                  if (conflict) {
                    return Promise.reject(
                      new Error(`La secuencia ${value} ya está en uso por "${conflict.title}"`)
                    )
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          {/* Descripción */}
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: 'Por favor ingresa la descripción' }]}
          >
            <Input />
          </Form.Item>

          {/* Título */}
          <Form.Item
            label="Título"
            name="title"
            rules={[{ required: true, message: 'Por favor ingresa el título' }]}
            initialValue={""}
          >
            <Input />
          </Form.Item>

          {/* Color de fondo */}
          <Form.Item label="Color Fondo" name="bgColor">
            <Input
              type="color"
              className="h-8 w-full p-0"
            />
          </Form.Item>

          {/* Color de texto */}
          <Form.Item label="Color Texto" name="textColor">
            <Input
              type="color"
              className="h-8 w-full p-0"
            />
          </Form.Item>
        </div>

        {/* Botones */}
        <div className="flex justify-end px-6 gap-4 space-x-4">
          <Button onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </BaseModal>
  )
}

export default PageEditModal
