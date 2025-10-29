// src/components/PageEditModal.tsx
import { FC, useEffect } from "react";

import { Button, Form, Input, message, type ModalProps } from "antd";

import BaseModal from "@/components/BaseModal";

import { useCreatePagina } from "../hooks/useCreatePage";
import { usePatchPagina } from "../hooks/usePatchPagina";

/** Forma de los datos de página */
export interface PageValues {
  id?: string | number;
  sequence: number;
  description: string;
  title: string;
}

/** Props del modal */
export interface PageEditModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  /** Inicializamos el form con estos valores */
  initialValues?: PageValues;
  onCancel: () => void;
  /** Se dispara al hacer click en “Guardar” */
  onUpdate: (values: PageValues) => void;
  title?: string;
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
  title = "Creación de Página",
  ...modalProps
}) => {
  const [form] = Form.useForm<PageValues>();

  const { mutate: createPage, isPending, error } = useCreatePagina(formId!);
  const { mutate: patchPage, isPending: patching } = usePatchPagina();

  const isEditMode = Boolean(initialValues?.id);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        title: initialValues.title ?? "",
        description: initialValues.description ?? "",
        sequence: initialValues.sequence ?? 1,
        id: initialValues.id,
      });
    } else if (visible && !initialValues) {
      form.resetFields(); // modo creación, limpia todo
    }
  }, [visible, initialValues, form]);

  // const handleFinish = (values: PageValues) => {
  //   onUpdate(values);
  //   form.resetFields();
  //   onCancel();
  // };

  // En tu componente PageEditModal, cambia la función mapToDto:
  function mapToDto(values: PageValues) {
    return {
      description: values?.description?.trim() ?? "",
      title: values.title.trim(),
    };
  }

  const handleFinish = (values: PageValues) => {
    if (!values.title?.trim()) {
      message.warning("El título es obligatorio.");
      return;
    }

    // 🔵 MODO EDICIÓN
    if (isEditMode && initialValues?.id) {
      patchPage(
        {
          pageId: String(initialValues.id),
          payload: mapToDto(values),
        },
        {
          onSuccess: (resp) => {
            const pagina = resp.pagina ?? ({} as any);

            const updatedPage: PageValues = {
              id: pagina.id ?? String(initialValues.id),
              sequence: pagina.secuencia ?? values.sequence,
              title: pagina.nombre ?? values.title,
              description: pagina.descripcion ?? values.description,
            };

            message.success("Página actualizada correctamente ✅");
            onUpdate(updatedPage);
            form.resetFields();
            onCancel();
          },
          onError: (err: any) => {
            console.error("Error al actualizar:", err);
            message.error(err?.message ?? "No se pudo actualizar la página ❌");
          },
        }
      );
      return;
    }

    // 🟢 MODO CREACIÓN
    createPage(mapToDto(values), {
      onSuccess: (data: any) => {
        const newId =
          data?.id_pagina ??
          data?.pagina?.id_pagina ??
          data?.pagina?.id ??
          null;

        if (!newId) {
          console.warn("⚠️ Respuesta sin id de página:", data);
          message.warning("Se creó la página, pero no llegó el ID.");
        }

        const nuevaPagina: PageValues = {
          id: String(newId ?? values.id ?? ""),
          sequence: data?.pagina?.secuencia ?? values.sequence,
          title: data?.pagina?.nombre ?? values.title,
          description: data?.pagina?.descripcion ?? values.description,
        };

        message.success("Página creada correctamente ✅");
        onUpdate(nuevaPagina);
        form.resetFields();
        onCancel();
      },

      onError: (err: any) => {
        console.warn("error.mesg: ", err?.message);
        message.error(
          err?.message ?? "No se pudo crear la página. Intenta de nuevo."
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
      title={title}
      width={500}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        preserve={false}
      >
        <div className="grid grid-cols-1 gap-0 px-6 py-4">
          {/* Secuencia */}
          {/* <Form.Item
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
          </Form.Item> */}

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
          <Form.Item label="Descripción" name="description" className="h-1/2">
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
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending || patching}
          >
            Guardar
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default PageEditModal;
