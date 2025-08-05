// src/pages/AssignmentsProgressPage.tsx
import React, { useMemo, useState } from "react";

import { DeleteOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Tooltip, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import FlatTables from "@/components/FlatTables";

import { filterEntries } from "./data";
import { ApprovalTypes } from "./types";

type TabKey = "in-process" | "auth";

const statusCategories = [
  { key: "pending", name: "En espera" },
  { key: "approved", name: "Aprobados" },
  { key: "rejected", name: "Rechazados" },
];

const mockEntries: ApprovalTypes[] = [
  {
    key: "1",
    routeId: 12,
    descripcion: "Flujo Lineal",
    dataSet: "Flujo",
    campo1: "Campo1",
    campo2: "Campo2",
    addedDate: "04/11/2020",
    addedBy: "admin",
    active: true,
  },
  {
    key: "2",
    routeId: 7,
    descripcion: "Prueba",
    dataSet: "",
    campo1: "",
    campo2: "",
    addedDate: "14/11/2019",
    addedBy: "admin",
    active: true,
  },
];

const buildCategorized = (entries: ApprovalTypes[]) =>
  statusCategories.map((cat) => ({
    key: cat.key,
    name: cat.name,
    items: entries.filter((e) => e.active === true),
  }));

const ApprovalRoutesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("in-process");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterEntries(mockEntries, search), [search]);

  const categorized = useMemo(() => buildCategorized(filtered), [filtered]);

  const handleTableChange: TableProps<ApprovalTypes>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Tabla cambió:", { pagination, filters, sorter });
  };

  const handleApprove = (entry: ApprovalTypes) => {
    console.log("Aprobar", entry);
  };
  const handleReject = (entry: ApprovalTypes) => {
    console.log("Rechazar", entry);
  };
  const handleComment = (entry: ApprovalTypes) => {
    console.log("Comentario", entry);
  };

  const columns: ColumnsType<ApprovalTypes> = [
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
          <Tooltip title="Aprobar">
            <DeleteOutlined />
          </Tooltip>
        </div>
      ),
      width: 100,
    },
    { title: "Route Id", dataIndex: "routeId", key: "routeId" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Dataset", dataIndex: "dataSet", key: "dataSet" },
    { title: "Campo 1", dataIndex: "campo1", key: "campo1" },
    { title: "Campo 2", dataIndex: "campo2", key: "campo2" },
    {
      title: "Activo",
      dataIndex: "active",
      key: "active",
      render: (val) => (val ? "Sí" : "No"),
    },
    { title: "Added date", dataIndex: "addedDate", key: "addedDate" },
    { title: "Added by", dataIndex: "addedBy", key: "addedBy" },
    { title: "Changed date", dataIndex: "changedDate", key: "changedDate" },
    { title: "Changed user", dataIndex: "changedBy", key: "changedBy" },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-0">
      {/* Search bar como en la captura */}
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
            <FlatTables<ApprovalTypes>
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

export default ApprovalRoutesPage;
