import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/authcontext';  // Asegúrate de tener esta lógica para manejar el estado de autenticación
import { hasPermission } from '../../../permissions';  // Lógica de permisos que puedes adaptar

export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, token } = useAuth();  // Aquí asumo que 'useAuth' te devuelve el usuario y el token
  const location = useLocation();

  // Si no hay token, el usuario no está autenticado, redirige al login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no se requiere un permiso específico, simplemente renderiza los hijos
  if (!requiredPermission) {
    return children;
  }

  // Si no hay usuario (o los datos no están disponibles), redirige al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si el usuario no tiene el permiso necesario, redirige a la página de acceso no autorizado
  if (!hasPermission(user, requiredPermission)) {
    console.warn(`User lacks permission: ${requiredPermission}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está correcto, renderiza los hijos (el contenido de la página)
  return children;
};
