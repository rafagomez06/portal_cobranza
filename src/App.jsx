import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import Pagos from "./pages/Pagos"; //Cambiar esto por la que va quedar
import Login from "./pages/Login";
import RestablecerPass from "./pages/RestablecerPass";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (sin layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<RestablecerPass />} />

        {/* Rutas privadas (con layout) */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Inicio />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="pagos" element={<Pagos />} />{" "}
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
