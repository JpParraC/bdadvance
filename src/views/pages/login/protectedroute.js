import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/authcontext";

export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, accessToken } = useAuth(); // Obtener usuario y accessToken desde el contexto
  const location = useLocation();

  // Redirigir al login si no hay accessToken o no hay usuario
  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no se requiere un permiso específico, renderiza los hijos
  if (!requiredPermission) {
    return children;
  }

  // Verificar si el usuario tiene el permiso requerido
  const hasPermission = (user, requiredPermission) => {
    if (!user.permissions) return false;
    return user.permissions.includes(requiredPermission);
  };

  // Redirigir si el usuario no tiene permisos
  if (!hasPermission(user, requiredPermission)) {
    console.warn(`User lacks permission: ${requiredPermission}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Renderizar los hijos si todas las verificaciones pasan
  return children;
};
