// src/pages/FormAssignmentPage.tsx
import React, { useState } from "react";

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

const FormAssignmentPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleAssign = (data: FormAssignmentValues) => {
    console.log("Asignado:", data);
    // tu lógica…
  };

  const handlePrefill = () => {
    // Ejemplo: cargar valores al form
    console.log("Prellenar solicitud");
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <FormAssignment
        onAssign={handleAssign}
        onPrefill={handlePrefill}
        formularios={formularios}
        usuarios={usuarios}
      />
    </div>
  );
};

export default FormAssignmentPage;
