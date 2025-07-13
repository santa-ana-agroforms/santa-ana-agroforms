// src/pages/DeviceListPage.tsx
import React from "react";

import DevicesList from "@/features/devices-list";

const DevicesListPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <DevicesList />
    </div>
  );
};

export default DevicesListPage;
