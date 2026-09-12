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

const Pagos = () => {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: "Pagos",
          },
          {
            title: "An Application",
          },
        ]}
      />
      <h2>Pagos</h2>
      <Card style={CardStyle} variant="borderless">
        Aqui va el contenido del formulario y datatable
      </Card>
    </>
  );
};

export default Pagos;
