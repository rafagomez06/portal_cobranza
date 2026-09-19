import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email_user");
    const rolGuardado = localStorage.getItem("rol_user");
    const token = localStorage.getItem("token");

    if (email && rolGuardado && token) {
      setUser({ email, token });
      setRol(rolGuardado);
    }

    setIsLoading(false);
  }, []);

  const login = (email, rol, token) => {
    localStorage.setItem("email_user", email);
    localStorage.setItem("rol_user", rol);
    localStorage.setItem("token", token);
    setUser({ email, token });
    setRol(rol);
  };

  const logout = () => {
    localStorage.removeItem("email_user");
    localStorage.removeItem("rol_user");
    localStorage.removeItem("token");
    setUser(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ user, rol, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
