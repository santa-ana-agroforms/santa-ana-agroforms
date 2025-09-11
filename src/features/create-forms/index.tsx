// src/components/CreateForms.tsx
import React, { useMemo, useState } from "react";

import { MenuProps } from "antd";

import EditFieldModal, {
  FieldFormValues,
  VariantType,
} from "./components/EditFieldModal";
import FormElementsList from "./components/FormElementList";
import PageSettings from "./components/Forms-Settings";
import { PageValues } from "./components/PageEditModal";
import PhoneMockup from "./components/PhoneMockup";
import { opciones } from "./components/utils";
import { FieldJson } from "./types";

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

  const [compiledByPage, setCompiledByPage] = useState<
    Record<number, FieldJson[]>
  >({});

  // EDITFIELDMODAL
  const [visible, setVisible] = useState(false);
  const [fieldData, setFieldData] = useState<Partial<FieldFormValues>>({});
  const [selectedKey, setSelectedKey] = useState<VariantType>();

  const handleSave = (vals: FieldFormValues) => {
    if (selectedKey) {
      handleAddElement(vals.nombre, selectedKey, undefined, vals);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    if (handleEditSave) {
      handleEditSave;
    }
  };

  /**
   * Recibe el JSON compilado desde EditFieldModal.
   * - Si estamos EDITANDO (editOpen && editIndex !== null), REEMPLAZA en el mismo índice.
   * - Si estamos CREANDO, AGREGA al final de la lista de la página actual.
   */
  const handleCompiled = (json: FieldJson) => {
    const pageKey = selectedPage.sequence;

    setCompiledByPage((prev) => {
      const list = [...(prev[pageKey] ?? [])];

      if (
        editOpen &&
        editIndex != null &&
        editIndex >= 0 &&
        editIndex < Math.max(list.length, currentElements.length)
      ) {
        // Si aún no hay un compilado en ese índice, rellena con undefineds hasta llegar
        while (list.length < currentElements.length)
          list.push(undefined as unknown as FieldJson);
        list[editIndex] = json;
      } else {
        // CREACIÓN: se apendea al final. (coincidirá con el elemento que se creará en handleSave)
        list.push(json);
      }
      return { ...prev, [pageKey]: list };
    });
  };

  // 👉 aplanado de todos los compilados (todas las páginas) para enviar al backend
  const allCompiled: FieldJson[] = useMemo(
    () => Object.values(compiledByPage).flat().filter(Boolean) as FieldJson[],
    [compiledByPage]
  );

  console.warn("JSOM:_ ", allCompiled);

  const handleAddElement = (
    key: string,
    keyType?: string,
    groupName?: string,
    values?: FieldFormValues
  ) => {
    setElementsByPage((prev) => {
      const pageKey = selectedPage.sequence;
      const prevList = prev[pageKey] ?? [];
      console.warn("keyTIPE_ ", keyType);
      const next: ElementItem = {
        type: keyType ?? key,
        name:
          keyType === "grupo" || keyType === "combo" ?
            (values?.nombre ?? key)
          : key, // nombre del grupo o del campo
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

  const handleEditDelete = () => {
    const pageKey = selectedPage.sequence;
    let deletedName: string | undefined;
    setElementsByPage((prev) => {
      const list = [...(prev[pageKey] ?? [])];
      if (editIndex != null && editIndex >= 0 && editIndex < list.length) {
        deletedName = list[editIndex].name;
        list.splice(editIndex, 1);
      }
      const next = { ...prev, [pageKey]: list };

      // Recalcular grupos existentes a partir del nuevo estado
      const allGroups = new Set<string>();
      Object.values(next).forEach((arr) =>
        arr.forEach((el) => {
          if (el.variant === "grupo" && el.name) allGroups.add(el.name);
        })
      );
      setGroups(Array.from(allGroups));

      return next;
    });

    if (deletedName) {
      setCompiledByPage((prev) => {
        const list = [...(prev[pageKey] ?? [])];
        const filtered = list.filter(
          (item) => item?.nombre_campo !== deletedName
        );
        return { ...prev, [pageKey]: filtered };
      });
    }

    setEditOpen(false);
    setEditIndex(null);
    setEditInitialValues(undefined);
    setEditVariant(undefined);
  };

  const currentElements = elementsByPage[selectedPage.sequence] ?? [];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    setSelectedKey(key as VariantType);

    // aquí podrías hacer setFieldData(...) con datos por defecto según el tipo
    setVisible(true);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar con la lista de elementos */}
      <div className="w-64 bg-white border-r">
        <FormElementsList onMenuClick={handleMenuClick} />
      </div>

      {/* Zona del “mockup” */}
      <div className="flex-1 flex justify-center items-start p-6 ">
        {/* Modal de CREACIÓN (tu modal actual) */}
        <EditFieldModal
          visible={visible}
          variant={selectedKey}
          opcionesList={opciones}
          gruposList={groups}
          onSave={(vals) => handleSave?.(vals)}
          onCancel={handleCancel}
          onBuild={handleCompiled}
        />

        {/* Modal de EDICIÓN (controlado por CreateForms) */}
        <EditFieldModal
          visible={!!editOpen}
          initialValues={editInitialValues}
          variant={editVariant}
          opcionesList={opciones}
          gruposList={groups}
          onSave={(vals) => handleEditSave?.(vals)}
          onCancel={() => setEditOpen(false) ?? (() => {})}
          onDelete={handleEditDelete}
          onBuild={handleCompiled}
        />

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
          compiledList={allCompiled}
        />
      </div>

      <div>
        <PageSettings onPageChange={setSelectedPage} formId={String(formId)} />
      </div>
    </div>
  );
};

export default CreateForms;
