// src/pages/AssignmentsProgressPage.tsx
import React, { useMemo, useState } from "react";

import { DeleteOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Tooltip, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import FlatTables from "@/components/FlatTables";

import { filterEntries } from "./data";
import { ExportProcessPage } from "./types";

type TabKey = "in-process" | "auth";

const statusCategories = [
  { key: "pending", name: "En espera" },
  { key: "approved", name: "Aprobados" },
  { key: "rejected", name: "Rechazados" },
];

const mockEntries: ExportProcessPage[] = [
  {
    key: "1",
    formulario: "Flujo Lineal",
    intervalo: "5 min",
    servidor: "Servidor A",
    baseDatos: "BD_Produccion",
    ultimoId: 101,
    ultima_actualizacion: "2025-08-01 12:00",
    ultimo_mensaje: "Proceso completado correctamente",
  },
  {
    key: "2",
    formulario: "Prueba",
    intervalo: "10 min",
    servidor: "Servidor B",
    baseDatos: "BD_Pruebas",
    ultimoId: 58,
    ultima_actualizacion: "2025-08-02 09:30",
    ultimo_mensaje: "Sin errores detectados",
  },
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

  const filtered = useMemo(() => filterEntries(mockEntries, search), [search]);

  const categorized = useMemo(() => buildCategorized(filtered), [filtered]);

  const handleTableChange: TableProps<ExportProcessPage>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Tabla cambió:", { pagination, filters, sorter });
  };

  const handleApprove = (entry: ExportProcessPage) => {
    console.log("Aprobar", entry);
  };
  const handleReject = (entry: ExportProcessPage) => {
    console.log("Rechazar", entry);
  };
  const handleComment = (entry: ExportProcessPage) => {
    console.log("Comentario", entry);
  };

  const columns: ColumnsType<ExportProcessPage> = [
    {
      title: (
        <Tooltip title="Agregar">
          <PlusOutlined />
        </Tooltip>
      ),
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Re-enviar notificación">
            <FormOutlined />
          </Tooltip>
          <Tooltip title="Eliminar">
            <DeleteOutlined />
          </Tooltip>
        </div>
      ),
      width: 100,
    },
    { title: "Formulario", dataIndex: "formulario", key: "formulario" },
    { title: "Intervalo", dataIndex: "intervalo", key: "intervalo" },
    { title: "Servidor", dataIndex: "servidor", key: "servidor" },
    { title: "Base de Datos", dataIndex: "baseDatos", key: "baseDatos" },
    { title: "Último ID", dataIndex: "ultimoId", key: "ultimoId" },
    {
      title: "Última Actualización",
      dataIndex: "ultima_actualizacion",
      key: "ultima_actualizacion",
    },
    {
      title: "Último Mensaje",
      dataIndex: "ultimo_mensaje",
      key: "ultimo_mensaje",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-0">
      {/* Barra de búsqueda */}
      <Input
        placeholder="Introduzca el texto a buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-lg m-4"
        allowClear
      />

      {/* Contenido */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {activeTab === "auth" && <></>}

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
    </div>
  );
};

export default ExportProcessPages;
