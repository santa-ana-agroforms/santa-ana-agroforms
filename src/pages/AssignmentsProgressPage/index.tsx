// src/pages/AssignmentsProgressPage.tsx
import React, { useState } from "react";

import { Button } from "antd";

import FormAssignment, {
  FormAssignmentValues,
  OptionType,
} from "@/features/form-assignment";

const formularios: OptionType[] = [
  { value: "form1", label: "Formulario 1" },
  { value: "form2", label: "Formulario 2" },
  // …
];

const usuarios: OptionType[] = [
  { value: "user1", label: "Usuario A" },
  { value: "user2", label: "Usuario B" },
  // …
];

type TabKey = "in-process" | "auth";

const AssignmentsProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("in-process");

  const handleAssign = (data: FormAssignmentValues) => {
    console.log("Asignado:", data);
    // tu lógica…
  };

  const handlePrefill = () => {
    console.log("Prellenar solicitud");
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ─── Tabs ───────────────────────────────────────────── */}
      <div className="flex border-b border-gray-300 ">
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

      {/* ─── Contenido ─────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "in-process" && (
          <FormAssignment
            formularios={formularios}
            usuarios={usuarios}
            onAssign={handleAssign}
            onPrefill={handlePrefill}
          />
        )}
        {activeTab === "auth" && (
          <div>
            {/* Aquí tu lista o componente de autorizaciones/rechazos */}
            <p>Listado de autorizaciones y rechazos en proceso…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsProgressPage;
