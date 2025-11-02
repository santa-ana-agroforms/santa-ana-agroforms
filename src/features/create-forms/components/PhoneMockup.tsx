// src/components/PhoneMockup.tsx
import React from "react";

import {
  GroupOutlined,
  HighlightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  TimePicker,
  Typography,
} from "antd";

import signatureIcon from "@/assets/signature_icon.svg";

import { ElementItem } from "..";
import { PageValues } from "./PageEditModal";

const { Text } = Typography;

interface PhoneMockupProps {
  formId: string | number;
  selectedElements: ElementItem[];
  onBack: () => void;
  selectedPage: PageValues;
  pages: PageValues[]; // 👈 todas las páginas
  onPageChange: (page: PageValues) => void;
  formulario?: any; // 👈 nuevo
  isLoading: boolean; // 👈 nuevo
  isError: boolean; // 👈 nuevo
  keyType?: string;
  onEditElement?: (index: number) => void;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  formulario,
  isLoading,
  isError,
  selectedElements,
  pages,
  onPageChange,
  selectedPage,
  onEditElement,
}) => {
  const currentIndex = pages.findIndex((p) => p.title === selectedPage.title);
  const totalPages = pages.length;

  if (isLoading && !formulario) return <div>Cargando…</div>;

  // console.warn("Renderizando PhoneMockup con formulario:", formulario);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onPageChange(pages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      onPageChange(pages[currentIndex + 1]);
    }
  };

  let currentGroupName: string | null = null;

  if (isLoading) return <div>Cargando…</div>;
  if (isError) return <div>Cargando...</div>;
  if (!formulario) return <div>Cargando...</div>;

  console.warn("selectedElements:", selectedElements);

  return (
    <div className="w-80 h-[600px] border border-gray-300 rounded-3xl shadow-lg flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white text-center py-3 font-semibold">
        {formulario.nombre}
      </div>

      {/* Subtítulo */}
      <div className="px-4 py-2 border-b">
        <Text strong>
          {selectedPage.title} (ID: {selectedPage.id})
        </Text>
      </div>

      {/* Aquí iría tu contenido dinámico */}
      <div className="flex-1 p-4 overflow-auto">
        {selectedElements.length === 0 && (
          <p className="text-gray-500">
            Selecciona un elemento de la barra izquierda
          </p>
        )}

        {formulario === undefined && (
          <p className="text-gray-500">Cargando formulario...</p>
        )}

        {selectedElements.map((element, index) => {
          console.warn("Renderizando elemento:", element);

          // si es cabecera de grupo → actualizar "grupo actual" y renderizar bloque de grupo
          if (element.type === "grupo" || element.type === "group") {
            currentGroupName = element.name; // ← este será el grupo al que tabulamos después
            return (
              <div key={index} className="mb-4">
                <div className="flex flex-row gap-4">
                  <GroupOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="bg-amber-100 p-1 w-full flex">
                    <Text>{element.values?.etiqueta}</Text>
                  </div>
                </div>
              </div>
            );
          }

          // si NO es grupo → ver si pertenece al grupo actual
          const belongsToCurrent =
            (!!element.group && currentGroupName === element.group) ||
            (!!element.values?.grupo &&
              currentGroupName === element.values.grupo);

          const indentClass = belongsToCurrent ? "pl-6" : "";

          return (
            <div key={index} className={`mb-4 ${indentClass}`}>
              {(element.type === "texto" || element.type === "text") && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}</Text>
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
                    <Text>{element.values?.etiqueta}:</Text>
                    <Input placeholder="Introduce texto..." disabled />
                  </div>
                </div>
              )}

              {(element.type === "switch" || element.type === "boolean") && (
                <div className="flex flex-row gap-4 items-center w-full">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col">
                    <div className="flex w-full">
                      <Text>{element.values?.etiqueta}</Text>
                    </div>
                    <div className="flex w-1/3">
                      <Switch />
                    </div>
                  </div>
                </div>
              )}

              {(element.type === "combo" ||
                element.type === "list" ||
                element.type === "dataset") && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />

                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}</Text>

                    {(() => {
                      const valoresArray = element.values?.valores
                        ?.split("\n")
                        .map((v) => v.trim())
                        .filter((v) => v !== "");

                      return (
                        <Select
                          placeholder="Selecciona una opción"
                          style={{ width: "100%" }}
                        >
                          {valoresArray?.map((valor: string) => (
                            <Select.Option key={valor} value={valor}>
                              {valor}
                            </Select.Option>
                          ))}
                        </Select>
                      );
                    })()}
                  </div>
                </div>
              )}

              {(element.type === "fecha" || element.type === "date") && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}:</Text>
                    <DatePicker disabled />
                  </div>
                </div>
              )}

              {(element.type === "hora" || element.type === "hour") && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}:</Text>
                    <TimePicker disabled />
                  </div>
                </div>
              )}

              {(element.type === "numero" || element.type === "number") && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}</Text>
                    <Input placeholder="Introduce un valor..." disabled />
                  </div>
                </div>
              )}

              {(element.type === "firma" || element.type === "firm") && (
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

              {(element.type === "grupo" || element.type === "group") && (
                <>
                  <div className="flex flex-row gap-4">
                    <GroupOutlined className="cursor-pointer" />
                    <div className=" bg-amber-100 p-1 w-full flex">
                      <Text>{element.values?.etiqueta}</Text>
                    </div>
                  </div>
                </>
              )}

              {element.type === "calc" && (
                <div className="flex flex-row gap-4 items-center">
                  <HighlightOutlined
                    className="cursor-pointer"
                    onClick={() => onEditElement?.(index)}
                  />
                  <div className="flex flex-col w-full">
                    <Text>{element.values?.etiqueta}</Text>
                    <Space>
                      <InputNumber disabled />
                      <span>+</span>
                      <InputNumber disabled />
                    </Space>
                  </div>
                </div>
              )}

              {/* Aquí puedes seguir agregando el resto de tipos de elementos */}
            </div>
          );
        })}
      </div>

      {/* Footer con botones */}
      <div className="flex justify-between px-4 py-3 border-t">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePrev}
          disabled={totalPages <= 1 || currentIndex === 0}
        />
        <Button
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={totalPages <= 1 || currentIndex === totalPages - 1}
        />
      </div>
    </div>
  );
};

export default PhoneMockup;
