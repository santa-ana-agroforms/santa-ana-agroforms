// src/components/FormsLists/UsersTable.tsx
import React, { useState } from "react";

import {
  DeleteOutlined,
  FormOutlined,
  QrcodeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Table, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import EditUserModal, {
  EditUserValues,
} from "../DeviceTables/components/EditUserModal";
import QrModal from "./components/QrModal";

// un modal específico para usuarios

export interface UserType {
  key: string;
  id: string;
  nombre: string;
  contraseña: string;
  activo: boolean;
  perfil: string;
  email: string;
}

interface Props {
  data: UserType[];
  onEdit: (record: UserType) => void;
  onDelete: (record: UserType) => void;
  onCreate: (values: EditUserValues) => void;
  onTableChange?: TableProps<UserType>["onChange"];
}

const UsersTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  onCreate,
  onTableChange,
}) => {
  // filtros únicos
  const perfilFilters = Array.from(new Set(data.map((u) => u.perfil))).map(
    (p) => ({ text: p, value: p })
  );
  const activeFilters = [
    { text: "Sí", value: true },
    { text: "No", value: false },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<UserType | null>(null);

  const [QrModalOpen, setQrModalOpen] = useState(false);

  const handleAdd = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleCancel = () => setModalOpen(false);

  const handleShowQr = () => setQrModalOpen(true);

  const handleSave = (values: EditUserValues) => {
    if (selected) {
      onEdit({ ...selected, ...values });
    } else {
      onCreate(values);
    }
    setModalOpen(false);
  };

  const columns: ColumnsType<UserType> = [
    {
      title: (
        <div
          onClick={handleAdd}
          title="Crear nuevo formulario"
          className="flex flex-col items-center justify-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
        >
          <UserAddOutlined className="text-2xl" />
          <span className="text-xs mt-1">Nuevo usuario</span>
        </div>
      ),
      key: "actions",
      width: 100,
      align: "center",
      render: (_: any, record) => (
        <div className="flex gap-2 justify-center">
          <FormOutlined
            onClick={() => {
              setSelected(record);
              setModalOpen(true);
            }}
            className="cursor-pointer"
          />
          <QrcodeOutlined onClick={handleShowQr} className="cursor-pointer" />
          <DeleteOutlined
            onClick={() => onDelete(record)}
            className="cursor-pointer"
          />
        </div>
      ),
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: 120,
      sorter: (a, b) => a.id.localeCompare(b.id),
      ellipsis: true,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 240,
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      ellipsis: true,
    },
    {
      title: "Contraseña",
      dataIndex: "contraseña",
      key: "contraseña",
      render: () => "•••••••", // siempre oculto
      width: 160,
    },
    {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      filters: activeFilters,
      onFilter: (val, rec) => rec.activo === val,
      render: (v) => (v ? "✔️" : ""),
      sorter: (a, b) => Number(a.activo) - Number(b.activo),
      width: 120,
    },
    {
      title: "Perfil",
      dataIndex: "perfil",
      key: "perfil",
      filters: perfilFilters,
      onFilter: (val, rec) => rec.perfil === val,
      sorter: (a, b) => a.perfil.localeCompare(b.perfil),
      ellipsis: true,
      width: 170,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      ellipsis: true,
    },
  ];

  return (
    <>
      <Table<UserType>
        rowKey="key"
        columns={columns}
        dataSource={data}
        onChange={onTableChange}
        pagination={false}
      />
      <EditUserModal
        visible={modalOpen}
        initialValues={selected ?? undefined}
        onCancel={handleCancel}
        onSave={handleSave}
      />
      <QrModal
        open={QrModalOpen}
        onClose={() => setQrModalOpen(false)}
        qrSrc="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Ejemplo"
      />
    </>
  );
};

export default UsersTable;
