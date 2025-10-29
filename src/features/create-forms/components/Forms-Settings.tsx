import { useEffect, useMemo, useState } from "react";

import { DiffOutlined, DownOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Modal } from "antd";

import { useDeletePagina } from "../hooks/useDeletePagina";
import { FieldJson } from "../types";
import PageEditModal, { PageValues } from "./PageEditModal";

interface PageSettingsProps {
  onPageChange?: (page: PageValues) => void;
  onPageDeleted?: (deletedId: string) => void;
  pages: PageValues[];
  pageId?: string;
  formId?: string | number;
  compiledList: FieldJson[];
  currentPage?: PageValues;
}

const PageSettings: React.FC<PageSettingsProps> = ({
  onPageChange,
  onPageDeleted,
  pages,
  pageId,
  formId,
  compiledList,
  currentPage,
}) => {
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSeq, setSelectedSeq] = useState<number | undefined>(undefined);

  const [editPageModalVisible, setEditPageModalVisible] = useState(false); // editar 👈

  const selectedPage = useMemo(
    () => pages.find((p) => p.sequence === selectedSeq),
    [pages, selectedSeq]
  );

  // Solo un estado para el ID seleccionado
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    undefined
  );

  // const { mutateAsync: postCamposBulk, isPending: sendingBulk } =
  //   usePostCamposActualBatch();

  // const { mutateAsync: patchCamposBulk, isPending: patchingBulk } =
  //   usePatchCamposActualBatch();

  const { mutateAsync: deletePagina, isPending: deletingPagina } =
    useDeletePagina();

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

  const handleEditClick = () => {
    if (!selectedPage) {
      message.warning("No hay una página seleccionada para editar.");
      return;
    }
    setEditPageModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      message.error("No se pudo identificar la página a eliminar.");
      return;
    }

    console.warn("Eliminando página con ID:", selectedId);

    const confirmed = await new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: "¿Eliminar esta página?",
        content: "Esta acción no se puede deshacer.",
        okText: "Sí, eliminar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) return;

    try {
      message.loading({ content: "Eliminando página...", key: "delete" });

      await deletePagina({ pageId: String(selectedId) });

      message.success({
        content: "Página eliminada correctamente ✅",
        key: "delete",
        duration: 2, // ⏱ visible 2 segundos
      });

      // Limpia estados
      setSelectedSeq(undefined);
      setSelectedId(undefined);

      onPageDeleted?.(String(selectedId));

      // Notifica al padre
      onPageChange?.({ id: "", title: "", description: "", sequence: 0 });
    } catch (err) {
      console.error("Error al eliminar página:", err);
      message.error({
        content: "Error al eliminar la página ❌",
        key: "delete",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-sm mt-7">
      {/* Header */}
      <div className="flex flex-col border-b">
        <div className="flex items-center px-4 py-3">
          <h3 className="ml-2 text-lg font-medium pr-14">Página</h3>
          <div className="flex flex-row gap-1">
            <Button
              onClick={handleIconClick}
              className="p-1 rounded hover:bg-gray-100 transition"
            >
              <DiffOutlined />
            </Button>
            <Button
              onClick={handleEditClick}
              className="p-1 rounded hover:bg-gray-100 transition"
            >
              <FormOutlined />
            </Button>
          </div>
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
        initialValues={undefined}
        onCancel={handleCancel}
        onUpdate={() => setPageModalVisible(false)}
        existingPages={pages}
        formId={formId !== undefined ? String(formId) : undefined}
      />

      <PageEditModal
        title="Edición de Página"
        visible={editPageModalVisible}
        initialValues={selectedPage}
        onCancel={() => setEditPageModalVisible(false)}
        onUpdate={(updatedValues) => {
          // 👇 aquí decides cómo guardar la edición
          message.success("Página actualizada correctamente ✅");
          setEditPageModalVisible(false);

          // Opcionalmente actualizas el array `pages`
          // si quieres reflejar el cambio en la UI
          // Ejemplo:
          // setPages((prev) =>
          //   prev.map((p) =>
          //     p.id === updatedValues.id ? { ...p, ...updatedValues } : p
          //   )
          // );
        }}
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
      <div className="flex justify-center gap-3 px-4 py-3 border-t space-x-2">
        <Button danger onClick={handleDelete} loading={deletingPagina}>
          ELIMINAR
        </Button>
        {/* <Tooltip
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
        </Tooltip> */}
      </div>
    </div>
  );
};

export default PageSettings;
