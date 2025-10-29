import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";

import logo from "@/assets/Santa-Ana-logo.png";
import SantaAna from "@/assets/Santa-Ana.jpg";

export const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm<{ email: string }>();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger the animation after mount
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (values: { email: string }) => {
    message.loading({
      content: "Enviando correo de recuperación...",
      key: "reset",
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    message.success({
      content: `Se ha enviado un enlace de recuperación a ${values.email}`,
      key: "reset",
      duration: 3,
    });
    form.resetFields();
  };

  return (
    <div
      className="relative h-screen w-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${SantaAna})` }}
    >
      {/* capa para oscurecer ligeramente el fondo */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div
          className={`w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full h-1/2 pb-5 bg-white flex justify-center">
            <img src={logo} className="h-full object-contain" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Recuperar contraseña
          </h2>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="email"
              label="Correo electrónico"
              rules={[
                { required: true, message: "Por favor ingresa tu correo" },
                { type: "email", message: "Correo inválido" },
              ]}
            >
              <Input
                size="large"
                placeholder="ejemplo@correo.com"
                prefix={<MailOutlined className="text-black" />}
                className="!bg-transparent !border !border-black !text-black placeholder-gray-400"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-500 hover:bg-blue-600 border-none text-black text-lg"
              >
                Enviar enlace de recuperación
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                className="text-gray-700 hover:underline"
                onClick={() => {
                  setAnimate(false);
                  setTimeout(() => navigate("/"), 300);
                }}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
