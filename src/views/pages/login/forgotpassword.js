import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate de react-router-dom
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/request-reset', { email });
      setMessage(response.data.message);
      setError('');

      // Redirigir automáticamente a la página de restablecimiento de contraseña
      if (response.data.message) {
        navigate('/reset-password'); // Redirige a la página de reset-password después de que se haya enviado el código
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending reset request');
      setMessage('');
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
                  <CForm onSubmit={handleRequestReset}>
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a reset code.</p>

                    {message && <div className="text-success mb-3">{message}</div>}
                    {error && <div className="text-danger mb-3">{error}</div>}

                    <CInputGroup className="mb-3">
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CButton color="primary" className="px-4" type="submit">
                      Send Reset Code
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

export default ForgotPassword;
