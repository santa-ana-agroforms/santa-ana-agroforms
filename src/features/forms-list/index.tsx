import React from 'react';
import { Button, Col, Input } from 'antd';
import { FilterOutlined, ArrowUpOutlined } from '@ant-design/icons';

const FormsLists: React.FC = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Botón de Categoría */}
        <Button icon={<FilterOutlined />} className="flex items-center gap-1">
          Categoría <ArrowUpOutlined />
        </Button>


        <Col className='w-60'>
            {/* Input de búsqueda */}
            <Input
            placeholder="Introduzca el texto a buscar..."
            className="w-48"
            />
        </Col>
      </div>
    </div>
  );
};

export default FormsLists;
