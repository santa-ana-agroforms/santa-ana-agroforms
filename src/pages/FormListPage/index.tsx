// src/pages/DeviceListPage.tsx
import React, { useState } from "react";

import {
  ArrowUpOutlined,
  FilterOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Button, Col, Input } from "antd";

import NewCategoryModal from "@/components/NewCategoryModal";
import FormsLists from "@/features/forms-list";

interface FormListPageProps {
  onSelectForm: (id: string | number) => void;
}

const FormListPage: React.FC<FormListPageProps> = ({ onSelectForm }) => {
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center w-full p-4">
        <div className="flex items-center gap-4">
          {/* Botón para crear categoria */}
          <Button
            icon={<PlusSquareOutlined />}
            onClick={() => setIsNewCategoryOpen(true)}
          >
            Crear categoria
          </Button>
          {/* Botón de Categoría */}
          <Button icon={<FilterOutlined />}>
            Categoría <ArrowUpOutlined />
          </Button>
        </div>

        <Col className="w-60">
          {/* Input de búsqueda */}
          <Input
            placeholder="Introduzca el texto a buscar..."
            className="w-48"
          />
        </Col>
      </div>
      <FormsLists onSelectForm={onSelectForm} />

      <NewCategoryModal
        visible={isNewCategoryOpen}
        onCancel={() => setIsNewCategoryOpen(false)}
        onCreate={() => {
          // Si quieres, puedes hacer algo extra aquí al crear (refetch, etc.)
          setIsNewCategoryOpen(false);
        }}
      />
    </div>
  );
};

export default FormListPage;
