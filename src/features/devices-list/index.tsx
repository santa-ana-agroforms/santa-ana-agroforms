// src/components/DevicesList/DevicesList.tsx
import React, { useCallback, useState } from "react";

import { Col, Input, type TableProps } from "antd";

import DevicesTable, {
  ItemType as DeviceType,
} from "@/components/DeviceTables";
import { EditUserValues } from "@/components/DeviceTables/components/EditUserModal";

import { devices } from "./data";

const DevicesList: React.FC = () => {
  // estados para búsqueda, filtros y orden
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<any>({});

  // filtrar globalmente según el texto
  const filteredData = devices.filter((item) =>
    Object.values(item as unknown as Record<string, unknown>)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // onChange estándar de ant-table
  const handleTableChange: TableProps<DeviceType>["onChange"] = (
    _pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleEdit = useCallback((rec: DeviceType) => {
    console.log("EDIT:", rec);
    // aquí tu lógica para editar…
  }, []);

  const handleDelete = useCallback((rec: DeviceType) => {
    console.log("DELETE:", rec);
    // aquí tu lógica para borrar…
  }, []);

  const handleIdClick = useCallback((id: string) => {
    console.log("GO TO DETAIL FOR ID:", id);
    // navegación o callback…
  }, []);

  // 1) Creamos el handler para “Crear” (onCreate)
  const handleCreate = useCallback((values: EditUserValues) => {
    console.log("CREATE:", values);
    // Aquí tu lógica para añadir el nuevo registro...
    // por ejemplo: llamar a tu API o actualizar el estado local
  }, []);

  return (
    <div className="flex flex-col p-4 w-full gap-7">
      <div className="flex justify-between items-center w-full">
        {/* Input.Search para filtrar */}
        <Col className="w-full">
          <Input
            placeholder="Introduzca el texto a buscar..."
            allowClear
            className="w-48"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </div>

      {/* Nuestra tabla “plana” sin Collapse */}
      <DevicesTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onIdClick={handleIdClick}
        onTableChange={handleTableChange}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default DevicesList;
