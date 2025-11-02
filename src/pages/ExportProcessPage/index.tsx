// src/pages/AssignmentsProgressPage.tsx
import React, { useMemo, useState } from "react";

import { DownloadOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import FlatTables from "@/components/FlatTables";
import ExportAllModal from "@/features/export-data/components/ExportAllModal";
import ExportSingleModal from "@/features/export-data/components/ExportSingleModal";
import { useEntries } from "@/features/export-data/hooks/useEntries";

import { filterEntries } from "./data";
import { ExportProcessPage } from "./types";

type TabKey = "in-process" | "auth";

const statusCategories = [
  { key: "pending", name: "En espera" },
  { key: "approved", name: "Aprobados" },
  { key: "rejected", name: "Rechazados" },
];

const buildCategorized = (entries: ExportProcessPage[]) =>
  statusCategories.map((cat) => ({
    key: cat.key,
    name: cat.name,
    // Si necesitas lógica específica para categorizar, cámbiala aquí
    items: entries,
  }));

const ExportProcessPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("in-process");
  const [search, setSearch] = useState("");

  const { data: entries = [], isLoading, isError } = useEntries();

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Transformamos los datos de la API a lo que tu tabla espera
  const mappedEntries: ExportProcessPage[] = entries.map((item) => ({
    key: item.form_id,
    formulario: item.form_name,
    respuestas: item.respuestas,
  }));

  const filtered = useMemo(
    () => filterEntries(mappedEntries, search),
    [mappedEntries, search]
  );

  const categorized = useMemo(() => buildCategorized(filtered), [filtered]);

  const handleTableChange: TableProps<ExportProcessPage>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Tabla cambió:", { pagination, filters, sorter });
  };

  const handleExport = (entry: ExportProcessPage) => {
    setSelectedFormId(entry.key);
    setShowSingleModal(true);
  };

  const handleExportAll = () => {
    setShowAllModal(true);
  };

  const columns: ColumnsType<ExportProcessPage> = [
    { title: "ID de Formulario", dataIndex: "key", key: "key" },
    {
      title: "Nombre del Formulario",
      dataIndex: "formulario",
      key: "formulario",
    },
    { title: "Respuestas", dataIndex: "respuestas", key: "respuestas" },
    {
      title: "Exportar",
      key: "export",
      render: (_, record) => (
        <Tooltip title="Exportar formulario">
          <ExportOutlined
            style={{ cursor: "pointer", fontSize: 18 }}
            onClick={() => handleExport(record)}
          />
        </Tooltip>
      ),
      width: 100,
    },
  ];

  if (isLoading) return <div className="p-4">Cargando formularios...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Error al cargar formularios</div>;

  return (
    <div className="flex flex-col w-full h-full gap-0">
      {/* Barra superior */}
      <div className="flex items-center justify-between max-w-lg m-4 gap-10">
        <Input
          placeholder="Introduzca el texto a buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportAll}
        >
          Exportar todo
        </Button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {activeTab === "in-process" && (
          <div className="border-1 border-gray-200">
            <FlatTables<ExportProcessPage>
              data={categorized.filter((cat) => cat.key === "pending")}
              columns={columns}
              onTableChange={handleTableChange}
            />
          </div>
        )}
      </div>

      {/* 🔹 Modal de exportación individual */}
      <ExportSingleModal
        visible={showSingleModal}
        onCancel={() => {
          setShowSingleModal(false);
          setSelectedFormId(null);
        }}
        formId={selectedFormId ?? ""}
      />

      {/* 🔹 Modal de exportación total */}
      <ExportAllModal
        visible={showAllModal}
        onCancel={() => setShowAllModal(false)}
      />
    </div>
  );
};

export default ExportProcessPages;
