// src/components/NewFormModal.tsx
import { FC, useEffect } from "react";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  type ModalProps,
} from "antd";
import type { Moment } from "moment";

import BaseModal from "@/components/BaseModal";
import { useCategorias } from "@/features/forms-list/hooks/useCategorias";
import { useCreateFormulario } from "@/features/forms-list/hooks/useFormularios";

import { type CategoryType } from "../data";

const { Option } = Select;

// Definimos la forma de los valores que devuelve el form
export interface NewFormValues {
  descripcion: string;
  titulo: string;
  permitirFotos: boolean;
  permitirGPS: boolean;
  desde: Moment;
  hasta: Moment;
  estado: string;
  formaEnvio: string;
  esPublico: boolean;
  autoEnvio: boolean;
  categoria: CategoryType["key"];
}

// Props que recibe este modal
export interface NewFormModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al hacer submit */
  onCreate: (values: NewFormValues) => void;
  initialValues?: Partial<NewFormValues>;
}

const NewFormModal: FC<NewFormModalProps> = ({
  visible,
  onCancel,
  onCreate,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm<NewFormValues>();

  // Cargar categorías
  const {
    data: categorias,
    isLoading: categoriasLoading,
    isError: categoriasError,
    error,
  } = useCategorias();

  // Mutación: crear formulario
  const { mutate: createFormulario, isPending } = useCreateFormulario();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  function mapToDto(v: NewFormValues) {
    return {
      nombre: v.titulo.trim(),
      descripcion: v.descripcion?.trim() ?? "",
      permitir_fotos: !!v.permitirFotos,
      permitir_gps: !!v.permitirGPS,
      disponible_desde_fecha: v.desde.format("YYYY-MM-DD"),
      disponible_hasta_fecha: v.hasta.format("YYYY-MM-DD"),
      estado: v.estado,
      forma_envio: v.formaEnvio,
      es_publico: !!v.esPublico,
      auto_envio: !!v.autoEnvio,
      categoria: v.categoria, // id (uuid)
    };
  }

  const handleFinish = (values: NewFormValues) => {
    // Validación simple de rango de fechas
    if (values.hasta.isBefore(values.desde, "day")) {
      message.warning("La fecha 'Hasta' no puede ser anterior a 'Desde'.");
      return;
    }

    createFormulario(mapToDto(values), {
      onSuccess: () => {
        message.success("Formulario creado");
        onCreate?.(values); // si el padre quiere reaccionar
        form.resetFields();
        onCancel();
      },
      onError: (err: any) => {
        message.error(
          err?.message ?? "No se pudo crear el formulario. Intenta de nuevo."
        );
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Adición de Formulario"
      {...modalProps}
      width={750}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        initialValues={{
          permitirFotos: false,
          permitirGPS: false,
          esPublico: false,
          autoEnvio: false,
        }}
      >
        <div className="w-2xl pl-9">
          <Form.Item
            label="Título"
            name="titulo"
            rules={[{ required: true, message: "Por favor ingresa un título" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl">
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[
              { required: true, message: "Por favor ingresa una descripción" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex gap-72">
          <Form.Item name="permitirFotos" valuePropName="checked">
            <Checkbox className="flex-row-reverse">Permitir Fotos: </Checkbox>
          </Form.Item>

          <Form.Item name="permitirGPS" valuePropName="checked">
            <Checkbox className="flex-row-reverse">Permitir GPS: </Checkbox>
          </Form.Item>
        </div>

        <div className="flex gap-40 pl-7">
          <Form.Item
            label="Desde"
            name="desde"
            rules={[{ required: true, message: "Selecciona fecha de inicio" }]}
            className="w-2/7"
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Hasta"
            name="hasta"
            rules={[{ required: true, message: "Selecciona fecha de fin" }]}
            className="w-[29%]"
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
        </div>

        <div className="flex gap-30 pl-7">
          <Form.Item
            label="Estado"
            name="estado"
            rules={[{ required: true, message: "Selecciona estado" }]}
            className="w-2/7"
          >
            <Select placeholder="Selecciona estado">
              <Option value="Ingresada">Ingresada</Option>
              <Option value="Activa">Activa</Option>
              <Option value="Suspendida">Suspendida</Option>
              <Option value="Pruebas">Pruebas</Option>
              <Option value="Anulada">Anulada</Option>
            </Select>
          </Form.Item>

          <div className="w-[35%]">
            <Form.Item
              label="Forma Envío"
              name="formaEnvio"
              rules={[{ required: true, message: "Selecciona forma de envío" }]}
            >
              <Select placeholder="Selecciona forma de envío">
                <Option value="En Linea/fuera Linea">En Línea/Fuera</Option>
                <Option value="En Linea">En Línea</Option>
                <Option value="Guardar">Guardar</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="flex gap-75">
          <div className="pl-4">
            <Form.Item name="esPublico" valuePropName="checked">
              <Checkbox className="flex-row-reverse">¿Es Público?</Checkbox>
            </Form.Item>
          </div>

          <Form.Item name="autoEnvio" valuePropName="checked">
            <Checkbox className="flex-row-reverse">Auto Envío?</Checkbox>
          </Form.Item>
        </div>

        <div className="w-2xl pl-3">
          <Form.Item
            label="Categoría"
            name="categoria"
            rules={[{ required: true, message: "Selecciona categoría" }]}
          >
            <Select
              placeholder="Selecciona categoría"
              loading={categoriasLoading}
              disabled={categoriasError}
              notFoundContent={
                categoriasError ?
                  ((error as Error)?.message ?? "Error al cargar categorías")
                : undefined
              }
              allowClear
            >
              {categorias?.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end h-9">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Guardar
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancelar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};

export default NewFormModal;
