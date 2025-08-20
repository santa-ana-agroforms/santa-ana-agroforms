// src/pages/DeviceListPage.tsx
import React from "react";

import FormsLists from "@/features/forms-list";

interface FormListPageProps {
  onSelectForm: (id: number) => void;
}

const FormListPage: React.FC<FormListPageProps> = ({ onSelectForm }) => {
  return (
    <div className="flex flex-col gap-4">
      <FormsLists onSelectForm={onSelectForm} />
    </div>
  );
};

export default FormListPage;
