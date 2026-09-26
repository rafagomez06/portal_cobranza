import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import Pagos from "./pages/Pagos";
import Login from "./pages/Login";
import SolicitarReiniciarPass from "./pages/SolicitarReiniciarPass";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ActualizarPass from "./pages/ActualizarPass";
import { message } from "antd";

const App = () => {
  //Creamos cliente
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: (failureCount, error) => {
          // No reintentar en errores de auth
          if (error?.status_code === 401 || error?.status === 401) return false;
          return failureCount < 2;
        },
      },
    },
  });

  // muestra el aviso de sesión expirada
  function SessionWatcher() {
    const { sessionMessage, clearSessionMessage } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
      if (sessionMessage) {
        //messageApi.warning(sessionMessage);

        messageApi.open({
          type: "warning",
          content: sessionMessage,
          duration: 10,
        });

        clearSessionMessage();
      }
    }, [sessionMessage, messageApi, clearSessionMessage]);

    return contextHolder;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionWatcher />
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas no requieren login */}
            <Route path="/login" element={<Login />} />
            <Route path="/actualizar-password" element={<ActualizarPass />} />
            <Route
              path="/solicitar-reiniciar-password"
              element={<SolicitarReiniciarPass />}
            />

            {/* Rutas protegidas requieren login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Inicio />} />
              <Route path="perfil" element={<Perfil />} />
              <Route
                path="configuracion"
                element={<SolicitarReiniciarPass />}
              />
              <Route path="pagos" element={<Pagos />} />
            </Route>

            {/* Cualquier ruta no registrada redirige a login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
