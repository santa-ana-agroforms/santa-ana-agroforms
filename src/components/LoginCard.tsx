// src/components/LoginCard.tsx
import React from 'react'

import { Form, Input, Button } from 'antd'
import type { Rule } from 'antd/lib/form'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

interface Props {
  onFinish: (v: { username: string; password: string }) => void
}

export const LoginCard: React.FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<{ username: string; password: string }>()

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">

    <div className='w-full h-1/2 pb-5 bg-white flex justify-center'>
      <img
        src="src/assets/Santa-Ana-logo.png"
        className="h-full object-contain"
      />
    </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ username: '', password: '' }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu usuario' } as Rule]}
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
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' } as Rule]}
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
            className="bg-blue-500 hover:bg-blue-600 border-none text-black text-lg"
          >
            Entrar
          </Button>
        </Form.Item>

        <div className="text-center">
          <a href="/reset-password" className="text-sm text-gray-200 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </Form>
    </div>
  )
}
