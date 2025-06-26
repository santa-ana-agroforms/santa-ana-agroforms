// src/components/CreateForms.tsx
import React, { useState } from 'react'
import FormElementsList from './components/FormElementList'
import PhoneMockup from './components/PhoneMockup'
import PageSettings from './components/Forms-Settings'
import { PageValues } from './components/PageEditModal'

interface CreateFormsProps {
  formId: number
  onBack: () => void
}

const CreateForms: React.FC<CreateFormsProps> = ({ formId, onBack }) => {
  // aquí guardamos la clave del elemento (texto, fecha, foto, etc.) que pinchó el usuario
  const [selectedElements, setSelectedElements] = useState<string[]>([])

  const handleAddElement = (key: string) => {
    setSelectedElements(prev => [...prev, key])
  }

  const [selectedPage, setSelectedPage] = useState<PageValues>({
    sequence: 1,
    description: 'Generales',
    title: 'Generales',
    bgColor: '#FFFFFF',
    textColor: '#000000',
  })



  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar con la lista de elementos */}
      <div className="w-64 bg-white border-r">
        <FormElementsList onSelect={handleAddElement} />
      </div>

      {/* Zona del “mockup” */}
      <div className="flex-1 flex justify-center items-start p-6 ">
        {/* 
          Asumimos que tu PhoneMockup admite ahora una prop 
          `selectedElement: string | null`
          para mostrar el input/form que corresponda. 
        */}
        <PhoneMockup formId={formId} onBack={onBack} selectedElements={selectedElements} selectedPage={selectedPage}/>
      </div>

      <div>
        <PageSettings onPageChange={setSelectedPage}/>
      </div>
    </div>
  )
}

export default CreateForms
