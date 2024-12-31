import React, { createContext, useContext, useState, useEffect } from "react";
import { getPermissionsFromRole } from "../permissions"; // Asegúrate de importar correctamente esta función

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        permissions: getPermissionsFromRole(parsedUser.role), // Calcula permisos basados en su rol
      });
    }
  }, []);

  const login = (userData) => {
    // Asigna los permisos al usuario según su rol
    const userWithPermissions = {
      ...userData,
      permissions: getPermissionsFromRole(userData.role),
    };

    setUser(userWithPermissions);
    localStorage.setItem("adminUser", JSON.stringify(userWithPermissions)); // Guardar usuario con permisos en localStorage
  };

  const logout = () => {
    console.log("Logout llamado");
    if (user) {
      console.log(`Usuario que cerró sesión: ${JSON.stringify(user)}`);
      console.log("Sesión finalizada");
    }
    setUser(null);
    localStorage.removeItem("adminUser");
    
    
  };
  
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
