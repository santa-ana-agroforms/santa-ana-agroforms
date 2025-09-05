// src/components/PhoneMockup.tsx
import React from "react";

import { HighlightOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";

import signatureIcon from "@/assets/signature_icon.svg";
import { useFormulario } from "@/features/forms-list/hooks/useFormularios";

import { ElementItem } from "..";
import { PageValues } from "./PageEditModal";

const { Text } = Typography;

interface PhoneMockupProps {
  formId: string | number;
  selectedElements: ElementItem[];
  onBack: () => void;
  selectedPage: PageValues;
  keyType?: string;
  onEditElement?: (index: number) => void;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  formId,
  onBack,
  selectedElements,
  selectedPage,
  onEditElement,
}) => {
  const {
    data: formulario,
    isLoading,
    isFetching,
  } = useFormulario(String(formId));

  if (isLoading && !formulario) return <div>Cargando…</div>;

  let currentGroupName: string | null = null;

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
                    <Text>Campo de Texto:</Text>
                    <Input placeholder="Introduce texto..." />
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
                    <Text>Selecciona una Fecha:</Text>
                    <Input type="date" />
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
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PhoneMockup;
