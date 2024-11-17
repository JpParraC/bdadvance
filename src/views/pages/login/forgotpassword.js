// src/views/pages/forgotPassword/ForgotPassword.js

import React, { useState } from 'react';
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Hacer una solicitud para obtener admins
      const response = await axios.get('http://localhost:3001/admins');
      const admins = response.data;

      // Verificar si el email existe
      const user = admins.find((admin) => admin.email === email);

      if (user) {
        // Enviar mensaje de restablecimiento de contraseña
        setMessage(`please wait a moment ${email}. `);
        
  
        setTimeout(() => {
          navigate('/reset-password');
        }, 3000);
      } else {
        setMessage('Email not found');
      }
    } catch (error) {
      console.error('Forgot Password error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="forgot-password d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleForgotPassword}>
                    <h1>Forgot Password</h1>
                    <p className="text-body-secondary">
                      Enter your email to reset your password
                    </p>

                    {message && (
                      <div className="text-success mb-3">{message}</div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Submit
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/login">
                          <CButton color="link" className="px-0">
                            Back to Login
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

export default ForgotPassword;
