// src/components/LoginCard.tsx
import React, { useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import type { Rule } from "antd/lib/form";

import logo from "@/assets/Santa-Ana-logo.png";

interface Props {
  onFinish: (v: { username: string; password: string }) => void;
  isPending: boolean;
}

export const LoginCard: React.FC<Props> = ({ onFinish, isPending }) => {
  const [form] = Form.useForm<{ username: string; password: string }>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onFinish(values);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
      <div className="w-full h-1/2 pb-5 bg-white flex justify-center">
        <img src={logo} className="h-full object-contain" />
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ username: "", password: "" }}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Por favor ingresa tu usuario" } as Rule,
          ]}
        >
          <Input
            size="large"
            placeholder="Usuario"
            prefix={<UserOutlined className="text-black" />}
            // Los "!" sirven para forzar el important de Tailwind si lo tienes activado
            className="!bg-transparent !border !border-black !text-black placeholder-gray-000"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu contraseña",
            } as Rule,
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Contraseña"
            prefix={<LockOutlined className="text-black" />}
            className="!bg-transparent !border !border-black !text-black placeholder-gray-000"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending || loading}
            className="bg-blue-500 hover:bg-blue-600 border-none text-black text-lg"
          >
            Entrar
          </Button>
        </Form.Item>

        <div className="text-center">
          <a
            href="/reset-password"
            className="text-sm text-gray-200 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </Form>
    </div>
  );
};
