// src/components/PhoneMockup.tsx
import React from 'react'
import { Button, Input, Typography } from 'antd'
const { Text } = Typography

interface PhoneMockupProps {
  formId: number
  selectedElement: string | null
  onBack: () => void
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ formId, onBack, selectedElement}) => (
  <div className="w-80 h-[600px] border border-gray-300 rounded-3xl shadow-lg flex flex-col overflow-hidden bg-white">
    {/* Header */}
    <div className="bg-red-600 text-white text-center py-3 font-semibold">
      Formulario de Reporte de Fungicidas
    </div>

    {/* Subtítulo */}
    <div className="px-4 py-2 border-b">
      <Text strong>Generales (ID: {formId})</Text>
    </div>

    {/* Aquí iría tu contenido dinámico */}
    <div className="flex-1 p-4 overflow-auto">
      {!selectedElement && (
        <p className="text-gray-500">Selecciona un elemento de la barra izquierda</p>
      )}

      {selectedElement === 'texto' && (
        <>
          <Text>Campo de Texto:</Text>
          <Input placeholder="Introduce texto..." />
       </>
      )}

      {selectedElement === 'fecha' && (
        <>
          <Text>Selecciona una Fecha:</Text>
          <Input type="date" />
        </>
      )}
    </div>

    {/* Footer con botones */}
    <div className="flex justify-between px-4 py-3 border-t">
      <Button type="primary" danger onClick={onBack}>
        Regresar
      </Button>
      <Button
        type="primary"
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        Continuar
      </Button>
    </div>
  </div>
)

export default PhoneMockup
