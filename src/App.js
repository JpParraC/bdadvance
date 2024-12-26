import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Páginas de login y otras
import ForgotPassword from './views/pages/login/forgotpassword'; 
import ResetPassword from './views/pages/login/resetpassword';
import {ProtectedRoute} from './views/pages/login/protectedroute'; 
import { AuthProvider } from './contexts/authcontext'; // Importa el AuthContext

// Containers y páginas cargadas perezosamente
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    // Eliminar cualquier tema almacenado en localStorage
    localStorage.removeItem('theme');
    
    // Forzar siempre el tema 'light'
    setColorMode('light');

    // Verifica si ya está configurado
    if (!isColorModeSet()) {
      setColorMode(storedTheme || 'light');
    }
  }, [storedTheme, setColorMode, isColorModeSet]);

  return (
    <AuthProvider>
      <HashRouter>
        <Suspense
          fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}
        >
          <Routes>
            {/* Rutas públicas */}
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/forgot-password" name="Forgot Password Page" element={<ForgotPassword />} />
            <Route exact path="/reset-password" name="Reset Password Page" element={<ResetPassword />} />
            
            {/* Rutas protegidas */}
            <Route
              path="*"
              name="Home"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
