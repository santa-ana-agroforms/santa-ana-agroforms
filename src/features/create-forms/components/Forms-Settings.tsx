// src/components/PageSettings.tsx
import React, { useEffect, useMemo, useState } from "react";

import { DiffOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Tooltip } from "antd";

import { usePostCamposActualBatch } from "../hooks/useCampoActual";
import { usePaginas } from "../hooks/usePaginas";
import { FieldJson } from "../types";
import PageEditModal, { PageValues } from "./PageEditModal";

interface PageSettingsProps {
  onPageChange?: (page: PageValues) => void;
  onPagesChange?: (pages: PageValues[]) => void;
  formId?: string;
  compiledList: FieldJson[];
  currentPage?: PageValues;
}

const PageSettings: React.FC<PageSettingsProps> = ({
  onPageChange,
  onPagesChange,
  formId,
  compiledList,
  currentPage,
}) => {
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: paginas, isLoading, error, refetch } = usePaginas(formId);

  console.warn("paginas: ", paginas);

  // Mutaciones
  const { mutateAsync: postCamposBulk, isPending: sendingBulk } =
    usePostCamposActualBatch();

  // Solo un estado para el ID seleccionado
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

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

  // 1. Inicializar con la primera página cuando lleguen los datos
  useEffect(() => {
    if (paginas && paginas.length > 0 && !selectedId) {
      setSelectedId(paginas[0].id);
    }
  }, [paginas, selectedId]);

  // 2. Sincronizar cuando cambie currentPage (navegación externa)
  useEffect(() => {
    if (currentPage && paginas) {
      const match = paginas.find((p) => p.secuencia === currentPage.sequence);
      if (match) {
        console.log(
          "🔄 Actualizando selectedId por currentPage:",
          match.nombre
        );
        setSelectedId(match.id);
      }
    }
  }, [currentPage, paginas]);

  // 3. Notificar cambios al componente padre
  useEffect(() => {
    if (selectedPage) {
      onPageChange?.(mapToPageValues(selectedPage));
    }
  }, [selectedPage, onPageChange]);

  useMemo(() => {
    if (paginas) {
      onPagesChange?.(
        paginas.map((p) => ({
          sequence: p.secuencia,
          description: p.descripcion,
          title: p.nombre,
        }))
      );
    }
  }, [paginas, onPagesChange]);

  // Handler del dropdown personalizado
  const handlePageSelect = (pageId: string) => {
    console.log("👆 Usuario seleccionó página:", pageId);
    setSelectedId(pageId);
    setDropdownOpen(false);
  };

  const handleIconClick = () => setPageModalVisible(true);
  const handleCancel = () => setPageModalVisible(false);

  const handleUpdate = async (_values: PageValues) => {
    setPageModalVisible(false);
    await refetch();
  };

  const handleDelete = () => {
    console.log("Eliminar clicked");
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleContinue = async () => {
    console.warn("➡️ JSONs compilados (front):", compiledList);

    if (compiledList.length === 0) {
      message.warning("¡Necesitas seleccionar al menos un campo! ⚠️");
      return;
    }

    if (!selectedId) {
      console.warn("⚠️ No hay pageId: no se puede enviar al backend.");
      message.error("No se pudo identificar la página actual (pageId).");
      return;
    }

    try {
      const { ok, errors } = await postCamposBulk({
        pageId: selectedId,
        campos: compiledList,
      });

      console.warn("🌐 Resultados envío:", { ok, errors });

      if (errors.length) {
        message.error(
          `Algunos campos fallaron (${errors.length}). Revisa la consola.`
        );
      } else {
        message.success("Campos enviados correctamente.");
      }
    } catch (e) {
      console.error("❌ Error al enviar campos:", e);
      message.error("Error al enviar campos al backend.");
    }
  };

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

        {/* Custom Dropdown Selector */}
        <div className="w-full px-4 pb-4">
          <div className="relative">
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-gray-900">
                {selectedPage?.nombre || "Selecciona una página"}
              </span>
              <DownOutlined
                className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {paginas?.map((p) => (
                  <div
                    key={p.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedId === p.id ?
                        "bg-blue-50 text-blue-600"
                      : "text-gray-900"
                    }`}
                    onClick={() => handlePageSelect(p.id)}
                  >
                    {p.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PageEditModal
        visible={pageModalVisible}
        initialValues={
          selectedPage ?
            {
              id: selectedPage.id,
              secuencia: selectedPage.secuencia,
              descripcion: selectedPage.descripcion,
              nombre: selectedPage.nombre,
            }
          : {
              id: "",
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
        <Tooltip
          title={
            compiledList.length === 0 ?
              "Debes seleccionar un campo para guardar"
            : ""
          }
        >
          <span>
            <Button
              type="primary"
              onClick={handleContinue}
              loading={sendingBulk}
              disabled={sendingBulk || compiledList.length === 0}
            >
              GUARDAR
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default PageSettings;
