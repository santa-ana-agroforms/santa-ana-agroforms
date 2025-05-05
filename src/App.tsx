import React from 'react'
import { Card, Form, Input, Button } from 'antd'
import type { FormInstance } from 'antd'

const App: React.FC = () => {
  const [form] = Form.useForm<FormInstance>()

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Datos de login:', values)
    // aquí iría tu lógica de autenticación...
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'black',
      }}
    >
      <Card title="Iniciar sesión" style={{ width: 300 }}>
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
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default App
