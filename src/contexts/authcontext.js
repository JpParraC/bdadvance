import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

// Crear contexto para autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // Para manejar la carga inicial

  // Cargar usuario y accessToken desde localStorage al iniciar la aplicación
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedAccessToken = localStorage.getItem("token");

        if (storedAccessToken) {
          const decodedToken = jwt_decode(storedAccessToken);

          if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("El token ha expirado. Redirigiendo a login...");
            logout(); // Si el token ha expirado, cierra sesión
          } else {
            setAccessToken(storedAccessToken);
            setUser({
              staff_id: decodedToken.staff_id,
              role_id: decodedToken.role_id,
              permissions: decodedToken.permissions || [],
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar la sesión:", error);
        logout();
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Función para iniciar sesión
  const login = (newAccessToken) => {
    try {
      // Decodificar el accessToken
      const decodedToken = jwt_decode(newAccessToken);

      // Validar la estructura del token
      if (!decodedToken.staff_id || !decodedToken.role_id) {
        throw new Error("El token no contiene información válida");
      }

      // Actualizar el estado del usuario y el accessToken
      const userWithRoles = {
        staff_id: decodedToken.staff_id,
        role_id: decodedToken.role_id,
        permissions: decodedToken.permissions || [],
      };

      setUser(userWithRoles);
      setAccessToken(newAccessToken);
      localStorage.setItem("token", newAccessToken); // Solo guardamos el accessToken
    } catch (error) {
      console.error("Error al procesar el accessToken:", error);
      logout();
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("token"); // Eliminar el accessToken
    localStorage.removeItem("user"); // Eliminar el usuario
    console.log("Sesión cerrada correctamente");
  };

  // Exponer el estado y funciones
  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {loading ? <div>Loading...</div> : children} {/* Muestra un indicador de carga mientras se valida la sesión */}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
