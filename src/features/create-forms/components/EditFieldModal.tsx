// src/components/EditFieldModal.tsx
import { FC, useEffect, useRef, useState } from "react";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  type ModalProps,
} from "antd";

import BaseModal from "@/components/BaseModal";
import { useFuentesDatos } from "@/features/data-sources/hooks/useDataSources";

import { ElementItem } from "..";
import { usePatchCampoActualSingle } from "../hooks/useCampoActual";
import { useDeleteCampoActualSingle } from "../hooks/useDeleteCampoActualSingle";
import { usePostCampoActualSingle } from "../hooks/usePostCampoActualSingle";
import { FieldJson } from "../types";
import TsEditorCode, { type TsEditorCodeRef } from "./TsEditorCode";
import { normalizeFieldName } from "./utils";

const { Option } = Select;
const { TextArea } = Input;

// Forma de los valores del formulario
export interface FieldFormValues {
  secuencia: number;
  nombre: string;
  etiqueta: string;
  ayuda: string;
  color: string;
  requerido: boolean;
  tamano: number;
  opciones: string;
  grupo: string;
  reglaVisualizacion: string;
  min: number;
  max: number;
  valores?: string;
}

export type VariantType =
  | "texto"
  | "dato"
  | "niveles"
  | "switch"
  | "numero"
  | "fecha"
  | "hora"
  | "combo"
  | "multicombo"
  | "dataset"
  | "barra"
  | "completadoAuto"
  | "linea"
  | "firma"
  | "fotos"
  | "codigoBarra"
  | "email"
  | "dibujo"
  | "calc"
  | "grupo"
  | "datoFormulario"
  | "geoLocalizacion";

// Props del modal de edición
export interface EditFieldModalProps extends Omit<ModalProps, "title"> {
  visible: boolean | undefined;
  onCancel: () => void;
  /** Se dispara al guardar con todos los valores */
  onSave: (values: FieldFormValues) => void;
  /** Valores iniciales para edición */
  initialValues?: Partial<FieldFormValues>;
  /** Tipo de variante para mostrar en el Modal */
  variant?: VariantType;
  /** Listas para poblar los selects */
  opcionesList: string[];
  gruposList: string[];
  onDelete?: () => void;
  onBuild?: (json: FieldJson) => void;
  fieldsList?: ElementItem[];
  pageId?: string;
}

