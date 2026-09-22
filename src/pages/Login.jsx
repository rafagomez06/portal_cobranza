import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Divider,
  Flex,
} from "antd";
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
  titleStyle,
  subtitleStyle,
  forgotPasswordStyle,
} from "../configs/Estilos";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Aqui va el llamado al service para el backend
      // const response = await api.post("/auth/login", values);
      console.log("Datos enviados:", values);

      // Simulación de petición
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ejemplo: guardar token
      // localStorage.setItem("token", response.data.token);

      message.success("¡Bienvenido al sistema!");
      navigate("/"); // Redirige al dashboard
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Credenciales incorrectas",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
