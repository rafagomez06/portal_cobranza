import { Card } from "antd";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import {
  loginContainerStyle,
  CardStyle,
  logoStyle,
  logoStyleImg,
  titleStyle,
  subtitleStyle,
  forgotPasswordStyle,
} from "../configs/Estilos";

const Inicio = () => {
  return (
    <>
      <h2>Bienvenido</h2>
      <Card style={CardStyle} variant="borderless">
        Contenido General
      </Card>
    </>
  );
};

export default Inicio;
