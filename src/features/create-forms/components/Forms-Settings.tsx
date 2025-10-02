import { useEffect, useMemo, useState } from "react";

import { DiffOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Tooltip } from "antd";

import { usePostCamposActualBatch } from "../hooks/useCampoActual";
import { FieldJson } from "../types";
import PageEditModal, { PageValues } from "./PageEditModal";

interface PageSettingsProps {
  onPageChange?: (page: PageValues) => void;
  pages: PageValues[];
  pageId?: string;
  formId?: string | number;
  compiledList: FieldJson[];
  currentPage?: PageValues;
}

const PageSettings: React.FC<PageSettingsProps> = ({
  onPageChange,
  pages,
  pageId,
  formId,
  compiledList,
  currentPage,
}) => {
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSeq, setSelectedSeq] = useState<number | undefined>(undefined);

  const selectedPage = useMemo(
    () => pages.find((p) => p.sequence === selectedSeq),
    [pages, selectedSeq]
  );

  // Solo un estado para el ID seleccionado
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const { mutateAsync: postCamposBulk, isPending: sendingBulk } =
    usePostCamposActualBatch();

  // inicializar
  useEffect(() => {
    if (pages.length > 0 && !selectedSeq) {
      setSelectedSeq(pages[0].sequence);
    }
  }, [pages, selectedSeq]);

  // sincronizar con currentPage
  useEffect(() => {
    if (currentPage) {
      setSelectedSeq(currentPage.sequence);
    }
  }, [currentPage]);

  useEffect(() => {
    if (pages.length > 0) {
      const first = pages[0]; // siempre el primer elemento
      setSelectedId(first.id);
    }
  }, [pages]);

  const handlePageSelect = (seq: number) => {
    const selected = pages.find((p) => p.sequence === seq);
    if (selected) {
      onPageChange?.(selected); // ⬅️ avisa al padre
      setSelectedId(selected.id);
    }
    setDropdownOpen(false);
  };

  const handleIconClick = () => setPageModalVisible(true);
  const handleCancel = () => setPageModalVisible(false);

  const handleDelete = () => {
    console.log("Eliminar clicked");
  };


  const handleContinue = async () => {
    // console.warn("➡️ JSONs compilados (front):", compiledList);

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
        pageId: pageId as string,
        campos: compiledList,
      });


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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-gray-900">
                {selectedPage?.title || "Selecciona una página"}
              </span>
              <DownOutlined
                className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {pages.map((p) => (
                  <div
                    key={p.sequence}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedSeq === p.sequence ?
                        "bg-blue-50 text-blue-600"
                      : "text-gray-900"
                    }`}
                    onClick={() => handlePageSelect(p.sequence)}
                  >
                    {p.title}
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
          selectedPage ?? {
            sequence: 1,
            description: "",
            title: "",
          }
        }
        onCancel={handleCancel}
        onUpdate={() => setPageModalVisible(false)}
        existingPages={pages}
        formId={formId !== undefined ? String(formId) : undefined}
      />

      {/* Contenido */}
      <div className="px-4 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Secuencia</label>
          <InputNumber min={1} value={selectedPage?.sequence ?? ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Input value={selectedPage?.description ?? ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input value={selectedPage?.title ?? ""} disabled />
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
              disabled={compiledList.length === 0}
              loading={sendingBulk}
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
