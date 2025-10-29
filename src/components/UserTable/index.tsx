// src/components/FormsLists/UsersTable.tsx
import React, { useEffect, useState } from "react";

import {
  DeleteOutlined,
  FormOutlined,
  QrcodeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { message, Table, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useCreateUsuario } from "@/features/users-list/hooks/useCreateUsuarios";
import { useQrAuth } from "@/features/users-list/hooks/useQrAuth";
import { useUpdateUsuario } from "@/features/users-list/hooks/useUpdateUsuario";

import EditUserModal, {
  EditUserValues,
} from "../DeviceTables/components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import QrModal from "./components/QrModal";

// un modal específico para usuarios

export interface UserType {
  nombre: string;
  activo: boolean;
  nombre_usuario: string;
  email: string;
  correo?: string;
  acceso_web?: boolean;
  // roles: Array<{
  //   id: string;
  //   nombre: string;
  //   descripcion?: string;
  // }>;
}

// Extender EditUserValues para que coincida con UserType
interface EditUserFormValues extends EditUserValues {
  roles: string[]; // IDs de roles como strings
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

  const { update, loading: updating } = useUpdateUsuario();

  const { create, loading: creating, error } = useCreateUsuario();

  const [creatingUser, setCreatingUser] = useState(Boolean);

  const handleAdd = () => {
    setCreatingUser(true);
    setSelected(null);
    setModalOpen(true);
  };

  const handleCancel = () => setModalOpen(false);

  const handleShowQr = (record: UserType) => {
    setSelected(record);
    reset();
    setQrModalOpen(true);
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

  const handleSave = async (values: EditUserFormValues) => {
    if (selected) {
      setCreatingUser(false);

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
        return;
      }

      try {
        await update(selected.nombre_usuario, payload);
        message.success("Usuario actualizado con éxito");
        setModalOpen(false);
      } catch (err: any) {
        message.error(err.message || "Error al actualizar usuario");
      }
    } else {
      // 🟢 CREAR → POST con validación y errores detallados

      if (data.some((user) => user.correo === values.email)) {
        message.warning("El correo ya está registrado, por favor usa otro");
        return;
      } else if (!values.contrasena || values.contrasena.length < 8) {
        message.warning("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      try {
        await create({
          nombre_usuario: values.nombre_usuario,
          nombre: values.nombre,
          password: values.contrasena ?? "",
          activo: values.activo ?? false,
          correo: values.email,
          acceso_web: values.acceso_web ?? false,
        });

        message.success("Usuario creado con éxito");
        setModalOpen(false);
      } catch (err: any) {
        const errorMap: Record<string, string> = {
          "Ensure this field has at least 8 characters.":
            "La contraseña debe tener al menos 8 caracteres",
          "This field is required.": "Este campo es obligatorio",
          "Enter a valid email address.": "El email no es válido",
        };

        if (err.message) {
          const jsonStart = err.message.indexOf("{");
          if (jsonStart !== -1) {
            try {
              const jsonString = err.message.slice(jsonStart);
              const parsed = JSON.parse(jsonString);

              Object.entries(parsed).forEach(([field, msgs]) => {
                (msgs as string[]).forEach((m) => {
                  const msg = errorMap[m] ?? m;
                  const capitalized =
                    field.charAt(0).toUpperCase() + field.slice(1);
                  message.error(`${capitalized}: ${msg}`);
                });
              });
              return;
            } catch (parseError) {
              console.warn("No se pudo parsear el JSON:", parseError);
            }
          }
        }

        message.error(err.message || "Error al crear usuario");
      }
    }
    setModalOpen(false);
  };

  useEffect(() => {
    if (QrModalOpen && selected) {
      startQr(selected.nombre_usuario);
    }
  }, [QrModalOpen, selected, startQr]);

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
              setCreatingUser(false);
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
    // {
    //   title: "Rol",
    //   key: "perfil",
    //   filters: perfilFilters,
    //   onFilter: (val, rec) => rec.nombre_usuario === val,
    //   sorter: (a, b) => a.nombre_usuario.localeCompare(b.nombre_usuario),
    //   ellipsis: true,
    //   width: 220,
    //   render: (_, record) => (
    //     <span title={record.roles.map((role) => role.nombre).join(", ")}>
    //       {record.roles.map((role) => role.nombre).join(", ")}
    //     </span>
    //   ),
    // },
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
              //roles: selected.roles.map((role) => role.id),
            }
          : undefined
        }
        onCancel={handleCancel}
        onSave={handleSave}
        creating={updating || creating}
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
