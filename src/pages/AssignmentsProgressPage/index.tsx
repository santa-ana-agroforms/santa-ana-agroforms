// src/pages/AssignmentsProgressPage.tsx
import React, { useMemo, useState } from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Input, Tooltip, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import FlatTables from "@/components/FlatTables";

import { filterEntries } from "./data";
import { AuthorizationEntry } from "./types";

type TabKey = "in-process" | "auth";

const statusCategories = [
  { key: "pending", name: "En espera" },
  { key: "approved", name: "Aprobados" },
  { key: "rejected", name: "Rechazados" },
];

// mock data igual que antes
const mockEntries: AuthorizationEntry[] = [
  {
    key: "1",
    user: "user2",
    form: "Viaje",
    status: "pending",
    startedAt: "15/02 10:53",
    finishedAt: "15/02 10:54",
    receivedAt: "15/02 10:54",
    userFrom: "admin",
    title: "Autorizar Viaje",
    notes: "",
  },
  {
    key: "2",
    user: "user2",
    form: "Viaje",
    status: "approved",
    startedAt: "15/02 09:00",
    finishedAt: "15/02 09:01",
    receivedAt: "15/02 09:01",
    userFrom: "admin",
    title: "Autorizar Viaje",
    notes: "",
  },
];

const buildCategorized = (entries: AuthorizationEntry[]) =>
  statusCategories.map((cat) => ({
    key: cat.key,
    name: cat.name,
    items: entries.filter(
      (e) => e.status === (cat.key as AuthorizationEntry["status"])
    ),
  }));

const AssignmentsProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("in-process");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterEntries(mockEntries, search), [search]);

  const categorized = useMemo(() => buildCategorized(filtered), [filtered]);

  const handleTableChange: TableProps<AuthorizationEntry>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Tabla cambió:", { pagination, filters, sorter });
  };

  const handleApprove = (entry: AuthorizationEntry) => {
    console.log("Aprobar", entry);
  };
  const handleReject = (entry: AuthorizationEntry) => {
    console.log("Rechazar", entry);
  };
  const handleComment = (entry: AuthorizationEntry) => {
    console.log("Comentario", entry);
  };

  const columns: ColumnsType<AuthorizationEntry> = [
    {
      title: "#",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Re-enviar notificación">
            <MessageOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleComment(record)}
            />
          </Tooltip>
          <Tooltip title="Aprobar">
            <CheckCircleOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleApprove(record)}
            />
          </Tooltip>
          <Tooltip title="Rechazar">
            <CloseCircleOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleReject(record)}
            />
          </Tooltip>
        </div>
      ),
      width: 100,
    },
    { title: "Formulario", dataIndex: "form", key: "form" },
    { title: "Empezado", dataIndex: "startedAt", key: "startedAt" },
    { title: "Terminado", dataIndex: "finishedAt", key: "finishedAt" },
    { title: "Recibido", dataIndex: "receivedAt", key: "receivedAt" },
    { title: "UserId", dataIndex: "user", key: "user" },
    { title: "User From", dataIndex: "userFrom", key: "userFrom" },
    { title: "Título", dataIndex: "title", key: "title" },
    { title: "Notas", dataIndex: "notes", key: "notes" },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        <div
          className={`flex ${activeTab === "in-process" ? "border-t border-r border-gray-300 border-b-white" : ""}`}
        >
          <Button
            type="text"
            className={`px-6 flex border-t border-gray-700 py-2 -mb-px font-medium ${
              activeTab === "in-process" ?
                "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
            onClick={() => setActiveTab("in-process")}
          >
            En Proceso
          </Button>
        </div>

        <div
          className={`flex ${activeTab === "auth" ? "border-t border-r border-l border-gray-300 border-b-white" : ""}`}
        >
          <Button
            type="text"
            className={`px-6 py-2 -mb-px font-medium ${
              activeTab === "auth" ?
                "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
            }`}
            onClick={() => setActiveTab("auth")}
          >
            Autorizaciones/Rechazos
          </Button>
        </div>
      </div>

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
            <FlatTables<AuthorizationEntry>
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

export default AssignmentsProgressPage;
