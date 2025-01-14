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

    // Convertir staffId a número
    const staffIdInt = parseInt(staffId, 10); // Convierte el staff_id a entero

    if (isNaN(staffIdInt)) {
      setErrorMessage('Staff ID debe ser un número válido');
      return;
    }

    console.log('Datos enviados al backend:', { staffId: staffIdInt, password });

    try {
      // Hacer POST al backend para verificar las credenciales
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        staff_id: staffIdInt, // Enviar como número entero
        password,
        
      });

      console.log('Login exitoso:', response.data); // Verifica la respuesta del backend

      // Si la respuesta es exitosa, guarda el token en localStorage
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Token guardado en localStorage:', token); // Verifica que el token se haya guardado

        // Decodificar el token JWT
        const decodedToken = jwt_decode(token); // Decodifica el token
        console.log('Token decodificado:', decodedToken); // Agrega log para ver los datos del token

        const { role_id, permissions } = decodedToken; // Obtiene el role_id y permissions del token decodificado
        console.log('Role ID:', role_id); // Verifica el role_id
        console.log('Permisos del usuario:', permissions); // Verifica los permisos

        // Crear el objeto de usuario
        const user = {
          staffId: staffIdInt,
          role_id,
          permissions,  // Asumiendo que el token contiene los permisos
        };

        // Guardar el objeto completo en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Usuario guardado en localStorage:', user); // Verifica que el objeto de usuario se haya guardado

        // Redirigir al usuario según su role_id
        if (role_id === 1) {
          console.log('Redirigiendo a dashboard');
          navigate('/dashboard'); // Redirigir a dashboard si es administrador
        } else if (role_id === 2) {
          console.log('Redirigiendo a clients');
          navigate('/clients'); // Redirigir a clients si es recepcionista
        } else {
          setErrorMessage('Rol desconocido. No se puede redirigir.');
        }
      } else {
        setErrorMessage('Invalid staff ID or password');
      }
    } catch (error) {
      // Log de error más detallado
      console.error('Login error:', error.response ? error.response.data : error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

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
