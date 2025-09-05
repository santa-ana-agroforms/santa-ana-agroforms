// src/components/NewCategoryModal.tsx
import { FC, useEffect } from "react";

import { Button, Form, Input, message, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";
// Puedes ubicar este hook donde lo tengas. Aquí asumo que está junto a useCategorias:
import { useCreateCategoria } from "@/features/forms-list/hooks/useCategorias";

export interface NewCategoryValues {
  nombre: string;
  descripcion: string;
}

export interface NewCategoryModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al hacer submit (si el padre quiere reaccionar). */
  onCreate?: (values: NewCategoryValues) => void;
  initialValues?: Partial<NewCategoryValues>;
}

const NewCategoryModal: FC<NewCategoryModalProps> = ({
  visible,
  onCancel,
  onCreate,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm<NewCategoryValues>();

  // Mutación: crear categoría
  const { mutate: createCategoria, isPending } = useCreateCategoria?.() ?? {
    mutate: (_dto: any, _opts: any) => {},
    isPending: false,
  };

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  function mapToDto(v: NewCategoryValues) {
    return {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion?.trim() ?? "",
    };
  }

  const handleFinish = (values: NewCategoryValues) => {
    if (!values.nombre?.trim()) {
      message.warning("El nombre es obligatorio.");
      return;
    }

    createCategoria(mapToDto(values), {
      onSuccess: () => {
        message.success("Categoría creada");
        onCreate?.(values);
        form.resetFields();
        onCancel();
      },
      onError: (err: any) => {
        message.error(
          err?.message ?? "No se pudo crear la categoría. Intenta de nuevo."
        );
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Nueva Categoría"
      width={560}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ nombre: "", descripcion: "" }}
      >
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
        >
          <Input placeholder="Nombre de la categoría" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: "Por favor ingresa una descripción" },
          ]}
        >
          <Input.TextArea placeholder="Descripción de la categoría" rows={4} />
        </Form.Item>

        <div className="flex justify-end">
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" loading={isPending}>
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

export default NewCategoryModal;
