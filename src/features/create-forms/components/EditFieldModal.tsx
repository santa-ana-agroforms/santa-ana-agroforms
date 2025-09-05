// src/components/EditFieldModal.tsx
import { FC, useEffect } from "react";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  type ModalProps,
} from "antd";

import BaseModal from "@/components/BaseModal";

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
}

export type VariantType =
  | "texto"
  | "dato"
  | "niveles"
  | "switch"
  | "fecha"
  | "hora"
  | "combo"
  | "multicombo"
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
}

const EditFieldModal: FC<EditFieldModalProps> = ({
  visible,
  onCancel,
  onSave,
  variant = "texto",
  initialValues,
  opcionesList,
  gruposList,
  ...modalProps
}) => {
  const [form] = Form.useForm<FieldFormValues>();

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

  const handleFinish = (values: FieldFormValues) => {
    onSave(values);
    form.resetFields();
    onCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
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
          <Form.Item
            label="Secuencia"
            name="secuencia"
            rules={[
              { required: true, message: "Por favor, ingresa la secuencia" },
            ]}
            className="flex-row-reverse"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

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
            {variant === "texto" ||
              variant === "dato" ||
              (variant === "combo" && (
                <Form.Item name="requerido" valuePropName="checked">
                  <Checkbox className="flex-row-reverse">Requerido</Checkbox>
                </Form.Item>
              ))}

            {variant === "combo" && (
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
            )}
          </div>
          <div className="flex flex-col pl-2 w-1/2">
            {/* {variant === "texto" && (
              <Form.Item label="Tamaño" name="tamano">
                <InputNumber min={0} />
              </Form.Item>
            )} */}

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

        {variant === "combo" && (
          <div className="flex flex-col w-full pl-2 gap-4">
            <Card
              size="small"
              title={<span className="font-semibold">Datos</span>}
              className="shadow-sm border"
            >
              <Form.Item
                label="Valores: "
                name="valores"
                initialValue={"Normal"}
                className="w-full"
              >
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item label="DataSet" name="dataset">
                <Select placeholder="Selecciona un dataset">
                  {gruposList.map((g) => (
                    <Option key={g} value={g}>
                      {g}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </div>
        )}

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default EditFieldModal;
