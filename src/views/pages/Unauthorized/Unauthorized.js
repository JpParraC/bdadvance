// src/components/Unauthorized.js

import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Acceso No Autorizado</h1>
      <p style={styles.message}>Lo siento, no tienes permisos para acceder a esta página.</p>
      <Link to="/dashboard" style={styles.link}>Volver al Dashboard</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#dc3545',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  link: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Unauthorized;
