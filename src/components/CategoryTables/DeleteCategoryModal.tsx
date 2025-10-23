// src/components/DeleteCategoryModal.tsx
import { FC } from "react";

import { Button, message, Modal, type ModalProps } from "antd";

import { useDeleteCategoria } from "@/features/forms-list/hooks/useFormularios";

// import { useDeleteCategoria } from "@/features/forms-list/hooks/useCategorias";

export interface DeleteCategoryModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  categoryId: string;
  categoryName?: string;
}

const DeleteCategoryModal: FC<DeleteCategoryModalProps> = ({
  visible,
  onCancel,
  onDelete,
  categoryId,
  categoryName,
  ...modalProps
}) => {
  //   const { mutate: deleteCategoria, isPending } = useDeleteCategoria?.() ?? {
  //     mutate: (_id: string, _opts: any) => {},
  //     isPending: false,
  //   };

  const { mutate: deleteCategoria, isPending } = useDeleteCategoria();

  const handleDelete = () => {
    deleteCategoria(categoryId, {
      onSuccess: () => {
        message.success("Categoría eliminada correctamente");
        onCancel();
        if (onDelete) {
          onDelete(categoryId);
        }
      },
      onError: () => message.error("Error al eliminar la categoría"),
    });
  };

  return (
    <Modal
      open={visible}
      title="Eliminar Categoría"
      onCancel={onCancel}
      footer={null}
      {...modalProps}
    >
      <p>
        ¿Estás seguro de que deseas eliminar la categoría?
        <br />
        Esta acción no se puede deshacer.
      </p>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel} loading={isPending}>
          Cancelar
        </Button>
        <Button
          danger
          type="primary"
          loading={isPending}
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
