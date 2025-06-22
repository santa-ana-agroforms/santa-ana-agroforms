// src/components/CreateForms.tsx
import React, { useState } from 'react'
import FormElementsList from './components/FormElementList'
import PhoneMockup from './components/PhoneMockup'

interface CreateFormsProps {
  formId: number
  onBack: () => void
}

const CreateForms: React.FC<CreateFormsProps> = ({ formId, onBack }) => {
  // aquí guardamos la clave del elemento (texto, fecha, foto, etc.) que pinchó el usuario
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar con la lista de elementos */}
      <div className="w-64 bg-white border-r">
        <FormElementsList onSelect={setSelectedElement} />
      </div>

      {/* Zona del “mockup” */}
      <div className="flex-1 flex justify-center items-start p-6">
        {/* 
          Asumimos que tu PhoneMockup admite ahora una prop 
          `selectedElement: string | null`
          para mostrar el input/form que corresponda. 
        */}
        <PhoneMockup formId={formId} onBack={onBack} selectedElement={selectedElement} />
      </div>
    </div>
  )
}

export default CreateForms
