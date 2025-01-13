import React, { createContext, useContext, useState, useEffect } from "react";
import { getPermissionsFromRole } from "../permissions"; // Asegúrate de que esta función esté bien implementada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Estado para el token JWT

  // Cargar usuario y token desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        permissions: [] // Inicializamos vacío los permisos
      });
      setToken(storedToken);

      // Cargar los permisos del rol del usuario desde el backend
      getPermissionsFromRole(parsedUser.role_id).then(permissions => {
        setUser(prevUser => ({
          ...prevUser,
          permissions
        }));
      });
    }
  }, []);

  const login = (userData, token) => {
    // Asigna los permisos al usuario según su rol
    getPermissionsFromRole(userData.role_id).then(permissions => {
      const userWithPermissions = {
        ...userData,
        permissions
      };

      // Guardar el usuario y el token en el localStorage
      setUser(userWithPermissions);
      setToken(token);
      localStorage.setItem("adminUser", JSON.stringify(userWithPermissions));
      localStorage.setItem("authToken", token);
    });
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
