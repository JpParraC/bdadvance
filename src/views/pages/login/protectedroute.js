import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/authcontext';
import { hasPermission } from '../../../permissions';  

export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!requiredPermission) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(user, requiredPermission)) {
    console.warn(`User lacks permission: ${requiredPermission}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};