// src/components/PageSettings.tsx
import React, { useEffect, useMemo, useState } from "react";

import { DiffOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select } from "antd";

import { useCreatePagina } from "../hooks/useCreatePage";
import { usePaginas } from "../hooks/usePaginas";
import PageEditModal, { PageValues } from "./PageEditModal";

interface PageSettingsProps {
  onIconClick?: () => void;
  onPageChange?: (page: PageValues) => void;
  formId?: string;
}

const { Option } = Select;

const PageSettings: React.FC<PageSettingsProps> = ({
  onIconClick,
  onPageChange,
  formId,
}) => {
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const { mutate: createPage, isPending } = useCreatePagina(formId!);
  const { data: paginas, isLoading, error } = usePaginas(formId);

  // Id de la página seleccionada en el Select
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Cuando llegan las páginas (o cambian), seleccionar la primera si no hay selección
  useEffect(() => {
    if (paginas && paginas.length > 0) {
      setSelectedId((prev) => prev ?? paginas[0].id);
    }
  }, [paginas]);

  // Página actualmente seleccionada (derivada de 'selectedId')
  const selectedPage = useMemo(
    () => paginas?.find((p) => p.id === selectedId),
    [paginas, selectedId]
  );

  // Mapeo opcional a tu tipo PageValues si onPageChange lo requiere
  const mapToPageValues = (p: any): PageValues => ({
    sequence: p.secuencia,
    description: p.descripcion,
    title: p.nombre,
  });

  // Notificar cambios al padre cuando cambia la página seleccionada
  useEffect(() => {
    if (selectedPage) onPageChange?.(mapToPageValues(selectedPage));
  }, [selectedPage, onPageChange]);

  const handleIconClick = () => setPageModalVisible(true);
  const handleCancel = () => setPageModalVisible(false);

  // Si tu modal edita/crea páginas locales, aquí podrías refrescar o mutar
  const handleUpdate = (_values: PageValues) => {
    setPageModalVisible(false);
    // Aquí podrías llamar a un invalidate de React Query o ajustar tu cache local
  };

  const handleDelete = () => {
    console.log("Eliminar clicked");
  };
  const handleSave = () => {
    console.log("Guardar clicked");
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg shadow max-w-sm mt-7">
      {/* Header */}
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
                value={selectedId}
                onChange={(value) => setSelectedId(value)}
                placeholder="Selecciona una página"
                loading={isLoading}
                allowClear={false}
              >
                {paginas?.map((p) => (
                  <Option key={p.id} value={p.id}>
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
          selectedPage ?
            {
              secuencia: selectedPage.secuencia,
              descripcion: selectedPage.descripcion,
              nombre: selectedPage.nombre,
            }
          : {
              secuencia: 1,
              descripcion: "",
              nombre: "",
            }
        }
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        existingPages={(paginas ?? []).map((p) => ({
          sequence: p.secuencia,
          description: p.descripcion,
          title: p.nombre,
        }))}
        formId={formId}
      />

      {/* Contenido del form (solo lectura, basado en la selección) */}
      <div className="px-4 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Secuencia</label>
          <InputNumber
            min={1}
            value={selectedPage?.secuencia ?? ""}
            className="w-full"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Input value={selectedPage?.descripcion ?? ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input value={selectedPage?.nombre ?? ""} disabled />
        </div>
      </div>

      {/* Footer */}
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
