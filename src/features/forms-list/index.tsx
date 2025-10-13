import React, { useCallback, useMemo, useState } from "react";

import {
  Collapse,
  message,
  Skeleton,
  TableColumnType,
  TableProps,
  Typography,
} from "antd";
import moment from "moment";

import CategoryTables from "@/components/CategoryTables";
import AssignFormModal from "@/components/CategoryTables/components/AssignFormModal";
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import DuplicateFormModal from "@/components/CategoryTables/components/DuplicateFormModal";
import NewFormModal, {
  NewFormValues,
} from "@/components/CategoryTables/components/NewFormModal";
import SuspendFormModal from "@/components/CategoryTables/components/SuspendFormModal";
import { getColumns } from "@/components/CategoryTables/data";

import { useUsuarios } from "../users-list/hooks/useUsuarios";
import { Usuario } from "../users-list/services/types";
import { useFormsListsData } from "./hooks/useFormsListsData";
import {
  useCrearAsignacionMultiple,
  useDeleteFormulario,
  useDuplicateFormulario,
  useSuspendFormulario,
} from "./hooks/useFormularios";

const { Panel } = Collapse;
const { Title } = Typography;

interface ItemType {
  key: string;
  id: number | string;
  titulo: string;
  desde: string;
  hasta: string;
  estado: string;
  esPublico: boolean;
  autoEnvio: boolean;
  forma_envio?: string;
  descripcion?: string;
}

interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

interface FormsListsProps {
  onSelectForm: (id: string | number) => void;
  sortAsc: boolean;
}

type OnChange = NonNullable<TableProps<ItemType>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

