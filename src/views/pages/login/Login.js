import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Importa jwt-decode
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import '../../../css/styles.css';

const Login = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Establecer el tema de la página
  useEffect(() => {
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }, []);

  // Función de login que se ejecuta al enviar el formulario
  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log('Formulario enviado');
  
    const staffIdInt = parseInt(staffId, 10); // Convierte el staff_id a entero
  
    if (isNaN(staffIdInt)) {
      setErrorMessage('Staff ID debe ser un número válido');
      return;
    }
  
    console.log('Datos enviados al backend:', { staffId: staffIdInt, password });
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        staff_id: staffIdInt, // Enviar como número entero
        password,
      });
  
      console.log('Respuesta del backend:', response);
  
      if (response.data && response.data.accessToken) {
        const token = response.data.accessToken; // Acceder al token
        localStorage.setItem('token', token);
        console.log('Token guardado en localStorage:', token);
  
        // Decodificar el token JWT
        const decodedToken = jwt_decode(token);
        console.log('Token decodificado:', decodedToken); 
        console.log('Permisos del token decodificado:', decodedToken.permissions);
  
        const { id, role_id, permissions } = decodedToken;
        console.log('Role ID:', role_id);
        console.log('Permisos del usuario:', permissions);
  
        if (!permissions) {
          setErrorMessage('No se encontraron permisos en el token');
          return;
        }
  
        // Guardar el objeto completo en localStorage
        const user = { id, staffId: staffIdInt, role_id, permissions };
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Usuario guardado en localStorage:', user);
  
        // Verificación de permisos antes de redirigir
        if (permissions) {
          if (role_id === 1) {
            navigate('/dashboard');
          } else if (role_id === 2) {
            navigate('/clients');
          } else {
            setErrorMessage('Rol desconocido. No se puede redirigir.');
          }
        } else {
          setErrorMessage('No tienes permisos suficientes para acceder a esta página.');
        }
      } else {
        setErrorMessage('ID de usuario o contraseña inválidos');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage('Ocurrió un error, por favor intente nuevamente.');
    }
  };
  
  return (
    <div className="login-background d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {errorMessage && (
                      <div className="text-danger mb-3">{errorMessage}</div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Staff ID"
                        autoComplete="staff-id"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgot-password">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
