// src/components/EditCategoryModal.tsx
import { FC, useEffect } from "react";

import { Button, Form, Input, message, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";
import { useUpdateCategoria } from "@/features/forms-list/hooks/useFormularios";

// import { useUpdateCategoria } from "@/features/forms-list/hooks/useCategorias";

export interface EditCategoryValues {
  key: string;
  nombre: string;
  descripcion: string;
}

export interface EditCategoryModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  categoryId: string | undefined;
  onUpdate?: (values: EditCategoryValues) => void;
  initialValues: EditCategoryValues | undefined; // requerido
}

const EditCategoryModal: FC<EditCategoryModalProps> = ({
  visible,
  onCancel,
  onUpdate,
  categoryId,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm();
  const { mutate: editarCategoria, isPending } = useUpdateCategoria();

  const transformFormValues = {
    // De formulario a API
    toApi: (formValues: { name: string; descripcion: string }) => ({
      nombre: formValues.name,
      descripcion: formValues.descripcion,
    }),
    // De API a formulario
    toForm: (apiValues: { nombre: string; descripcion: string }) => ({
      name: apiValues.nombre,
      descripcion: apiValues.descripcion,
    }),
  };

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const onFinish = (values: { name: string; descripcion: string }) => {
    const apiPayload = transformFormValues.toApi(values);

    editarCategoria(
      { id: categoryId, payload: apiPayload },
      {
        onSuccess: () => message.success("Categoría actualizada correctamente"),
        onError: () => message.error("Error al actualizar categoría"),
      }
    );
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={onCancel}
      title="Editar Categoría"
      width={560}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
        >
          <Input placeholder="Nombre de la categoría" />
        </Form.Item>

        <div className="flex flex-row justify-end gap-5">
          <Button onClick={onCancel} loading={isPending}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Guardar cambios
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default EditCategoryModal;
