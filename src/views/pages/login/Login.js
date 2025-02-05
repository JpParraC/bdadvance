import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado con:', { email, password });

    if (!email) {
      setErrorMessage('El email es obligatorio');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      console.log('Respuesta del backend:', response);

      if (response.data && response.data.accessToken) {
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        console.log('Token guardado en localStorage:', token);

        // Decodificar el token JWT
        const decodedToken = jwt_decode(token);
        console.log('Token decodificado:', decodedToken);

        const { 
          user_id, 
          staff_id, 
          role_id, 
          permissions, 
          name, 
          lastname, 
          email, 
          phone, 
          gen, 
          created_at, 
          updated_at 
        } = decodedToken;

        if (!user_id || !staff_id || !role_id || !permissions || !name || !lastname || !email || !phone) {
          setErrorMessage('Datos incompletos en el token');
          return;
        }

        console.log('Datos del usuario:', {
          user_id,
          staff_id,
          role_id,
          permissions,
          name,
          lastname,
          email,
          phone,
          gen,
          created_at,
          updated_at
        });

        if (!permissions) {
          setErrorMessage('No se encontraron permisos en el token');
          return;
        }

        localStorage.setItem('user', JSON.stringify({
          user_id, 
          staff_id, 
          role_id, 
          permissions, 
          name, 
          lastname, 
          email, 
          phone, 
          gen, 
          created_at, 
          updated_at 
        }));

        if (role_id === 1) {
          navigate('/dashboard');
        } else if (role_id === 2) {
          navigate('/clients');
        } else {
          setErrorMessage('Rol desconocido. No se puede redirigir.');
        }
      } else {
        setErrorMessage('Email o contraseña inválidos');
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
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
