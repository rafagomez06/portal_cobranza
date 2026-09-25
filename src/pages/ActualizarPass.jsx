import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Flex } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  loginContainerStyle,
  loginCardStyle,
  logoStyle,
  logoStyleImg,
  titleTextsInputs,
  textTitleLogin,
  subtitleStyle,
} from "../configs/Estilos";
import { useResetPassword } from "../hooks/useResetPassword";

const { Title, Text } = Typography;

const ActualizarPass = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ActualizarPassword } = useResetPassword();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // obtenemos token de url.

  const onActualizarPass = async (values) => {
    setLoading(true);
    // valida que tenga token
    if (!token) {
      message.warning(
        "No es posible cambiar la contraseña, el token no es válido.",
      );
      setLoading(false);
      return;
    }

    const result = await ActualizarPassword({
      token: token,
      nueva_password: values.nueva_password,
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

  const onActualizarPassFailed = () => {
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
        <div style={{ marginBottom: 12 }}>
          <Title level={3} style={logoStyle}>
            Sistema Integral de Cobranza
          </Title>
          <Text style={subtitleStyle}>Primos & Cousins</Text>
          <Title level={4} style={textTitleLogin}>
            Actualizar Contraseña
          </Title>
        </div>

        {/* Formulario */}
        <Form
          form={form}
          name="login"
          layout="vertical"
          size="large"
          initialValues={{ remember: true }}
          onFinish={onActualizarPass}
          onFinishFailed={onActualizarPassFailed}
          autoComplete="off"
          requiredMark={false}
        >
          {/* Nueva Contraseña */}
          <Form.Item
            label={<span style={titleTextsInputs}>Nueva Contraseña:</span>}
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
          {/* Confirma Contraseña */}
          <Form.Item
            label={<span style={titleTextsInputs}>Confirma Contraseña:</span>}
            name="confirma_password"
            dependencies={["nueva_password"]}
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
              { min: 6, message: "Debe tener al menos 6 caracteres" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("nueva_password") === value) {
                    return Promise.resolve();
                  }
                  // Si no coincide, muestra el mensaje de error de abajo
                  return Promise.reject(
                    new Error(
                      "Las contraseñas no coinciden, valida los datos.",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="********"
              autoComplete="current-password"
            />
          </Form.Item>

          {/* Botón de Actualizar Contraseña */}
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Actualizar Contraseña
              </span>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ActualizarPass;
