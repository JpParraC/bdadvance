import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Recupera el usuario del localStorage
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData)); // Guardar usuario en localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser'); // Eliminar el usuario del localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
