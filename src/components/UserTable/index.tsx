// src/components/FormsLists/UsersTable.tsx
import React, { useEffect, useState } from "react";

import {
  DeleteOutlined,
  FormOutlined,
  QrcodeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, message, Table, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useCreateUsuario } from "@/features/users-list/hooks/useCreateUsuarios";
import { useQrAuth } from "@/features/users-list/hooks/useQrAuth";
import { useUpdateUsuario } from "@/features/users-list/hooks/useUpdateUsuario";

import EditUserModal, {
  EditUserValues,
} from "../DeviceTables/components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import QrModal from "./components/QrModal";

export interface UserType {
  nombre: string;
  activo: boolean;
  nombre_usuario: string;
  email: string;
  acceso_web?: boolean;
}

interface EditUserFormValues extends EditUserValues {
  roles: string[];
}

interface Props {
  data: UserType[];
  onEdit: (record: UserType) => void;
  onDelete: (record: UserType) => void;
  onCreate: (values: EditUserValues) => void;
  onTableChange?: TableProps<UserType>["onChange"];
}

const parseBackendError = (err: any): string[] => {
  const errorMap: Record<string, string> = {
    "Ensure this field has at least 8 characters.":
      "La contraseña debe tener al menos 8 caracteres",
    "This field is required.": "Este campo es obligatorio",
    "Enter a valid email address.": "El email no es válido",
  };

  if (!err.message) return [err.message || "Error al crear usuario"];

  const jsonStart = err.message.indexOf("{");
  if (jsonStart === -1) return [err.message];

  try {
    const jsonString = err.message.slice(jsonStart);
    const parsed = JSON.parse(jsonString);
    
    const errors: string[] = [];
    Object.entries(parsed).forEach(([field, msgs]) => {
      (msgs as string[]).forEach((m) => {
        const msg = errorMap[m] ?? m;
        const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
        errors.push(`${capitalized}: ${msg}`);
      });
    });
    return errors;
  } catch (parseError) {
    console.warn("No se pudo parsear el JSON:", parseError);
    return [err.message];
  }
};

function buildPatchPayload<T extends Record<string, any>>(
  original: T,
  edited: T
): Partial<T> {
  const payload: Partial<T> = {};

  (Object.keys(edited) as (keyof T)[]).forEach((key) => {
    const origVal = original[key];
    const editVal = edited[key];

    const areEqual =
      Array.isArray(origVal) && Array.isArray(editVal) ?
        JSON.stringify(origVal) === JSON.stringify(editVal)
      : origVal === editVal;

    if (!areEqual) {
      payload[key] = editVal;
    }
  });

  return payload;
}

const handleUpdateUser = async (
  selected: UserType,
  values: EditUserFormValues,
  update: (username: string, payload: any) => Promise<any>
): Promise<boolean> => {
  const original = {
    nombre: selected.nombre,
    nombre_usuario: selected.nombre_usuario,
    correo: selected.email,
    activo: selected.activo,
    acceso_web: selected.acceso_web,
  };

  const edited = {
    nombre: values.nombre,
    nombre_usuario: values.nombre_usuario,
    correo: values.email,
    activo: values.activo,
    acceso_web: values.acceso_web,
  };

  const payload = buildPatchPayload(original, edited);

  if (Object.keys(payload).length === 0) {
    message.info("No hay cambios para guardar");
    return false;
  }

  await update(selected.nombre_usuario, payload);
  message.success("Usuario actualizado con éxito");
  return true;
};

const handleCreateUser = async (
  values: EditUserFormValues,
  create: (payload: any) => Promise<any>
): Promise<void> => {
  await create({
    nombre_usuario: values.nombre_usuario,
    nombre: values.nombre,
    password: values.contrasena ?? "",
    activo: values.activo,
    correo: values.email,
    acceso_web: values.acceso_web,
  });
  message.success("Usuario creado con éxito");
};

const UsersTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  onCreate,
  onTableChange,
}) => {
  const perfilFilters = Array.from(
    new Set(data.map((u) => u.nombre_usuario))
  ).map((p) => ({ text: p, value: p }));
  const activeFilters = [
    { text: "Sí", value: true },
    { text: "No", value: false },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<UserType | null>(null);

  const [QrModalOpen, setQrModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  const {
    startQr,
    data: qrData,
    loading: qrLoading,
    error: qrError,
    reset,
  } = useQrAuth();

  const { update } = useUpdateUsuario();
  const { create, loading: creating, error } = useCreateUsuario();

  const handleAdd = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleCancel = () => setModalOpen(false);

  const handleShowQr = (record: UserType) => {
    setSelected(record);
    reset();
    setQrModalOpen(true);
  };

  const handleSave = async (values: EditUserFormValues) => {
    try {
      if (selected) {
        const success = await handleUpdateUser(selected, values, update);
        if (success) setModalOpen(false);
      } else {
        await handleCreateUser(values, create);
        setModalOpen(false);
      }
    } catch (err: any) {
      const errors = parseBackendError(err);
      errors.forEach((error) => message.error(error));
    }
  };

  useEffect(() => {
    if (QrModalOpen && selected) {
      startQr(selected.nombre_usuario);
    }
  }, [QrModalOpen, selected, startQr]);

  const columns: ColumnsType<UserType> = [
    {
      title: (
        <Button
          type="text"
          onClick={handleAdd}
          title="Crear nuevo formulario"
          className="flex flex-col items-center justify-center p-2 h-auto"
        >
          <UserAddOutlined className="text-2xl" />
          <span className="text-xs mt-1">Nuevo usuario</span>
        </Button>
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
          <QrcodeOutlined
            onClick={() => handleShowQr(record)}
            className="cursor-pointer"
          />
          <DeleteOutlined
            onClick={() => {
              setUserToDelete(record);
              setDeleteModalOpen(true);
            }}
            className="cursor-pointer"
          />
        </div>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre_usuario",
      key: "nombre",
      width: 260,
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      ellipsis: true,
    },
    {
      title: "Contraseña",
      dataIndex: "contraseña",
      key: "contraseña",
      render: () => "•••••••",
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
      title: "Email",
      dataIndex: "correo",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      ellipsis: true,
    },
  ];

  return (
    <>
      <Table<UserType>
        rowKey="correo"
        columns={columns}
        dataSource={data}
        onChange={onTableChange}
        pagination={false}
      />
      <EditUserModal
        visible={modalOpen}
        initialValues={
          selected ?
            {
              ...selected,
            }
          : undefined
        }
        onCancel={handleCancel}
        onSave={handleSave}
        creating={creating}
      />
      <QrModal
        key={selected?.nombre_usuario}
        open={QrModalOpen}
        onClose={() => setQrModalOpen(false)}
        qrSrc={qrData?.qr}
        qrUserName={selected?.nombre_usuario}
      />
      <DeleteUserModal
        open={deleteModalOpen}
        userName={userToDelete?.nombre_usuario}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={() => {
          if (userToDelete) {
            onDelete(userToDelete);
          }
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </>
  );
};

export default UsersTable;