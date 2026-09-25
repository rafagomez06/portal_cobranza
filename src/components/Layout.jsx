import { useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Typography, Divider } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  layoutStyle,
  headerStyle,
  contentStyle,
  footerStyle,
} from "../configs/Estilos";
import { useAuth } from "../context/AuthContext";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

//Rutas de opciones Sidebar
const RUTA_CLAVE = {
  "/": "1",
  "/pagos": "2",
  "/configuracion": "3",
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = RUTA_CLAVE[location.pathname] || "1";
  const { user } = useAuth();

  const CerrarSesion = () => {
    // Elimina storage
    localStorage.clear();
    console.log("Sesión cerrada");
    navigate("/login"); // Redirige a tu pantalla de login
  };

  return (
    <Layout style={layoutStyle}>
      <Sider
        width={200}
        collapsedWidth={90}
        collapsible
        collapsed={collapsed}
        trigger={null} // Desactiva el trigger nativo para usar el del Header
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          overflow: "auto",
        }}
      >
        {/* Contenedor principal del Sider en columna */}
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 10px",
              gap: "10px",
              minHeight: "120px",
            }}
          >
            {/* Logo */}
            <img
              src="./src/assets/primos_logo_4k.png"
              width={collapsed ? 40 : 60}
              alt="Logo Primos and Cousins"
              style={{
                transition: "width 0.3s ease",
                objectFit: "contain",
              }}
            />

            {/* Nombre de la empresa */}
            <div
              className="logo"
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                lineHeight: "1.2",
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {collapsed ? "SIC" : "Sistema Integral de Cobranza"}
            </div>
          </div>

          {/* Menú de opciones */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ flex: 1, borderRight: 0, fontSize: 18 }}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: <Link to="/">Inicio</Link>,
              },
              {
                key: "2",
                icon: <DollarCircleOutlined />,
                label: <Link to="/pagos">Pagos</Link>,
              },
              {
                key: "3",
                icon: <SettingOutlined />,
                label: <Link to="/configuracion">Configuración</Link>,
              },
            ]}
          />

          {/* Cerrar Sesión */}
          <div style={{ padding: "12px", marginTop: "auto" }}>
            <Divider
              style={{ margin: "8px 0", borderColor: "rgba(255,255,255,0.15)" }}
            />
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={CerrarSesion}
              block
              style={{
                color: "#fff",
                display: "flex",
                fontSize: 16,
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {!collapsed && "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
        {/* Header con botón de colapsar */}
        <Header style={headerStyle}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "25px", color: "#fff" }}
          />
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text style={{ color: "#fff" }}>
              {user?.nom_cliente || "Usuario"}
            </Text>
          </Space>
        </Header>

        <Content style={contentStyle}>
          {/* Aquí se renderiza la pantalla seleccionada */}
          <Outlet />
        </Content>

        <Footer style={footerStyle}>
          ©2026 Primos & Cousins. Todos los derechos reservados.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
