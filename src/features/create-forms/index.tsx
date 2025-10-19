// src/components/CreateForms.tsx
import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, MenuProps } from "antd";

import { useFormulario } from "../forms-list/hooks/useFormularios";
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
  variant?: VariantType;
  values?: Partial<FieldFormValues>;
};

const collectGroupsFromElements = (elements: ElementItem[]): Set<string> => {
  const groups = new Set<string>();
  elements.forEach((el) => {
    if (el.variant === "grupo" && el.name) {
      groups.add(el.name);
    }
  });
  return groups;
};

const collectAllGroupsFromPages = (
  elementsByPage: Record<number, ElementItem[]>
): string[] => {
  const allGroups = new Set<string>();
  Object.values(elementsByPage).forEach((arr) => {
    const pageGroups = collectGroupsFromElements(arr);
    pageGroups.forEach((g) => allGroups.add(g));
  });
  return Array.from(allGroups);
};

const CreateForms: React.FC<CreateFormsProps> = ({ formId, onBack }) => {
  const [groups, setGroups] = useState<string[]>([]);
  const {
    data: formulario,
    isLoading,
    isError,
  } = useFormulario(formId.toString());

  useEffect(() => {
    if (formulario?.paginas) {
      const inicial: Record<number, ElementItem[]> = {};
      formulario.paginas.forEach((pagina: any) => {
        inicial[pagina.secuencia] = pagina.campos.map((campo: any) => ({
          type: campo.tipo,
          name: campo.nombre_campo,
          group: campo.grupo ?? undefined,
          key: campo.id_campo,
          variant: campo.tipo,
          values: {
            secuencia: campo.sequence ?? 0,
            nombre: campo.nombre_campo,
            etiqueta: campo.etiqueta,
            ayuda: campo.ayuda ?? "",
            color: campo.color ?? "",
            requerido: campo.requerido,
            tamano: campo.tamano ?? 0,
            opciones: campo.opciones ?? "",
            grupo: campo.grupo ?? "",
            reglaVisualizacion: campo.reglaVisualizacion ?? "",
          } satisfies Partial<FieldFormValues>,
        }));
      });
      setElementsByPage(inicial);
    }
  }, [formulario]);

  const [elementsByPage, setElementsByPage] = useState<
    Record<number, ElementItem[]>
  >({});

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

  const [pages, setPages] = useState<PageValues[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<VariantType>();

  const handleSave = (vals: FieldFormValues) => {
    if (selectedKey) {
      handleAddElement(vals.nombre, selectedKey, undefined, vals);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

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
        while (list.length < currentElements.length)
          list.push(undefined as unknown as FieldJson);
        list[editIndex] = json;
      } else {
        list.push(json);
      }
      return { ...prev, [pageKey]: list };
    });
  };

  const allCompiled: FieldJson[] = useMemo(
    () => Object.values(compiledByPage).flat().filter(Boolean) as FieldJson[],
    [compiledByPage]
  );

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
        name:
          keyType === "grupo" || keyType === "combo" ?
            (values?.nombre ?? key)
          : key,
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
          values: { ...prevEl.values, ...vals },
        };
      }
      return { ...prev, [pageKey]: list };
    });

    if (editVariant === "grupo" && vals.nombre) {
      setGroups((gs) => (gs.includes(vals.nombre) ? gs : [...gs, vals.nombre]));
    }

    setEditOpen(false);
    setEditIndex(null);
    setEditInitialValues(undefined);
    setEditVariant(undefined);
  };

  const [selectedPage, setSelectedPage] = useState<PageValues>({
    id: "0",
    sequence: 1,
    description: "Generales",
    title: "Generales",
  });

  useEffect(() => {
    if (formulario?.paginas) {
      const mappedPages: PageValues[] = formulario.paginas.map((p: any) => ({
        id: p.id_pagina,
        sequence: p.secuencia,
        description: p.descripcion,
        title: p.nombre,
      }));
      setPages(mappedPages);

      console.warn("mapped:", mappedPages);

      if (mappedPages.length > 0) {
        setSelectedPage((prev) => {
          const isSentinel = !prev || String(prev.id) === "0";
          const stillExists =
            prev && mappedPages.some((p) => String(p.id) === String(prev.id));
          if (isSentinel || !stillExists) return mappedPages[0];
          const updated = mappedPages.find(
            (p) => String(p.id) === String(prev.id)
          )!;
          return updated;
        });
      }
    }
  }, [formulario]);

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

      const allGroups = collectAllGroupsFromPages(next);
      setGroups(allGroups);

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
    setVisible(true);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-64 bg-white border-r">
        <FormElementsList onMenuClick={handleMenuClick} />
      </div>

      <div className="flex-1 flex justify-start items-start p-6">
        <div className="flex justify-start items-start self-start w-3/10">
          <Button icon={<ArrowLeftOutlined />} danger onClick={onBack}>
            Regresar
          </Button>
        </div>

        <EditFieldModal
          visible={visible}
          variant={selectedKey}
          opcionesList={opciones}
          gruposList={groups}
          onSave={handleSave}
          onCancel={handleCancel}
          onBuild={handleCompiled}
        />

        <EditFieldModal
          visible={!!editOpen}
          initialValues={editInitialValues}
          variant={editVariant}
          opcionesList={opciones}
          gruposList={groups}
          onSave={handleEditSave}
          onCancel={() => setEditOpen(false)}
          onDelete={handleEditDelete}
          onBuild={handleCompiled}
        />

        <PhoneMockup
          formId={formId}
          onBack={onBack}
          formulario={formulario}
          isLoading={isLoading}
          isError={isError}
          selectedElements={currentElements}
          selectedPage={selectedPage}
          pages={pages}
          onPageChange={setSelectedPage}
          onEditElement={handleEditElementRequest}
        />
      </div>

      <div>
        <PageSettings
          onPageChange={setSelectedPage}
          pages={pages}
          pageId={String(selectedPage.id)}
          compiledList={allCompiled}
          currentPage={selectedPage}
          formId={formId}
        />
      </div>
    </div>
  );
};

export default CreateForms;