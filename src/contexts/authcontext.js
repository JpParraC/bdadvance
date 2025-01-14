import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';

 // Necesitamos esta librería para decodificar el token

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Estado para el token JWT

  // Cargar usuario y token desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      const decodedToken = jwt_decode(storedToken); // Decodificar el token
      const permissions = decodedToken.permissions || []; // Obtener los permisos desde el token

      setUser({
        ...decodedToken,
        permissions, // Asignar los permisos del token
      });
      setToken(storedToken);
    }
  }, []);

  const login = (userData, token) => {
    // Decodificamos el token para obtener los permisos
    const decodedToken = jwt_decode(token);
    const permissions = decodedToken.permissions || [];

    // Asignamos los permisos al usuario
    const userWithPermissions = {
      ...userData,
      permissions,
    };

    // Guardamos el usuario y el token en el localStorage
    setUser(userWithPermissions);
    setToken(token);
    localStorage.setItem("adminUser", JSON.stringify(userWithPermissions));
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    console.log("Logout llamado");
    if (user) {
      console.log(`Usuario que cerró sesión: ${JSON.stringify(user)}`);
      console.log("Sesión finalizada");
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
