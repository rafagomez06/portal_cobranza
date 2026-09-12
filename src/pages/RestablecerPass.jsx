import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { loginContainerStyle, loginCardStyle } from "../configs/Estilos";

const { Title, Text } = Typography;

const RestablecerPass = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 🔌 Aquí va tu llamada real al backend
      // await api.post("/auth/reset-password", values);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch (error) {
      message.error("No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginContainerStyle}>
      <Card style={loginCardStyle} variant="borderless">
        {sent ? (
          <Result
            status="success"
            title="Correo enviado"
            subTitle="Revisa tu bandeja de entrada para restablecer tu contraseña."
            extra={
              <Link to="/login">
                <Button type="primary">Volver al inicio de sesión</Button>
              </Link>
            }
          />
        ) : (
          <>
            <Title level={3} style={{ textAlign: "center", marginBottom: 4 }}>
              Restablecer contraseña
            </Title>
            <Text
              style={{
                display: "block",
                textAlign: "center",
                color: "#8c8c8c",
                marginBottom: 24,
              }}
            >
              Ingresa tu correo y te enviaremos instrucciones
            </Text>

            <Form
              name="reset-password"
              layout="vertical"
              size="large"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                label="Correo electrónico"
                name="email"
                rules={[
                  { required: true, message: "Por favor ingresa tu correo" },
                  { type: "email", message: "Ingresa un correo válido" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="correo@ejemplo.com"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Enviar instrucciones
                </Button>
              </Form.Item>
            </Form>

            <Link to="/login">
              <Button type="link" icon={<ArrowLeftOutlined />} block>
                Volver al inicio de sesión
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default RestablecerPass;
