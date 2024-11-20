import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './views/pages/login/forgotpassword'; 

import ResetPassword from './views/pages/login/resetpassword';
import ProtectedRoute from './views/pages/login/protectedroute'; // Ajusta la ruta si es necesario


// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    // Eliminar cualquier tema almacenado en localStorage
    localStorage.removeItem('theme'); // Eliminar cualquier valor almacenado para el tema

    // Forzar siempre el tema 'light'
    setColorMode('light'); // Establece siempre el tema como 'light'

    // Verifica si el tema está configurado
    if (isColorModeSet()) {
      return;
    }

    // Si ya hay un tema guardado en el estado de Redux, úsalo (esto es redundante en este caso)
    setColorMode(storedTheme || 'light');
  }, [storedTheme, setColorMode, isColorModeSet]); // Dependencia de storedTheme

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
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
  );
};

export default App;
