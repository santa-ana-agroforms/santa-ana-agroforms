// src/components/PhoneMockup.tsx
import React from "react";

import { Button, Input, Typography } from "antd";

import signatureIcon from "@/assets/signature_icon.svg";
import { useFormulario } from "@/features/forms-list/hooks/useFormularios";

import { PageValues } from "./PageEditModal";

const { Text } = Typography;

interface PhoneMockupProps {
  formId: string | number;
  selectedElements: string[];
  onBack: () => void;
  selectedPage: PageValues;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  formId,
  onBack,
  selectedElements,
  selectedPage,
}) => {
  const {
    data: formulario,
    isLoading,
    isFetching,
  } = useFormulario(String(formId));

  if (isLoading && !formulario) return <div>Cargando…</div>;

  return (
    <div
      className="w-80 h-[600px] border border-gray-300 rounded-3xl shadow-lg flex flex-col overflow-hidden bg-white"
      style={{ backgroundColor: selectedPage.bgColor }}
    >
      {/* Header */}
      <div className="bg-red-600 text-white text-center py-3 font-semibold">
        {formulario.nombre}
      </div>

      {/* Subtítulo */}
      <div className="px-4 py-2 border-b">
        <Text strong style={{ color: selectedPage.textColor }}>
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

        {selectedElements.map((element, index) => (
          <div key={index} className="mb-4">
            {element === "texto" && (
              <>
                <Text style={{ color: selectedPage.textColor }}>
                  Campo de Texto:
                </Text>
                <Input placeholder="Introduce texto..." />
              </>
            )}

            {element === "fecha" && (
              <>
                <Text style={{ color: selectedPage.textColor }}>
                  Selecciona una Fecha:
                </Text>
                <Input type="date" />
              </>
            )}

            {element === "firma" && (
              <>
                <Text style={{ color: selectedPage.textColor }}>Firma:</Text>
                <div className="border rounded bg-white p-2 w-full h-28 flex items-center justify-center">
                  <img
                    src={signatureIcon}
                    alt="Firma"
                    className="max-h-full object-contain"
                  />
                </div>
              </>
            )}

            {/* Aquí puedes seguir agregando el resto de tipos de elementos */}
          </div>
        ))}
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