const EditFieldModal: FC<EditFieldModalProps> = ({
  visible,
  onCancel,
  onSave,
  onDelete,
  variant = "texto",
  initialValues,
  opcionesList,
  gruposList,
  onBuild,
  fieldsList,
  pageId,
  ...modalProps
}) => {
  const [form] = Form.useForm<FieldFormValues>();

  const tsEditorRef = useRef<TsEditorCodeRef>(null);

  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const { mutateAsync: postCampoSingle, isPending: savingPost } =
    usePostCampoActualSingle();

  const { mutateAsync: patchCampoSingle, isPending: savingPatch } =
    usePatchCampoActualSingle();

  const { mutateAsync: deleteCampoSingle, isPending: deletingCampo } =
    useDeleteCampoActualSingle();

  // Cuando se abre el modal, cargamos valores o reseteamos
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  // 4) En handleFinish: construir y devolver el JSON + normalizar values.opciones
  const handleFinish = async (values: FieldFormValues) => {
    const normalizedName = normalizeFieldName(values.nombre);

    // Dentro de handleFinish
    let itemsList: string[] = [];

    if (variant === "combo" && values.valores) {
      itemsList = values.valores
        .split("\n") // separa por salto de línea
        .map((v) => v.trim()) // elimina espacios extra
        .filter((v) => v !== ""); // descarta líneas vacías
    }

    // OBTENER EL CÓDIGO DEL EDITOR SI EXISTE
    let codigoCalculado = "";
    let propsList: string[] = [];

    if (variant === "calc" && tsEditorRef.current) {
      codigoCalculado = tsEditorRef.current.getFullCode();
      propsList = tsEditorRef.current.getPropsList(); // Obtener la lista de props
    }

    if (variant === "dato") {
      const { clase } = mapDatoToTipoClase(values.opciones);

      // JSON compilado
      const compiled = {
        clase,
        nombre_campo: normalizedName,
        etiqueta: values.etiqueta,
        ayuda: values.ayuda ?? "",
        requerido: !!values.requerido,
        config: {},
      } as unknown as FieldJson;

      // Devuélvelo al padre inmediato
      onBuild?.(compiled);

      // (opcional recomendado) normaliza lo que sube por onSave
      values = { ...values };
    } else {
      const { clase } = mapDatoToTipoClase(undefined, variant);

      // console.warn("Variant:", variant, selectedDataset.id, selectedColumn);

      // JSON compilado
      const compiled = {
        clase,
        nombre_campo: normalizedName,
        etiqueta: values.etiqueta,
        ayuda: values.ayuda ?? "",
        requerido: !!values.requerido,
        config:
          variant === "calc" ? { vars: propsList, operation: codigoCalculado }
          : variant === "numero" ? { min: values.min, max: values.max }
          : variant === "combo" ? { items: itemsList }
          : variant === "dataset" ?
            {
              fuente_id: selectedDataset?.id ?? "",
              label_column: selectedColumn ?? "",
            }
          : {},
        grupoTemporal: values.grupo || undefined,
        ...(variant === "calc" && { tipo: "texto" }),
      };

      console.warn("Compiled field:", fieldsList, compiled);

      // 🔍 Validar duplicado (insensible a mayúsculas/minúsculas)
      const nameExists = fieldsList?.some(
        (el) => el.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (nameExists) {
        // aquí puedes usar AntD message.error o alert
        message.warning(
          `El nombre del campo: "${normalizedName}", ya existe en este formulario`
        );
        return;
      }

      if (!initialValues) {
        // 🟢 Crear nuevo campo (uno por uno)
        message.loading({ content: "Creando campo...", key: "saving" });

        const res = await postCampoSingle({
          pageId: pageId!,
          campo: compiled,
        });

        message.destroy("saving");

        if (!res) {
          message.error("Error al crear el campo.");
        } else {
          message.success("Campo creado correctamente ✅");
        }
      } else {
        // 🔵 Actualizar campo existente
        if (!pageId) {
          message.error("Falta pageId para actualizar el campo.");
          return;
        }

        // Detectar campo actual si existe fieldsList
        const currentField = fieldsList?.find(
          (f) => f.name === values.nombre || f.values?.nombre === values.nombre
        );

        const campoId = currentField?.id;

        if (!campoId) {
          message.error("No se encontró el ID del campo a actualizar.");
          return;
        }

        message.loading({ content: "Actualizando campo...", key: "saving" });

        const res = await patchCampoSingle({ campoId, campo: compiled });

        message.destroy("saving");

        if (!res) {
          message.error("Error al actualizar el campo.");
        } else {
          message.success("Campo actualizado correctamente ✅");
        }
      }

      // Devuélvelo al padre inmediato
      onBuild?.(compiled);

      // (opcional recomendado) normaliza lo que sube por onSave
      values = { ...values };
    }

    onSave(values);
    form.resetFields();
    onCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleDelete = () => {
    // Buscar el campo actual por nombre (como se hace en handleFinish)
    const currentField = fieldsList?.find(
      (f) =>
        f.name === form.getFieldValue("nombre") ||
        f.values?.nombre === form.getFieldValue("nombre")
    );

    const campoId = currentField?.id;

    if (!campoId) {
      message.error("No se encontró el ID del campo a eliminar.");
      return;
    }

    Modal.confirm({
      title: "¿Eliminar este campo?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        try {
          message.loading({ content: "Eliminando campo...", key: "delete" });

          await deleteCampoSingle({ campoId });

          message.destroy("delete");
          message.success("Campo eliminado correctamente ✅");
          onDelete?.();

          form.resetFields();
          onCancel();
        } catch (err) {
          message.destroy("delete");
          message.error("Error al eliminar el campo ❌");
          console.error(err);
        }
      },
    });
  };

  const mapDatoToTipoClase = (
    opcion?: string,
    variant?: string
  ): { clase: string } => {
    console.warn("mapDatoToTipoClase", { opcion, variant });
    if (opcion === "Numero" || opcion === "numero" || variant === "numero")
      return { clase: "number" };
    if (opcion === "Comentarios") return { clase: "string" };
    if (opcion === "Nombre") return { clase: "string" };
    if (variant === "switch") return { clase: "boolean" };
    if (variant === "fecha") return { clase: "date" };
    if (variant === "hora") return { clase: "hour" };
    if (variant === "grupo") return { clase: "group" };
    if (variant === "calc") return { clase: "calc" };
    if (variant === "firma") return { clase: "firm" };
    if (variant === "combo") return { clase: "list" };
    if (variant === "dataset") return { clase: "dataset" };
    return { clase: "string" };
  };

  const valor_inicial = ["Normal", "Botones"];

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title={"Edición de campo: " + variant}
      width={600}
      {...modalProps}
    >
      <Form form={form} layout="horizontal" onFinish={handleFinish}>
        <div className="flex flex-row gap-24">
          {/* <Form.Item
            label="Secuencia"
            name="secuencia"
            rules={[
              { required: true, message: "Por favor, ingresa la secuencia" },
            ]}
            className="flex-row-reverse"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item> */}

          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              { required: true, message: "Por favor, ingresa el nombre" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex flex-row gap-10">
          <Form.Item
            label="Etiqueta"
            name="etiqueta"
            rules={[
              { required: true, message: "Por favor, ingresa la etiqueta" },
            ]}
          >
            <Input className="left-3" />
          </Form.Item>

          <Form.Item label="Ayuda" name="ayuda">
            <Input />
          </Form.Item>
        </div>

        <div className="flex gap-16">
          <div className="self-center">
            {(variant === "texto" ||
              variant === "dato" ||
              variant === "combo" ||
              variant === "firma" ||
              variant === "switch" ||
              variant === "fecha" ||
              variant === "numero") && (
              <Form.Item name="requerido" valuePropName="checked">
                <Checkbox className="flex-row-reverse">Requerido</Checkbox>
              </Form.Item>
            )}

            {/* {variant === "combo" && (
              <Form.Item
                label="Tipo selección: "
                name="opciones"
                initialValue={"Normal"}
                className="w-full"
              >
                <Select>
                  {valor_inicial.map((opt) => (
                    <Option key={opt} value={opt}>
                      {opt}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )} */}
          </div>
          <div className="flex flex-col pl-2 w-1/2">
            {variant === "dato" && (
              <Form.Item
                label="Tamaño"
                name="tamano"
                className="w-full"
                required
              >
                <InputNumber min={0} />
              </Form.Item>
            )}

            {variant === "fecha" && (
              <Form.Item
                label="Valor inicial"
                name="opciones"
                initialValue={"Sin valor"}
                className="w-full"
              >
                <Select>
                  {valor_inicial.map((opt) => (
                    <Option key={opt} value={opt}>
                      {opt}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>
        </div>

        <div className="w-full pl-2">
          {variant === "texto" ||
            (variant === "dato" && (
              <Form.Item label="Opciones" name="opciones">
                <Select placeholder="Selecciona opción">
                  {opcionesList.map((opt) => (
                    <Option key={opt} value={opt}>
                      {opt}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ))}

          <Form.Item label="Grupo" name="grupo">
            <Select placeholder="Selecciona grupo">
              {gruposList.map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {variant === "texto" ||
          (variant === "fecha" && (
            <Form.Item label="Regla de Visualización" name="reglaVisualizacion">
              <TextArea rows={3} placeholder="Condición..." />
            </Form.Item>
          ))}

        {variant === "numero" && (
          <div className="flex flex-col gap-5">
            <Card
              size="small"
              title={<span className="font-semibold">Límites de datos</span>}
              className="shadow-sm border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Cantidad mínima"
                  name={"min"}
                  // 💡 ARREGLO: Agregamos la dependencia para que se revalide cuando cambie 'max'
                  dependencies={["max"]}
                  rules={[
                    // La regla 'type: "number"' es redundante si usas InputNumber,
                    // pero la dejo si estás usando una versión anterior de Ant Design.
                    { type: "number", min: 0, message: "Debe ser ≥ 0" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const max = getFieldValue("max");
                        if (value == null || max == null) {
                          // Resuelve si el campo actual o el campo opuesto están vacíos
                          return Promise.resolve();
                        }

                        // Asegúrate de que ambos valores sean números para la comparación estricta
                        if (Number(value) >= Number(max)) {
                          return Promise.reject(
                            new Error("La mínima debe ser menor que la máxima")
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber disabled={false} min={0} className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Cantidad máxima"
                  name={"max"}
                  // 💡 ARREGLO: Agregamos la dependencia para que se revalide cuando cambie 'min'
                  dependencies={["min"]}
                  rules={[
                    { type: "number", min: 0, message: "Debe ser ≥ 0" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const min = getFieldValue("min");
                        if (value == null || min == null) {
                          // Resuelve si el campo actual o el campo opuesto están vacíos
                          return Promise.resolve();
                        }

                        // Asegúrate de que ambos valores sean números para la comparación estricta
                        if (Number(value) <= Number(min)) {
                          return Promise.reject(
                            new Error("La máxima debe ser mayor que la mínima")
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber disabled={false} min={0} className="w-full" />
                </Form.Item>
              </div>
            </Card>
          </div>
        )}

        {variant === "grupo" && (
          <div className="flex flex-col gap-5">
            <Card
              size="small"
              title={<span className="font-semibold">Límites de datos</span>}
              className="shadow-sm border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="Cantidad mínima"
                  name={"min"}
                  rules={[
                    { required: true, message: "Ingresa la cantidad mínima" },
                    { type: "number", min: 0, message: "Debe ser ≥ 0" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const max = getFieldValue("max");
                        if (value == null || max == null)
                          return Promise.resolve();
                        return value < max ?
                            Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "La mínima debe ser menor que la máxima"
                              )
                            );
                      },
                    }),
                  ]}
                >
                  <InputNumber disabled={false} min={0} className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Cantidad máxima"
                  name={"max"}
                  rules={[
                    { required: true, message: "Ingresa la cantidad máxima" },
                    { type: "number", min: 0, message: "Debe ser ≥ 0" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const min = getFieldValue("min");
                        if (value == null || min == null)
                          return Promise.resolve();
                        return value > min ?
                            Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "La máxima debe ser mayor que la mínima"
                              )
                            );
                      },
                    }),
                  ]}
                >
                  <InputNumber disabled={false} min={0} className="w-full" />
                </Form.Item>
              </div>
            </Card>

            <Card
              size="small"
              title={<span className="font-semibold">Datos</span>}
              className="shadow-sm border"
            >
              <Form.Item label="Valores" name={"Valores"}>
                <TextArea
                  disabled={false}
                  rows={4}
                  placeholder="Ingresa un valor por línea, o separados por coma…"
                />
              </Form.Item>
            </Card>
          </div>
        )}

        {variant === "firma" && (
          <>
            <Form.Item label="Datos" name="datos">
              <TextArea rows={3} placeholder="Valores..." />
            </Form.Item>
          </>
        )}

        {variant === "calc" && (
          <TsEditorCode ref={tsEditorRef} fieldsList={fieldsList} />
        )}

        {variant === "combo" && <ComboSection gruposList={gruposList} />}

        {variant === "dataset" && (
          <DatasetSection
            gruposList={gruposList}
            onDatasetChange={(ds) => setSelectedDataset(ds)}
            onColumnChange={(col) => setSelectedColumn(col)}
          />
        )}

        <div className="flex flex-row w-full h-16 justify-end gap-5 pt-8">
          {initialValues && (
            <Form.Item className="text-right">
              <Button
                type="primary"
                danger
                onClick={handleDelete}
                loading={savingPost || savingPatch || deletingCampo}
              >
                Eliminar
              </Button>
            </Form.Item>
          )}

          <Form.Item className="text-right">
            <Button
              type="primary"
              htmlType="submit"
              loading={savingPost || savingPatch || deletingCampo}
            >
              Guardar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};

export default EditFieldModal;

function ComboSection({ gruposList }: { gruposList: string[] }) {
  const { data: dataSources, isLoading, error } = useFuentesDatos();
  const [selectedDataset, setSelectedDataset] = useState<any>(null);

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  // Manejar selección del dataset
  const handleDatasetChange = (datasetName: string) => {
    const ds = dataSources?.find((d) => d.nombre === datasetName);
    setSelectedDataset(ds || null);
  };

  return (
    <div className="flex flex-col w-full pl-2 gap-4">
      <Card
        size="small"
        title={<span className="font-semibold">Datos</span>}
        className="shadow-sm border"
      >
        <Form.Item label="Valores:" name="valores" className="w-full">
          <TextArea
            rows={7}
            placeholder="Escribe los valores separados por filas"
            className="overflow-x-auto whitespace-nowrap"
          />
        </Form.Item>
      </Card>
    </div>
  );
}

function DatasetSection({
  gruposList,
  onDatasetChange,
  onColumnChange,
}: {
  gruposList: string[];
  onDatasetChange?: (dataset: any) => void;
  onColumnChange?: (column: string | null) => void;
}) {
  const { data: dataSources, isLoading, error } = useFuentesDatos();
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  // Manejar selección del dataset
  const handleDatasetChange = (datasetName: string) => {
    const ds = dataSources?.find((d) => d.nombre === datasetName);
    setSelectedDataset(ds || null);
    setSelectedColumn(null);

    onDatasetChange?.(ds || null);
    onColumnChange?.(null);
  };

  const handleColumnChange = (col: string) => {
    setSelectedColumn(col);
    onColumnChange?.(col);
  };

  console.warn("Selected Dataset:", selectedDataset);

  return (
    <div className="flex flex-col w-full pl-2 gap-4">
      <Card
        size="small"
        title={<span className="font-semibold">Datos</span>}
        className="shadow-sm border"
      >
        <Form.Item label="DataSet" name="dataset">
          <Select
            placeholder="Selecciona un dataset"
            onChange={handleDatasetChange}
            allowClear
          >
            {dataSources?.map((g) => (
              <Option key={g.id} value={g.nombre}>
                {g.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Segundo Select: solo aparece cuando hay dataset seleccionado */}
        {selectedDataset && (
          <Form.Item label="Columna" name="columna">
            <Select
              placeholder="Selecciona una columna"
              onChange={handleColumnChange}
              allowClear
            >
              {selectedDataset.columnas?.map((col: string) => (
                <Option key={col} value={col}>
                  {col}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Card>
    </div>
  );
}
