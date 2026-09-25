import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtencion de cliente de storage para obtener facturas
  useEffect(() => {
    try {
      const clienteRaw = localStorage.getItem("cliente");
      if (clienteRaw) {
        const clienteData = JSON.parse(clienteRaw);
        if (clienteData?.cod_cliente) {
          const codCliente = clienteData?.cod_cliente;
          const correo = clienteData?.correo_cliente;
          const nomCliente = clienteData?.nom_cliente;
          const token = localStorage.getItem("token");

          if (correo && token && codCliente) {
            setUser({ codCliente, token, correo, nomCliente });
          }
        }
      }
    } catch (err) {
      console.error("Error leyendo cliente de storage", err);
    } finally {
      setIsLoading(false);
    }
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
    localStorage.setItem("login_activo", "1");
    localStorage.setItem("token", token);

    setUser({
      cod_cliente,
      token,
      correo_cliente,
      nom_cliente,
      moneda_cliente,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
