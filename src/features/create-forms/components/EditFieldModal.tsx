// src/components/EditFieldModal.tsx
import { FC, useEffect } from "react";

import {
  Button,
  Checkbox,
  ColorPicker,
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
  visible: boolean;
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
          <div className="flex flex-col pl-2 w-1/2">
            <Form.Item
              label="Color"
              name="color"
              initialValue="#000000"
              className="w-full"
              rules={[{ required: true }]}
            >
              <ColorPicker format="hex" showText />
            </Form.Item>

            {variant === "texto" && (
              <Form.Item label="Tamaño" name="tamano">
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

          <div className="self-center">
            <Form.Item name="requerido" valuePropName="checked">
              <Checkbox className="flex-row-reverse">Requerido</Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="w-full pl-2">
          {variant === "texto" && (
            <Form.Item label="Opciones" name="opciones">
              <Select placeholder="Selecciona opción">
                {opcionesList.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

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

        <Form.Item label="Regla de Visualización" name="reglaVisualizacion">
          <TextArea rows={3} placeholder="Condición..." />
        </Form.Item>

        {variant === "firma" && (
          <>
            <Form.Item label="Datos" name="datos">
              <TextArea rows={3} placeholder="Valores..." />
            </Form.Item>
          </>
        )}

        {variant === "combo" && (
          <div className="flex flex-col w-full pl-2 gap-4">
            <div className="border-gray-500 border-b-1">Datos</div>
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
