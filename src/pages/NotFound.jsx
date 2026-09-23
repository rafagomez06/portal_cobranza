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
} from "../configs/Estilos";

const { Title, Text } = Typography;

const NotFound = () => {
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
      </Card>
    </div>
  );
};

export default NotFound;
