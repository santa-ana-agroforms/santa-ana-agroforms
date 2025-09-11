// src/components/PhoneMockup.tsx
import React from "react";

import { HighlightOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Select,
  Switch,
  Typography,
} from "antd";

import signatureIcon from "@/assets/signature_icon.svg";
import { useFormulario } from "@/features/forms-list/hooks/useFormularios";

import { ElementItem } from "..";
import { usePostCamposActualBatch } from "../hooks/useCampoActual";
import { usePaginas } from "../hooks/usePaginas";
import { FieldJson } from "../types";
import { PageValues } from "./PageEditModal";

const { Text } = Typography;

interface PhoneMockupProps {
  formId: string | number;
  selectedElements: ElementItem[];
  onBack: () => void;
  selectedPage: PageValues;
  keyType?: string;
  onEditElement?: (index: number) => void;
  compiledList: FieldJson[];
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  formId,
  onBack,
  selectedElements,
  selectedPage,
  onEditElement,
  compiledList,
}) => {
  const {
    data: formulario,
    isLoading,
    isFetching,
  } = useFormulario(String(formId));

  // 1) Traemos páginas para obtener el pageId a partir de la secuencia actual
  const { data: paginas } = usePaginas(String(formId));
  const currentPagina = React.useMemo(
    () => paginas?.find((p) => p.secuencia === selectedPage.sequence),
    [paginas, selectedPage.sequence]
  );
  const currentPageId = currentPagina?.id as string | undefined;

  // 2) Mutación POST a /campos-actual/
  // Mutaciones
  const { mutateAsync: postCamposBulk, isPending: sendingBulk } =
    usePostCamposActualBatch();

  if (isLoading && !formulario) return <div>Cargando…</div>;

  let currentGroupName: string | null = null;

  const handleContinue = async () => {
    console.warn("➡️ JSONs compilados (front):", compiledList);

    if (!currentPageId) {
      console.warn("⚠️ No hay pageId: no se puede enviar al backend.");
      message.error("No se pudo identificar la página actual (pageId).");
      return;
    }

    try {
      const { ok, errors } = await postCamposBulk({
        pageId: currentPageId,
        campos: compiledList, // 👈 se envían UNO POR UNO en el service
      });

      console.warn("🌐 Resultados envío:", { ok, errors });

      if (errors.length) {
        message.error(
          `Algunos campos fallaron (${errors.length}). Revisa la consola.`
        );
      } else {
        message.success("Campos enviados correctamente.");
      }

      // aquí puedes navegar o continuar el flujo
    } catch (e) {
      console.error("❌ Error al enviar campos:", e);
      message.error("Error al enviar campos al backend.");
    }
  };

  return (
    <div className="w-80 h-[600px] border border-gray-300 rounded-3xl shadow-lg flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white text-center py-3 font-semibold">
        {formulario.nombre}
      </div>

      {/* Subtítulo */}
      <div className="px-4 py-2 border-b">
        <Text strong>
          {selectedPage.title} (ID: {formId})
        </Text>
      </div>

      {/* Aquí iría tu contenido dinámico */}
      <div className="flex-1 p-4 overflow-auto">
        {selectedElements.length === 0 && (
          <p className="text-gray-500">
            Selecciona un elemento de la barra izquierda
          </p>
        )}

        {selectedElements.map((element, index) => {
          // si es cabecera de grupo → actualizar "grupo actual" y renderizar bloque de grupo
          if (element.type === "grupo") {
            currentGroupName = element.name; // ← este será el grupo al que tabulamos después
            return (
              <div key={index} className="mb-4">
                <div className="flex flex-row gap-4">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="bg-amber-100 p-1 w-full flex">
                    <Text>{element.name}</Text>
                  </div>
                </div>
              </div>
            );
          }

          // si NO es grupo → ver si pertenece al grupo actual
          const belongsToCurrent =
            !!element.group && currentGroupName === element.group;

          const indentClass = belongsToCurrent ? "pl-6" : "";

          return (
            <div key={index} className={`mb-4 ${indentClass}`}>
              {element.type === "texto" && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.name}</Text>
                  </div>
                </div>
              )}

              {element.type === "dato" && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.name}:</Text>
                    <Input placeholder="Introduce texto..." disabled />
                  </div>
                </div>
              )}

              {element.type === "switch" && (
                <div className="flex flex-row gap-4 items-center w-1/3">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.name}</Text>
                    <Switch />
                  </div>
                </div>
              )}

              {element.type === "combo" && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.name}</Text>
                    <Select
                      placeholder="Selecciona una opción"
                      style={{ width: "100%" }}
                      disabled
                    />
                  </div>
                </div>
              )}

              {element.type === "fecha" && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.name}:</Text>
                    <DatePicker disabled />
                  </div>
                </div>
              )}

              {element.type === "firma" && (
                <>
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <Text>Firma:</Text>
                  <div className="border rounded bg-white p-2 w-full h-28 flex items-center justify-center">
                    <img
                      src={signatureIcon}
                      alt="Firma"
                      className="max-h-full object-contain"
                    />
                  </div>
                </>
              )}

              {/* {element.type === "grupo" && (
                <>
                  <div className="flex flex-row gap-4">
                    <HighlightOutlined className="cursor-pointer" />
                    <div className=" bg-amber-100 p-1 w-full flex">
                      <Text>{element.name}</Text>
                    </div>
                  </div>
                </>
              )} */}

              {/* Aquí puedes seguir agregando el resto de tipos de elementos */}
            </div>
          );
        })}
      </div>

      {/* Footer con botones */}
      <div className="flex justify-between px-4 py-3 border-t">
        <Button type="primary" danger onClick={onBack}>
          Regresar
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          onClick={handleContinue}
          loading={sendingBulk}
          disabled={sendingBulk}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PhoneMockup;
