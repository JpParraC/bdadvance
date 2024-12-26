import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/authcontext';
import { hasPermission } from '../../../permissions';  // Asegúrate de importar la función

export const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Verificar si el usuario está logueado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si se requiere un permiso y si el usuario tiene los permisos necesarios
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
