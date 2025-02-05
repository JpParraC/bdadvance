import React, { useState, useEffect } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import { hasPermission } from '../../permissions'; 
import { useAuth } from '../../contexts/authcontext';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import '../../css/styles.css';

const AddManageAdmins = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [idStaff, setIdStaff] = useState('');  // Cambié el nombre a idStaff
  const [staffExists, setStaffExists] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [newAdmin, setNewAdmin] = useState({ id_staff: '', role: 1 }); // Cambié el valor del rol a un número

  const [editAdmin, setEditAdmin] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [editConfirmationModalVisible, setEditConfirmationModalVisible] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admins/all-users');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        console.error('Error obteniendo admins');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const checkStaffExists = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${idStaff}`);
      if (response.ok) {
        const data = await response.json();
        setStaffExists(data);  
        setNewAdmin({ id_staff: idStaff, role: 1 }); // Establecer el rol por defecto como 1
        setErrorMessage('');
      } else {
        setStaffExists(null);
        setErrorMessage('El ID de staff no existe.');
      }
    } catch (error) {
      console.error('Error verificando el staff:', error);
      setErrorMessage('Hubo un error al verificar el ID.');
    }
  };

  const handleAddAdmin = async () => {
    try {
      const staffResponse = await fetch(`http://localhost:5000/api/staff/${newAdmin.id_staff}`);

      if (staffResponse.ok) {
        const password = prompt("Ingrese una contraseña para el nuevo usuario:");

        if (!password) {
          alert("Debe ingresar una contraseña.");
          return;
        }

        // Enviar el rol como número (parseInt asegura que el valor sea un número)
        const userPayload = {
          password: password,
          role_id: newAdmin.role, // Se usa el número del rol
          staff_id: newAdmin.id_staff,
        };

        const userResponse = await fetch("http://localhost:5000/api/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        });

        if (userResponse.ok) {
          const data = await userResponse.json();
          setAdmins([...admins, data]);
          setAddModalVisible(false);
        } else {
          console.error("Error al crear el usuario en users.");
        }
      } else {
        alert("El ID del staff no existe.");
      }
    } catch (error) {
      console.error("Error en la inserción:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Manage Administrators</h2>
      <div className="text-start">
        {hasPermission(user, 'manage_admins') && (
          <CButton color="success" onClick={() => setAddModalVisible(true)} className="px-4">
            Add Administrator
          </CButton>
        )}
      </div>

      <div className="table-responsive mt-3">
        <Table striped bordered hover>
          
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr className="text-center" key={admin.staff_id}>
                <td>{admin.staff_id}</td>
                <td>{admin.name_staff}</td>
                <td>{admin.lastname_staff}</td>
                <td>{admin.email_staff}</td>
                <td>{admin.phone}</td>
                <td>{admin.staff_role_name}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {hasPermission(user, 'manage_admins') && (
                      <button className="btn btn-link" onClick={() => handleEditAdmin(admin.id)} title="Edit">
                        <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                      </button>
                    )}
                    {hasPermission(user, 'manage_admins') && (
                      <button className="btn btn-link" onClick={() => {
                        setAdminToDelete(admin);
                        setDeleteModalVisible(true);
                      }} title="Delete">
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para verificar ID de Staff */}
      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Verificar ID de Staff</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese ID de Staff"
            value={idStaff}
            onChange={(e) => setIdStaff(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={checkStaffExists}>Verificar</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para asignar rol si el ID es válido */}
      {staffExists && (
        <CModal visible={true} onClose={() => setStaffExists(null)}>
          <CModalHeader>
            <CModalTitle>Asignar Rol</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <select
              className="form-control"
              value={newAdmin.role}
              onChange={(e) => setNewAdmin({ ...newAdmin, role: parseInt(e.target.value) })} // Parsear a número
            >
              <option value="1">Administrador</option>
              <option value="2">Recepcionista</option>
            </select>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setStaffExists(null)}>Cancelar</CButton>
            <CButton color="success" onClick={handleAddAdmin}>Guardar</CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default AddManageAdmins;
