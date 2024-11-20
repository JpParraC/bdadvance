import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('adminUser'); // Comprueba si el usuario está en el localStorage

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
