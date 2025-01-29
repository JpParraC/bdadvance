import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import axios from 'axios';
import StaffForm from './stafform';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  // Estados para los modales de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [staffToEdit, setStaffToEdit] = useState(null);

  // Obtener datos de la API
  const fetchStaff = () => {
    axios.get('http://localhost:5000/api/staff')
      .then(response => setStaff(response.data))
      .catch(error => console.error("Error loading staff:", error));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Manejo del formulario
  const handleOpenForm = () => { 
    setEditStaff(null); 
    setShowForm(true); 
  };

  const handleCloseForm = () => { 
    setShowForm(false); 
  };

  const addStaff = (newStaff) => {
    const { id, ...staffWithoutId } = newStaff;
    axios.post('http://localhost:5000/api/staff', staffWithoutId)
      .then(response => {
        setStaff([...staff, response.data]);
        setShowForm(false);
      })
      .catch(error => console.error("Error adding staff:", error));
  };

  const updateStaff = (updatedStaff) => {
    axios.put(`http://localhost:5000/api/staff/${updatedStaff.id}`, updatedStaff)
      .then(response => {
        const updatedList = staff.map(member => 
          member.id === updatedStaff.id ? response.data : member
        );
        setStaff(updatedList);
        setShowForm(false);
      })
      .catch(error => console.error("Error updating staff:", error));
  };

  // Confirmación de eliminación
  const confirmDelete = (member) => {
    setStaffToDelete(member);
    setShowDeleteModal(true);
  };

  const deleteStaff = () => {
    if (staffToDelete) {
      axios.delete(`http://localhost:5000/api/staff/${staffToDelete.id}`)
        .then(() => {
          setStaff(staff.filter(member => member.id !== staffToDelete.id));
          setShowDeleteModal(false);
          setStaffToDelete(null);
        })
        .catch(error => console.error("Error deleting staff:", error));
    }
  };

  // Confirmación de edición
  const confirmEdit = (member) => {
    setStaffToEdit(member);
    setShowEditModal(true);
  };

  const editStaffMember = () => {
    setEditStaff(staffToEdit);
    setShowEditModal(false);
    setShowForm(true);
  };

  // Optimización de acceso a roles
  const rolesById = roles.reduce((acc, role) => {
    acc[role.id] = role;
    return acc;
  }, {});

  return (
    <div>
      <h2>Staff Management</h2>

      {/* Botón para agregar personal */}
      <Button variant="dark" onClick={handleOpenForm}>Add Staff</Button>

      {/* Tabla de Staff */}
      <div className="table-responsive mt-3">
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => {
              const role = rolesById[member.rol_staff_id];
              return (
                <tr className="text-center" key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name_staff}</td>
                  <td>{member.lastname_staff}</td>
                  <td>{member.email_staff}</td>
                  <td>{member.phone}</td>
                  <td>{role?.role_id|| "Unassigned"}</td>
                  <td>{member.status}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="link" onClick={() => confirmEdit(member)} title="Edit">
                        <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                      </Button>
                      <Button variant="link" onClick={() => confirmDelete(member)} title="Delete">
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Formulario de Staff */}
      <StaffForm
        show={showForm}
        handleClose={handleCloseForm}
        staff={editStaff}
        handleSave={editStaff ? updateStaff : addStaff}
        roles={roles}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{staffToDelete?.firstName} {staffToDelete?.lastName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteStaff}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to edit <strong>{staffToEdit?.firstName} {staffToEdit?.lastName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={editStaffMember}>Edit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Staff;
