import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionMessage, setSessionMessage] = useState(null);
  const clearStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cliente");
    localStorage.removeItem("login_activo");
  };
  // Obtencion de cliente de storage para obtener facturas
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const clienteRaw = localStorage.getItem("cliente");

      if (token && clienteRaw) {
        const clienteData = JSON.parse(clienteRaw);

        // Validación mínima: necesitamos cod_cliente y token
        if (clienteData?.cod_cliente) {
          setUser({
            cod_cliente: clienteData.cod_cliente,
            correo_cliente: clienteData.correo_cliente,
            nom_cliente: clienteData.nom_cliente,
            id_cliente: clienteData.id_cliente,
            moneda_cliente: clienteData.moneda_cliente, // 👈 el que faltaba
            token,
          });
        } else {
          // Datos incompletos: limpiamos por seguridad
          clearStorage();
        }
      }
    } catch (err) {
      console.error("Error leyendo cliente de storage", err);
      clearStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  //Escucha sesión expirada
  useEffect(() => {
    const handleExpired = (e) => {
      clearStorage();

      setUser(null);
      setSessionMessage(
        e.detail?.message || "Tu sesión expiró. Vuelve a iniciar sesión.",
      );
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  //El usuario abre 2 pestañas, cierra sesión en una, realiza sincronizado
  useEffect(() => {
    const sync = (e) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
        setSessionMessage("Tu sesión se cerró en otra pestaña.");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (clienteData) => {
    const {
      cod_cliente,
      correo_cliente,
      id_cliente,
      nom_cliente,
      token,
      moneda_cliente,
    } = clienteData;

    localStorage.setItem(
      "cliente",
      JSON.stringify({
        cod_cliente,
        correo_cliente,
        nom_cliente,
        id_cliente,
        moneda_cliente,
      }),
    );
    localStorage.setItem("login_activo", true);
    localStorage.setItem("token", token);

    setUser({
      cod_cliente,
      token,
      correo_cliente,
      nom_cliente,
      moneda_cliente,
    });
    setSessionMessage(null);
  };

  const logout = () => {
    clearStorage();

    setUser(null);
    setSessionMessage(null);
  };

  const clearSessionMessage = () => setSessionMessage(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        sessionMessage,
        clearSessionMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
