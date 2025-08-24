// src/pages/DeviceListPage.tsx
import React from "react";

import CreateForms from "@/features/create-forms";

interface CreateFormsPageProps {
  formId: string | number;
  onBack: () => void;
}

const CreateFormsPage: React.FC<CreateFormsPageProps> = ({
  formId,
  onBack,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <CreateForms formId={formId} onBack={onBack} />
    </div>
  );
};

export default CreateFormsPage;
