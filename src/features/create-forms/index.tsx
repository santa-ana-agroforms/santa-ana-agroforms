// src/components/CreateForms.tsx
import React, { useState } from "react";

import { FieldFormValues, VariantType } from "./components/EditFieldModal";
import FormElementsList from "./components/FormElementList";
import PageSettings from "./components/Forms-Settings";
import { PageValues } from "./components/PageEditModal";
import PhoneMockup from "./components/PhoneMockup";

interface CreateFormsProps {
  formId: string | number;
  onBack: () => void;
}

export type ElementItem = {
  type: string;
  name: string;
  group?: string;
  variant?: VariantType; // el tipo exacto que se abrió en el modal
  values?: Partial<FieldFormValues>;
};

const CreateForms: React.FC<CreateFormsProps> = ({ formId, onBack }) => {
  const [keyName, setKeyName] = useState("");
  const [groups, setGroups] = useState<string[]>([]);

  const [elementsByPage, setElementsByPage] = useState<
    Record<number, ElementItem[]>
  >({});

  // 🔴 nuevo: estado del modal de edición
  const [editOpen, setEditOpen] = useState(false);
  const [editInitialValues, setEditInitialValues] = useState<
    Partial<FieldFormValues> | undefined
  >(undefined);
  const [editVariant, setEditVariant] = useState<VariantType | undefined>(
    undefined
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddElement = (
    key: string,
    keyType?: string,
    groupName?: string,
    values?: FieldFormValues
  ) => {
    setElementsByPage((prev) => {
      const pageKey = selectedPage.sequence;
      const prevList = prev[pageKey] ?? [];
      const next: ElementItem = {
        type: keyType ?? key,
        name: keyType === "grupo" ? (values?.nombre ?? key) : key, // nombre del grupo o del campo
        group: groupName,
        variant: (keyType ?? key) as VariantType,
        values,
      };
      return { ...prev, [pageKey]: [...prevList, next] };
    });

    if (keyType === "grupo") {
      const groupToAdd = values?.nombre ?? key;
      setGroups((prev) =>
        prev.includes(groupToAdd) ? prev : [...prev, groupToAdd]
      );
    }
  };

  // 🟢 abrir modal en modo edición (desde PhoneMockup)
  const handleEditElementRequest = (index: number) => {
    const el = currentElements[index];
    if (!el) return;
    setEditIndex(index);
    setEditVariant(el.variant || (el.type as VariantType));
    setEditInitialValues({
      ...el.values,
      nombre: el.name,
      grupo: el.group,
    });
    setEditOpen(true);
  };

  // 🟢 guardar cambios del modal de edición y actualizar el elemento
  const handleEditSave = (vals: FieldFormValues) => {
    const pageKey = selectedPage.sequence;
    setElementsByPage((prev) => {
      const list = [...(prev[pageKey] ?? [])];
      if (editIndex != null && list[editIndex]) {
        const prevEl = list[editIndex];
        list[editIndex] = {
          ...prevEl,
          name: vals.nombre ?? prevEl.name,
          group: vals.grupo ?? prevEl.group,
          values: { ...prevEl.values, ...vals }, // merge
        };
      }
      return { ...prev, [pageKey]: list };
    });

    // si cambió el nombre de un grupo, lo añadimos a la lista si no existe
    if (editVariant === "grupo" && vals.nombre) {
      setGroups((gs) => (gs.includes(vals.nombre) ? gs : [...gs, vals.nombre]));
    }

    setEditOpen(false);
    setEditIndex(null);
    setEditInitialValues(undefined);
    setEditVariant(undefined);
  };

  const [selectedPage, setSelectedPage] = useState<PageValues>({
    sequence: 1,
    description: "Generales",
    title: "Generales",
    //bgColor: "#FFFFFF",
    //textColor: "#000000",
  });

  const currentElements = elementsByPage[selectedPage.sequence] ?? [];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar con la lista de elementos */}
      <div className="w-64 bg-white border-r">
        <FormElementsList
          onSelect={handleAddElement}
          groupsList={groups}
          editOpen={editOpen}
          initialValues={editInitialValues}
          editVariant={editVariant}
          handleClose={handleEditSave}
          onEditCancel={() => setEditOpen(false)}
        />
      </div>

      {/* Zona del “mockup” */}
      <div className="flex-1 flex justify-center items-start p-6 ">
        {/* 
          Asumimos que tu PhoneMockup admite ahora una prop 
          `selectedElement: string | null`
          para mostrar el input/form que corresponda. 
        */}
        <PhoneMockup
          formId={formId}
          onBack={onBack}
          selectedElements={currentElements}
          selectedPage={selectedPage}
          onEditElement={handleEditElementRequest}
        />
      </div>

      <div>
        <PageSettings onPageChange={setSelectedPage} formId={String(formId)} />
      </div>
    </div>
  );
};

export default CreateForms;
