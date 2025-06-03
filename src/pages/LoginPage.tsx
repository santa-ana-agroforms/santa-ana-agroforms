// src/pages/LoginPage.tsx
import React from 'react'
import { Card, Form, Input, Button } from 'antd'
import type { FormInstance } from 'antd'
import { useNavigate } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<FormInstance>()
  const navigate = useNavigate()

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Datos de login:', values)
    // Aquí iría tu llamada al API de autenticación…
    const fakeLoginOk = true
    if (fakeLoginOk) {
      // Si el login es exitoso, navegamos a /home
      navigate('/home')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <Card title="Iniciar sesión" className="w-72">
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="mt-4">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
