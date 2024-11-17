import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CRow,
} from '@coreui/react';

const ResetPassword = () => {
  const [email, setEmail] = useState(''); // Captura del email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Solicitar todos los admins desde el servidor
      const response = await axios.get('http://localhost:3001/admins');
      const admins = response.data;

      // Buscar al usuario que coincide con el email ingresado
      const user = admins.find((admin) => admin.email === email);

      if (user) {
        // Actualizar la contraseña del usuario
        const updatedUser = { ...user, password };

        // Enviar la solicitud PUT para actualizar el usuario
        await axios.put(`http://localhost:3001/admins/${user.id}`, updatedUser);

        alert('Password has been reset successfully');
        navigate('/login');
      } else {
        setErrorMessage('No user found with this email');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reset-password d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleResetPassword}>
                    <h1>Reset Password</h1>

                    {/* Mostrar mensaje de error si hay uno */}
                    {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                    {/* Campo para el correo electrónico */}
                    <CInputGroup className="mb-3">
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Campo para la nueva contraseña */}
                    <CInputGroup className="mb-4">
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Botón de reset */}
                    <CButton color="primary" className="px-4" type="submit">
                      Reset Password
                    </CButton>
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

export default ResetPassword;
