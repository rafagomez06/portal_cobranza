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
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import {
  FrmContainerStyle,
  FrmCardStyle,
  logoStyle,
  logoStyleImg,
  titleStyle,
  subtitleStyle,
  forgotPasswordStyle,
} from "../configs/Estilos";

const { Title, Text } = Typography;

const Configuracion = () => {
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
    <div style={FrmContainerStyle}>
      <Card style={FrmCardStyle} variant="borderless">
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
            Reiniciar Contraseña
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
                Correo Electrónico
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

          {/* Contraseña Actual*/}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Contraseña Actual
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

          {/* Contraseña Nueva*/}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Contraseña Nueva
              </span>
            }
            name="newPassword"
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

          {/* Confirmar Contraseña Nueva*/}
          <Form.Item
            label={
              <span
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Confirmar Nueva Contraseña
              </span>
            }
            name="confirmNewPassword"
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

          {/* Botón de Confirmar Cambio de Pass */}
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Cambiar Contraseña
              </span>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Configuracion;
