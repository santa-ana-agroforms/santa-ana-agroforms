// src/components/DevicesList/DevicesList.tsx
import React, { useCallback, useState } from "react";

import { Col, Input, Skeleton, type TableProps } from "antd";

import { EditUserValues } from "@/components/DeviceTables/components/EditUserModal";
import UsersTable, { UserType } from "@/components/UserTable";

import { useUsuarios } from "./hooks/useUsuarios";

const UserList: React.FC = () => {
  const { data: user = [], isLoading, error } = useUsuarios();
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<any>({});

  // filtrar globalmente según el texto
  const filteredData = user.filter((item) =>
    Object.values(item as unknown as Record<string, unknown>)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // onChange estándar de ant-table
  const handleTableChange: TableProps<UserType>["onChange"] = (
    _pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const handleEdit = useCallback((rec: UserType) => {
    console.log("EDIT:", rec);
    // aquí tu lógica para editar…
  }, []);

  const handleDelete = useCallback((rec: UserType) => {
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

      {isLoading || user.length === 0 ?
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      : <>
          {/* Nuestra tabla “plana” sin Collapse */}
          <UsersTable
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </>
      }
    </div>
  );
};

export default UserList;
