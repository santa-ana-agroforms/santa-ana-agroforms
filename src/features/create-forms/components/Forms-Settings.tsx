// src/components/PageSettings.tsx
import React, { useEffect, useState } from 'react'
import { Input, InputNumber, Button, Form, Select } from 'antd'
import { DiffOutlined } from '@ant-design/icons'
import PageEditModal, { PageValues } from './PageEditModal'

interface PageSettingsProps {
  /** Callback cuando se presiona el icono */
  onIconClick?: () => void
  /** Callback cuando se cambia de pagina */
  onPageChange?: (page: PageValues) => void 
}

const { Option } = Select

const PageSettings: React.FC<PageSettingsProps> = ({ onIconClick, onPageChange}) => {
  const [sequence, setSequence] = useState(1)
  const [description, setDescription] = useState('Generales')
  const [title, setTitle] = useState('Generales')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [textColor, setTextColor] = useState('#000000')

  const [pageModalVisible, setPageModalVisible] = useState(false)

  const [pages, setPages] = useState<PageValues[]>([
  {
    sequence: 1,
    description: 'Generales',
    title: 'Generales',
    bgColor: '#FFFFFF',
    textColor: '#000000',
  },
])


  const handleDelete = () => {
    console.log('Eliminar clicked')
  }
  const handleSave = () => {
    console.log('Guardar clicked')
  }
  
  const handleIconClick = () => {
    setPageModalVisible(true)
  }

  const handleCancel = () => {
    setPageModalVisible(false)
  }

  const handleUpdate = (updated: PageValues) => {
    setPageModalVisible(false)

    // Si ya existe, lo actualizas; si no, lo agregas
    setPages((prev) => {
      const exists = prev.find(p => p.title === updated.title)
      if (exists) {
        return prev.map(p => p.title === updated.title ? updated : p)
      }
      return [...prev, updated]
    })
  }

  useEffect(() => {
    const selectedPage = pages.find(p => p.title === title)
    if (selectedPage) {
      setSequence(selectedPage.sequence)
      setDescription(selectedPage.description)
      setTitle(selectedPage.title)
      setBgColor(selectedPage.bgColor)
      setTextColor(selectedPage.textColor)
      onPageChange?.(selectedPage) 
    }
  }, [title, pages])

  const selectedPageData = pages.find(p => p.title === title) ?? pages[0]


  return (
    <div className="bg-white rounded-lg shadow max-w-sm">
      {/* Header fijo con icono pressable */}
      <div className="flex flex-col border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            onClick={handleIconClick}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <DiffOutlined/>
          </Button>
          <h3 className="ml-2 text-lg font-medium">Página</h3>
        </div>

        <div className='w-full px-4 items-center justify-center'>
          <Form>
            <Form.Item name="estado" initialValue={title}>
              <Select value={title} onChange={setTitle}>
                {pages.map((page) => (
                  <Option key={page.title} value={page.title}>
                    {page.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>


      <PageEditModal
        visible={pageModalVisible}
        initialValues={selectedPageData}
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        existingPages={pages} 
      />

      {/* Contenido del form */}
      <div className="px-4 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Secuencia</label>
          <InputNumber
            min={1}
            value={sequence}
            onChange={(value) => {
              if (typeof value === 'number') setSequence(value)
            }}
            className="w-full"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color Fondo</label>
          <Input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-8 p-0"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color Texto</label>
          <Input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-8 p-0"
            disabled
          />
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end gap-3 px-4 py-3 border-t space-x-2">
        <Button danger onClick={handleDelete}>
          ELIMINAR
        </Button>
        <Button type="primary" onClick={handleSave}>
          GUARDAR
        </Button>
      </div>
    </div>
  )
}

export default PageSettings
