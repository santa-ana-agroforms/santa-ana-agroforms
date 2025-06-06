// src/components/LoginCard.tsx
import React from 'react'
import { Form, Input, Button } from 'antd'
import type { FormInstance } from 'antd'
import type { Rule } from 'antd/lib/form'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

interface LoginCardProps {
  onFinish: (values: { username: string; password: string }) => void
}

export const LoginCard: React.FC<LoginCardProps> = ({ onFinish }) => {
  // Creamos una referencia al formulario de Ant Design
  const [form] = Form.useForm<{ username: string; password: string }>()

  return (
    <div className="flex w-full max-w-4xl h-120 rounded-4xl overflow-hidden shadow-lg border-6 border-[#004600] ">
      {/*  Panel izquierdo: fondo blanco + ilustración  */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        {/* 
          Aquí importas tu propia imagen desde /assets/images/login-illustration.svg 
          Ajusta el src según tu proyecto.
        */}
        <img
          src="/src/assets/1745631897587.jpg"
          alt="Ilustración Agrícola"
          className="object-contain h-full w-full p-0"
        />
      </div>

      {/*  Panel derecho: fondo verde corporativo, formulario y textos en blanco  */}
      <div className="w-1/2 bg-[#004600] h-full flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Panel de Administración</h2>

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: '', password: '' }}
          className="w-full px-4"
        >
          <Form.Item
            label={<span className="text-white">Usuario</span>}
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' } as Rule]}
          >
            <Input
              size="large"
              placeholder="Usuario"
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Contraseña</span>}
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' } as Rule]}
          >
            <Input.Password
              size="large"
              placeholder="Contraseña"
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-md"
            />
          </Form.Item>


          <Form.Item>
            <Button
              htmlType="submit"
              block
              color="yellow" variant="solid"
            >
              Entrar
            </Button>
          </Form.Item>

          <div className="w-full text-center">
            <a href="/reset-password" className="text-sm text-orange-200 hover:text-orange-100">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </Form>
      </div>
    </div>
  )
}
