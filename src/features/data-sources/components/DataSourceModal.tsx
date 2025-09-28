// src/components/NewFormModal.tsx
import { FC, useEffect, useState } from "react";

import { Button, Form, Input, Select, type ModalProps } from "antd";
import type { Moment } from "moment";

import BaseModal from "@/components/BaseModal";

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
}

// Props que recibe este modal
export interface NewFormModalProps extends Omit<ModalProps, "title"> {
  visible: boolean;
  onCancel: () => void;
  /** Callback con los valores al hacer submit */
  onCreate: (values: NewFormValues) => void;
  initialValues?: Partial<NewFormValues>;
}

const DataSouceModal: FC<NewFormModalProps> = ({
  visible,
  onCancel,
  onCreate,
  initialValues,
  ...modalProps
}) => {
  const [form] = Form.useForm<NewFormValues>();

  const [tipoFuente, setTipoFuente] = useState<string | undefined>(undefined);
  const [tipoObtencionDato, setTipoObtencionDato] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: NewFormValues) => {
    onCreate(values);
    form.resetFields();
    onCancel();
    setTipoFuente(undefined);
    setTipoObtencionDato(undefined);
  };

  const handleCancel = () => {
    form.resetFields();
    setTipoFuente(undefined);
    setTipoObtencionDato(undefined);
    onCancel();
  };

  return (
    <BaseModal
      open={visible}
      onCancel={handleCancel}
      title="Adición de Fuente de Dato"
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
        <div className="w-2xl">
          <Form.Item
            label="Código"
            name="codigo"
            rules={[
              { required: true, message: "Por favor ingresa una código" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl">
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[
              { required: true, message: "Por favor ingresa una descripcion" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="w-2xl pl-1">
          <Form.Item
            label="Tipo fuente:"
            name="tipoFuente"
            rules={[
              { required: true, message: "Seleccione un tipo de fuente" },
            ]}
          >
            <Select
              placeholder="Selecciona un tipo de fuente"
              onChange={(value) => setTipoFuente(value)}
            >
              <Select.Option value="local">Local</Select.Option>
              <Select.Option value="externa">Externa</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {tipoFuente === "externa" && (
          <>
            <div className="w-2xl pl-7">
              <Form.Item
                label="Obtención de datos:"
                name="obtencionDatos"
                rules={[
                  { required: true, message: "Seleccione un tipo de fuente" },
                ]}
              >
                <Select
                  placeholder="Obtención de datos:"
                  onChange={(value) => setTipoObtencionDato(value)}
                >
                  <Select.Option value="archivos">Archivos</Select.Option>
                  <Select.Option value="web">Enlace Web</Select.Option>
                  <Select.Option value="odbc">Conectividad ODBC</Select.Option>
                </Select>
              </Form.Item>
            </div>

            {tipoObtencionDato === "web" && (
              <Form.Item
                label="Enlace URL:"
                name="url"
                rules={[{ required: true, message: "Ingrese el enlace url" }]}
              >
                <Input placeholder="https:\\example.com" />
              </Form.Item>
            )}

            {tipoObtencionDato === "odbc" && (
              <>
                <Form.Item
                  label="Servidor / Host:"
                  name="server"
                  rules={[
                    { required: true, message: "Ingrese el servidor o host" },
                  ]}
                >
                  <Input placeholder="mi-servidor\\instancia o 192.168.1.50" />
                </Form.Item>

                <div className="w-2xl pl-7">
                  <Form.Item
                    label="Base de datos:"
                    name="database"
                    rules={[
                      { required: true, message: "Ingrese la base de datos" },
                    ]}
                  >
                    <Input placeholder="MiBase" />
                  </Form.Item>
                </div>

                <div className="w-2xl pl-7">
                  <Form.Item
                    label="Usuario:"
                    name="user"
                    rules={[{ required: true, message: "Ingrese el usuario" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="w-2xl pl-7">
                  <Form.Item
                    label="Contraseña:"
                    name="password"
                    rules={[
                      { required: true, message: "Ingrese la contraseña" },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>

                <div className="w-2xl pl-7">
                  <Form.Item
                    label="Comando (SQL):"
                    name="comando"
                    rules={[
                      { required: true, message: "Ingrese la consulta SQL" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="SELECT * FROM Clientes WHERE Activo = 1"
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </>
        )}

        <div className="w-2xl ">
          <Form.Item label="Intervalo (segs):" name="intervalo">
            <Input />
          </Form.Item>
        </div>

        <div className="flex justify-end h-9">
          <Form.Item>
            {tipoFuente === "externa" && (
              <Button
                style={{ marginRight: 8 }}
                onClick={async () => {
                  try {
                    const values = await form.validateFields([
                      "driver",
                      "server",
                      "database",
                      "user",
                      "password",
                    ]);
                    console.log("Probando conexión con:", values);

                    // Aquí va tu llamada al backend
                    // await api.testConnection(values);

                    // Feedback visual
                    // message.success("Conexión exitosa");
                  } catch (err) {
                    console.error("Error en conexión:", err);
                    // message.error("Error al probar la conexión");
                  }
                }}
              >
                Probar conexión
              </Button>
            )}
            <Button type="primary" htmlType="submit">
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

export default DataSouceModal;
