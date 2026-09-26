import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spin />; //Cargando
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
