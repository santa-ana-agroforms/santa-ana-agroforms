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
import DeleteFormModal from "@/components/CategoryTables/components/DeleteFormModal";
import DuplicateFormModal from "@/components/CategoryTables/components/DuplicateFormModal";
import NewFormModal, {
  NewFormValues,
} from "@/components/CategoryTables/components/NewFormModal";
import SuspendFormModal from "@/components/CategoryTables/components/SuspendFormModal";
import { getColumns } from "@/components/CategoryTables/data";

import { useFormsListsData } from "./hooks/useFormsListsData";
import {
  useDeleteFormulario,
  useDuplicateFormulario,
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
}

interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

interface FormsListsProps {
  onSelectForm: (id: string | number) => void;
}

type OnChange = NonNullable<TableProps<ItemType>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

const FormsLists: React.FC<FormsListsProps> = ({ onSelectForm }) => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  //Modal para borrar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //Modal para duplicar
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  //Modal para duplicar
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  const { mutate: deleteForm, isPending: isDeletingForm } =
    useDeleteFormulario();

  const { mutate: duplicate, isPending: isDuplicateForm } =
    useDuplicateFormulario();

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

  const { categoriesData, isLoading, error } = useFormsListsData();

  // {
  //   console.warn(categoriesData);
  // }

  const rows = useMemo(
    () => (categoriesData ?? []).flatMap((c) => c.items),
    [categoriesData]
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
        handleSuspend
      ),
    [rows, sortedInfo, filteredInfo]
  );

  console.warn("isLoading", isLoading, "data", categoriesData.length);

  return (
    <div className="flex flex-col p-4 w-full gap-7 ">
      {isLoading || categoriesData.length === 0 ?
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      : <>
          <CategoryTables<ItemType>
            data={categoriesData}
            columns={columns as TableColumnType<ItemType>[]}
            onTableChange={handleChange}
          />

          <NewFormModal
            visible={open}
            onCancel={() => setOpen(false)}
            onCreate={handleCreate}
            initialValues={
              selectedItem ?
                {
                  titulo: selectedItem.titulo,
                  desde: moment(selectedItem.desde, "DD/MM/YYYY"),
                  hasta: moment(selectedItem.hasta, "DD/MM/YYYY"),
                  estado: selectedItem.estado,
                  esPublico: selectedItem.esPublico,
                  autoEnvio: selectedItem.autoEnvio,
                  categoria: categoriesData.find((c) =>
                    c.items.some((i) => i.key === selectedItem.key)
                  )!.key,
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
            loading={false}
            onConfirm={() => {}}
            onCancel={() => {
              setIsSuspendModalOpen(false);
              setSelectedItem(null);
            }}
          />
        </>
      }
    </div>
  );
};

export default FormsLists;