const FormsLists: React.FC<FormsListsProps> = ({ onSelectForm, sortAsc }) => {
  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useUsuarios();

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  //Modal para borrar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //Modal para duplicar
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  //Modal para suspender
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Modal Asignar
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  //const [assigning, setAssigning] = useState(false);

  const { mutate: deleteForm, isPending: isDeletingForm } =
    useDeleteFormulario();

  const { mutate: duplicate, isPending: isDuplicateForm } =
    useDuplicateFormulario();

  const { mutate: asignarMultiple, isPending: assigning } =
    useCrearAsignacionMultiple();

  const { mutate: suspender, isPending } = useSuspendFormulario();

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    console.warn("record: ", record);
    setSelectedItem(record);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback((record: ItemType) => {
    setSelectedItem(record); // Guarda el registro seleccionado
    setIsDeleteModalOpen(true); // Abre el modal
  }, []);

  const handleDuplicate = useCallback((record: ItemType) => {
    setSelectedItem(record); // Guarda el registro seleccionado
    setIsDuplicateModalOpen(true); // Abre el modal
  }, []);

  const handleSuspend = useCallback((record: ItemType) => {
    setSelectedItem(record); // Guarda el registro seleccionado
    setIsSuspendModalOpen(true); // Abre el modal
  }, []);

  const handleAssignOpen = useCallback((record: ItemType) => {
    setSelectedItem(record);
    setIsAssignModalOpen(true);
  }, []);

  const handleCreate = (values: NewFormValues) => {
    console.log("Nuevos valores:", values);
    // aquí haces el post o actualización de estado…
  };

  const handleConfirmDelete = useCallback(() => {
    if (!selectedItem) {
      message.warning("No hay un formulario seleccionado para borrar.");
      return;
    }

    deleteForm(selectedItem.id.toString(), {
      onSuccess: () => {
        message.success(`Formulario "${selectedItem.titulo}" eliminado.`);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      },
      onError: (err: any) => {
        message.error(
          err?.message ?? "No se pudo eliminar el formulario. Intenta de nuevo."
        );
      },
    });
  }, [selectedItem, deleteForm]);

  const handleDuplicateConfirm = useCallback(() => {
    if (!selectedItem) {
      message.warning("No hay un formulario seleccionado para duplicar.");
      return;
    }

    duplicate(selectedItem.id.toString(), {
      onSuccess: () => {
        message.success(
          `Formulario "${selectedItem.titulo}" duplicado correctamente.`
        );
        setIsDuplicateModalOpen(false);
        setSelectedItem(null);
      },
      onError: (err: any) => {
        message.error(
          err?.message ?? "No se pudo duplicar el formulario. Intenta de nuevo."
        );
      },
    });
  }, [selectedItem, duplicate]);

  const handleSuspendConfirm = useCallback(() => {
    if (!selectedItem) {
      message.warning("No hay un formulario seleccionado para suspender.");
      return;
    }

    suspender(selectedItem.id.toString(), {
      onSuccess: () => {
        message.success(
          `Formulario "${selectedItem.titulo}" suspendido correctamente.`
        );
        setIsSuspendModalOpen(false);
        setSelectedItem(null);
      },
      onError: (err: any) => {
        message.error(
          err?.message ??
            "No se pudo suspender el formulario. Intenta de nuevo."
        );
      },
    });
  }, [selectedItem, suspender]);

  const handleAssignConfirm = useCallback(
    async (userIds: string[]) => {
      if (!selectedItem) {
        message.warning("No hay un formulario seleccionado para asignar.");
        return;
      }
      asignarMultiple(
        { usuarios: userIds, formularios: [String(selectedItem.id)] },
        {
          onSuccess: ({ ok, errors }) => {
            if (ok.length) {
              const done =
                ok.length === 1 ? ok[0].usuario : `${ok.length} usuarios`;
              message.success(
                `Formulario "${selectedItem.titulo}" asignado a ${done}.`
              );
            }
            if (errors.length) {
              message.error(
                `No se pudo asignar a ${errors.length} usuario(s).`
              );
              // opcional: console.table(errors);
            }
            setIsAssignModalOpen(false);
            setSelectedItem(null);
          },
          onError: (err: any) => {
            message.error(
              err?.message ??
                "No se pudo asignar el formulario. Intenta de nuevo."
            );
          },
        }
      );
    },
    [selectedItem, asignarMultiple]
  );

  const { categoriesData, isLoading, error } = useFormsListsData();

  const sortedCategories = useMemo(() => {
    if (!categoriesData) return [];
    return [...categoriesData].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [categoriesData, sortAsc]);

  const rows = useMemo(
    () => (categoriesData ?? []).flatMap((c) => c.items),
    [categoriesData]
  );

  const userOptions = useMemo(
    () =>
      (usuarios as Usuario[]).map((u) => ({
        label: u.nombre?.trim() || u.nombre_usuario || u.email,
        value: u.nombre_usuario, // usamos nombre_usuario como id único
        disabled: u.activo === false, // si quieres deshabilitar inactivos
      })),
    [usuarios]
  );

  const columns = useMemo(
    () =>
      getColumns(
        rows,
        sortedInfo,
        filteredInfo,
        handleAdd,
        onSelectForm,
        handleEdit,
        handleDelete,
        handleDuplicate,
        handleSuspend,
        handleAssignOpen
      ),
    [rows, sortedInfo, filteredInfo]
  );

  // console.warn(
  //   "que coñoi es esto: ",
  //   categoriesData.find((c) => c.items.some((i) => i.key === selectedItem?.key))
  // );

  console.warn("selectedItem: ", selectedItem);

  return (
    <div className="flex flex-col p-4 w-full gap-7 ">
      {isLoading || categoriesData.length === 0 ?
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      : <>
          <CategoryTables<ItemType>
            data={sortedCategories}
            columns={columns as TableColumnType<ItemType>[]}
            onTableChange={handleChange}
          />

          <NewFormModal
            title={selectedItem ? "Edición de formulario" : undefined}
            visible={open}
            onCancel={() => setOpen(false)}
            onCreate={handleCreate}
            initialValues={
              selectedItem ?
                {
                  id: selectedItem.id,
                  titulo: selectedItem.titulo,
                  desde: moment(selectedItem.desde, "DD/MM/YYYY"),
                  hasta: moment(selectedItem.hasta, "DD/MM/YYYY"),
                  estado: selectedItem.estado,
                  esPublico: selectedItem.esPublico,
                  autoEnvio: selectedItem.autoEnvio,
                  categoria: categoriesData.find((c) =>
                    c.items.some((i) => i.key === selectedItem.key)
                  )?.key,
                  formaEnvio: selectedItem.forma_envio,
                  descripcion: selectedItem.descripcion,
                }
              : undefined
            }
          />

          <DeleteFormModal
            open={isDeleteModalOpen}
            formTitle={selectedItem ? selectedItem.titulo : ""}
            loading={isDeletingForm}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedItem(null);
            }}
          />

          <DuplicateFormModal
            open={isDuplicateModalOpen}
            formTitle={selectedItem ? selectedItem.titulo : ""}
            loading={isDuplicateForm}
            onConfirm={handleDuplicateConfirm}
            onCancel={() => {
              setIsDuplicateModalOpen(false);
              setSelectedItem(null);
            }}
          />

          <SuspendFormModal
            open={isSuspendModalOpen}
            formTitle={selectedItem ? selectedItem.titulo : ""}
            loading={isPending}
            onConfirm={handleSuspendConfirm}
            onCancel={() => {
              setIsSuspendModalOpen(false);
              setSelectedItem(null);
            }}
          />

          <AssignFormModal
            open={isAssignModalOpen}
            onCancel={() => {
              setIsAssignModalOpen(false);
            }}
            options={userOptions}
            loadingOptions={isLoadingUsuarios}
            submitting={assigning}
            onAssign={handleAssignConfirm}
          />
        </>
      }
    </div>
  );
};

export default FormsLists;
