import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Flex } from "antd";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import {
  loginContainerStyle,
  loginCardStyle,
  logoStyle,
  logoStyleImg,
  subtitleStyle,
  forgotPasswordStyle,
} from "../configs/Estilos";
import { useLogin } from "../hooks/useLogin";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { IniciarSesion } = useLogin();

  const onLogin = async (values) => {
    setLoading(true);

    const result = await IniciarSesion({
      cod_cliente: values.cliente,
      correo: values.email,
      password: values.password,
    });

    setLoading(false);

    if (result.success) {
      message.success(result.message);
      navigate("/");
      return;
    }

    switch (result.status_message) {
      case "canceled":
        return; // no mostramos nada
      case "network_error":
      case "timeout":
        message.error(result.message);
        break;
      case "login_failed":
        message.error(result.message);
        break;
      default:
        message.error(result.message);
    }
  };

  const onLoginFailed = () => {
    message.warning("Por favor revisa los campos del formulario");
  };

  return (
    <div style={loginContainerStyle}>
      <Card style={loginCardStyle} variant="borderless">
        {/* Logo / Título */}
        <div style={logoStyleImg}>
          <img
            src="./src/assets/primos_logo_4k.png"
            width={100}
            alt="Logo Primos and Cousins"
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={logoStyle}>
            Sistema Integral de Cobranza
          </Title>
          <Text style={subtitleStyle}>Primos & Cousins</Text>
        </div>

        {/* Formulario */}
        <Form
          form={form}
          name="login"
          layout="vertical"
          size="large"
          initialValues={{ remember: true }}
          onFinish={onLogin}
          onFinishFailed={onLoginFailed}
          autoComplete="off"
          requiredMark={false}
        >
          {/* Codigo de Cliente */}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Codigo de Cliente:
              </span>
            }
            name="cliente"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu codigo de cliente",
              },
              {
                type: "string",
                message: "Ingresa un codigo de cliente válido",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="ABC123"
              autoComplete="cod-cliente"
            />
          </Form.Item>

          {/* Correo */}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Correo Electrónico:
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
          </Form.Item>

          {/* Contraseña */}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Contraseña:
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
              { min: 6, message: "Debe tener al menos 6 caracteres" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="********"
              autoComplete="current-password"
            />
          </Form.Item>

          {/* Botón de inicio de sesión */}
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Iniciar Sesión
              </span>
            </Button>
          </Form.Item>

          {/* Restablecer Contraseña */}
          <Form.Item style={{ marginBottom: 12 }}>
            <Link to="/reset-password">
              <Button type="link" style={forgotPasswordStyle}>
                Restablecer Contraseña
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
