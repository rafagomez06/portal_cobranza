import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  loginContainerStyle,
  loginCardStyle,
  logoStyle,
  logoStyleImg,
  subtitleStyle,
  returnLogin,
} from "../configs/Estilos";
import { useResetPassword } from "../hooks/useResetPassword";

const { Title, Text } = Typography;

const SolicitarReiniciarPass = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { SolicitudReiniciarPassword } = useResetPassword();

  const onEnviarCorreo = async (values) => {
    setLoading(true);

    const result = await SolicitudReiniciarPassword({
      correo: values.correo,
    });

    setLoading(false);
    localStorage.clear();
    if (result.success) {
      message.success(result.message);
      navigate("/login");
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

  const onEnviarCorreoFailed = () => {
    message.warning("Por favor revisa los campos del formulario");
  };

  const regresar = () => {
    localStorage.clear();
    navigate("/login");
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
            ¿Olvidaste tu contraseña?
          </Title>
          <Text style={subtitleStyle}>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecer tu contraseña.
          </Text>
        </div>

        {/* Formulario */}
        <Form
          form={form}
          name="login"
          layout="vertical"
          size="large"
          initialValues={{ remember: true }}
          onFinish={onEnviarCorreo}
          onFinishFailed={onEnviarCorreoFailed}
          autoComplete="off"
          requiredMark={false}
        >
          {/* Correo */}
          <Form.Item
            name="correo"
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Correo electrónico *"
              autoComplete="email"
            />
          </Form.Item>

          {/* Botón de Confirmar Cambio de Pass */}
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Enviar
            </Button>
          </Form.Item>

          {/* Restablecer Contraseña */}
          <Form.Item style={{ marginBottom: 12 }}>
            <Button onClick={regresar} type="link" style={returnLogin}>
              Volver al inicio de sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SolicitarReiniciarPass;
