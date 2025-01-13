import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        localStorage.setItem('token', response.data.token);

        // Redirecciona al dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid staff ID or password');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error);
      setErrorMessage('Something went wrong. Please try again.');
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
