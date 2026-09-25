import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import Pagos from "./pages/Pagos";
import Configuracion from "./pages/Configuracion";
import Login from "./pages/Login";
import SolicitarReiniciarPass from "./pages/SolicitarReiniciarPass";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ActualizarPass from "./pages/ActualizarPass";

const App = () => {
  //Creamos cliente
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // datos "frescos" por 5 minutos no refetcha en ese tiempo
        gcTime: 1000 * 60 * 10, // caché guardada 10 minutos aunque no haya componentes usándola
        refetchOnWindowFocus: false, // no refetcha al cambiar de pestaña o ventana
        refetchOnMount: false, // no refetcha al montar el componente si ya hay datos en caché
        retry: 2, // reintenta 2 veces si falla
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
              <Route path="configuracion" element={<Configuracion />} />
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
