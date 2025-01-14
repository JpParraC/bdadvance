import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/authcontext';  // Asegúrate de tener esta lógica para manejar el estado de autenticación

export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, token } = useAuth();  // Aquí asumo que 'useAuth' te devuelve el usuario y el token
  const location = useLocation();

  // DESHABILITAMOS ESTA LÍNEA PARA PRUEBAS (Redirigir si no hay token)
  // if (!token) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // DESHABILITAMOS ESTA LÍNEA PARA PRUEBAS (Si no hay usuario, redirigir)
  // if (!user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // Si no se requiere un permiso específico, simplemente renderiza los hijos
  if (!requiredPermission) {
    return children;
  }

  // Verificar si el usuario tiene el permiso necesario (puedes comentar este bloque si no te interesa probarlo)
  // const hasPermission = (user, requiredPermission) => {
  //   if (!user || !user.permissions) return false;
  //   return user.permissions.includes(requiredPermission);
  // };

  // DESHABILITAMOS ESTA LÍNEA PARA PRUEBAS (Redirigir si no tiene permisos)
  // if (!hasPermission(user, requiredPermission)) {
  //   console.warn(`User lacks permission: ${requiredPermission}`);
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Si todo está correcto, renderiza los hijos (el contenido de la página)
  return children;
};
