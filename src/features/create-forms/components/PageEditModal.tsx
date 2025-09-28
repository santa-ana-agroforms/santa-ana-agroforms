// src/components/PageEditModal.tsx
import { FC } from "react";

import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  type ModalProps,
} from "antd";

import BaseModal from "@/components/BaseModal";

import { useCreatePagina } from "../hooks/useCreatePage";
import { type PaginaAPI } from "../services/pages.services";

/** Forma de los datos de página */
export interface PageValues {
  id?: string;
  sequence: number;
  description: string;
  title: string;
}

/** Props del modal */
export interface PageEditModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  /** Inicializamos el form con estos valores */
  initialValues: PaginaAPI;
  onCancel: () => void;
  /** Se dispara al hacer click en “Guardar” */
  onUpdate: (values: PageValues) => void;
  /** Prop para validar existencia de paginas */
  existingPages: PageValues[];
  formId?: string;
  isLoading?: boolean;
}

const PageEditModal: FC<PageEditModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onUpdate,
  existingPages,
  formId,
  isLoading,
  ...modalProps
}) => {
  const [form] = Form.useForm<PageValues>();

  const { mutate: createPage, isPending, error } = useCreatePagina(formId!);

  // const handleFinish = (values: PageValues) => {
  //   onUpdate(values);
  //   form.resetFields();
  //   onCancel();
  // };

  // En tu componente PageEditModal, cambia la función mapToDto:
  function mapToDto(values: PageValues) {
    return {
      sequence: values.sequence,
      description: values.description.trim(),
      title: values.title.trim(),
    };
  }

  const handleFinish = (values: PageValues) => {
    if (!values.title?.trim()) {
      message.warning("El título es obligatorio.");
      return;
    }

    if (!values.description?.trim()) {
      message.warning("La descripción es obligatoria.");
      return;
    }

    createPage(mapToDto(values), {
      onSuccess: () => {
        message.success("Página creada correctamente");
        onUpdate(values);
        form.resetFields();
        onCancel();
      },
      onError: (err: any) => {
        message.error(
          err?.message ?? "No se pudo actualizar la página. Intenta de nuevo."
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
      title="Creación de Página"
      width={500}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={undefined}
        preserve={false}
      >
        <div className="grid grid-cols-1 gap-0 px-6 py-4">
          {/* Secuencia */}
          <Form.Item
            label="Secuencia"
            name="sequence"
            rules={[
              { required: true, message: "Por favor ingresa la secuencia" },
              {
                // ⚠️ aquí va el validator correcto:
                validator: (_rule, value: number) => {
                  // buscamos conflicto con cualquier otra página (mismo sequence distinto title)
                  const conflict = existingPages.find(
                    (p) =>
                      p.sequence === value && p.title !== initialValues.nombre
                  );
                  if (conflict) {
                    return Promise.reject(
                      new Error(
                        `La secuencia ${value} ya está en uso por "${conflict.title}"`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          {/* Título */}
          <Form.Item
            label="Título"
            name="title"
            rules={[{ required: true, message: "Por favor ingresa el título" }]}
            initialValue={""}
          >
            <Input />
          </Form.Item>

          {/* Descripción */}
          <Form.Item
            label="Descripción"
            name="description"
            className="h-1/2"
            rules={[
              { required: true, message: "Por favor ingresa la descripción" },
            ]}
          >
            <Input.TextArea
              autoSize={false}
              rows={4}
              className="h-1/2 w-full resize-none"
              placeholder="Escribe la descripción..."
            />
          </Form.Item>
        </div>

        {/* Botones */}
        <div className="flex justify-end px-6 gap-4 space-x-4">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Guardar
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default PageEditModal;
