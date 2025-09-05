// src/components/PageSettings.tsx
import React, { useEffect, useState } from "react";

import { DiffOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Select } from "antd";

import { useCreatePagina } from "../hooks/useCreatePage";
import { usePaginas } from "../hooks/usePaginas";
import PageEditModal, { PageValues } from "./PageEditModal";

interface PageSettingsProps {
  /** Callback cuando se presiona el icono */
  onIconClick?: () => void;
  /** Callback cuando se cambia de pagina */
  onPageChange?: (page: PageValues) => void;
  formId?: string;
}

const { Option } = Select;

const PageSettings: React.FC<PageSettingsProps> = ({
  onIconClick,
  onPageChange,
  formId,
}) => {
  const [sequence, setSequence] = useState(1);
  const [description, setDescription] = useState("Generales");
  const [title, setTitle] = useState("Generales");

  const [pageModalVisible, setPageModalVisible] = useState(false);
  const { mutate: createPage, isPending } = useCreatePagina(formId!);

  const { data: paginas, isLoading, error } = usePaginas(formId);

  const [pages, setPages] = useState<PageValues[]>([]);

  const handleDelete = () => {
    console.log("Eliminar clicked");
  };
  const handleSave = () => {
    console.log("Guardar clicked");
  };

  const handleIconClick = () => {
    setPageModalVisible(true);
  };

  const handleCancel = () => {
    setPageModalVisible(false);
  };

  const handleUpdate = (values: PageValues) => {
    setPageModalVisible(false);

    // Si ya existe, lo actualizas; si no, lo agregas
    setPages((prev) => {
      const exists = prev.find((p) => p.title === values.title);
      if (exists) {
        return prev.map((p) => (p.title === values.title ? values : p));
      }
      return [...prev, values];
    });

    (createPage({
      sequence: values.sequence,
      description: values.description,
      title: values.title,
      bump: true, // o false si no quieres crear nueva versión
    }),
      {
        onSuccess: () => {
          message.success(`Página "${values.title}" creada correctamente`);
        },
        onError: (err: any) => {
          message.error(
            err?.message ?? "No se pudo actualizar la página. Intenta de nuevo."
          );
        },
      });
  };

  useEffect(() => {
    const selectedPage = pages.find((p) => p.title === title);
    if (selectedPage) {
      setSequence(selectedPage.sequence);
      setDescription(selectedPage.description);
      setTitle(selectedPage.title);
      onPageChange?.(selectedPage);
    }
  }, [title, pages]);

  const selectedPageData = pages.find((p) => p.title === title) ?? pages[0];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.warn("Paginas:", paginas);

  return (
    <div className="bg-white rounded-lg shadow max-w-sm mt-7">
      {/* Header fijo con icono pressable */}
      <div className="flex flex-col border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            onClick={handleIconClick}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <DiffOutlined />
          </Button>
          <h3 className="ml-2 text-lg font-medium">Página</h3>
        </div>

        <div className="w-full px-4 items-center justify-center">
          <Form>
            <Form.Item name="estado">
              <Select
                value={
                  paginas && paginas.length !== 0 && paginas[0] !== null ?
                    paginas[0].nombre
                  : ""
                }
                onChange={setTitle}
                placeholder={
                  paginas && paginas.length !== 0 && paginas[0] !== null ?
                    paginas[0].nombre
                  : ""
                }
              >
                {paginas?.map((p) => (
                  <Option key={p.nombre} value={p.nombre}>
                    {p.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>

      <PageEditModal
        visible={pageModalVisible}
        initialValues={
          paginas && paginas.length > 0 ?
            paginas[0]
          : {
              secuencia: 1,
              descripcion: "",
              nombre: "",
            }
        }
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        existingPages={pages}
        formId={formId}
      />

      {/* Contenido del form */}
      <div className="px-4 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Secuencia</label>
          <InputNumber
            min={1}
            value={
              paginas && paginas.length !== 0 && paginas[0] !== null ?
                paginas[0].secuencia
              : ""
            }
            onChange={(value) => {
              if (typeof value === "number") setSequence(value);
            }}
            className="w-full"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Input
            value={
              paginas && paginas.length !== 0 && paginas[0] !== null ?
                paginas[0].descripcion
              : ""
            }
            onChange={(e) => setDescription(e.target.value)}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={
              paginas && paginas.length !== 0 && paginas[0] !== null ?
                paginas[0].nombre
              : ""
            }
            onChange={(e) => setTitle(e.target.value)}
            disabled
          />
        </div>

        {/*
        
        <div>
          <label className="block text-sm font-medium mb-1">Color Fondo</label>
          <Input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-8 p-0"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color Texto</label>
          <Input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-8 p-0"
            disabled
          />
        </div>
        
        */}
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end gap-3 px-4 py-3 border-t space-x-2">
        <Button danger onClick={handleDelete}>
          ELIMINAR
        </Button>
        <Button type="primary" onClick={handleSave}>
          GUARDAR
        </Button>
      </div>
    </div>
  );
};

export default PageSettings;
