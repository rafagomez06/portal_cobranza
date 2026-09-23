// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { estaAutenticado } from "../utils/Auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!estaAutenticado()) {
    // Redirige al login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza el contenido protegido
  return children;
}
