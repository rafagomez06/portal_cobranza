import React, { useState, useEffect } from "react";
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
  subtitleStyle,
  titleTextsInputs,
} from "../configs/Estilos";
import { useResetPassword } from "../hooks/useResetPassword";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const Configuracion = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ReiniciarPassword } = useResetPassword();
  const { user } = useAuth();

  // Obtencion de correo de cliente de storage
  useEffect(() => {
    console.log("user ", user);
    if (user) {
      try {
        if (user.correo_cliente) {
          // Actualiza el campo correo en el formulario
          form.setFieldsValue({ correo: user.correo_cliente });
        }
      } catch (err) {
        console.error("Error leyendo cliente de storage", err);
      }
    }
  }, [form]);

  const onResetPass = async (values) => {
    setLoading(true);

    console.log("LLEGA AQUI", values);
    const result = await ReiniciarPassword({
      cod_cliente: user.cod_cliente,
      correo_cliente: values.correo,
      actual_password: values.actual_password,
      nueva_password: values.nueva_password,
    });

    setLoading(false);

    if (result.success) {
      message.success(result.message);
      localStorage.clear();
      console.log("Sesión cerrada por cambio de pass.");
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

  const onResetPassFailed = () => {
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
          onFinish={onResetPass}
          onFinishFailed={onResetPassFailed}
          autoComplete="off"
          requiredMark={false}
        >
          {/* Correo */}
          <Form.Item
            label={<span style={titleTextsInputs}>Correo Electrónico</span>}
            name="correo"
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              readOnly={true}
              disabled={true}
            />
          </Form.Item>

          {/* Contraseña Actual*/}
          <Form.Item
            label={<span style={titleTextsInputs}>Contraseña Actual</span>}
            name="actual_password"
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
            label={<span style={titleTextsInputs}>Contraseña Nueva</span>}
            name="nueva_password"
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
              <span style={titleTextsInputs}>Confirmar Nueva Contraseña</span>
            }
            name="confirma_nueva_password"
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
