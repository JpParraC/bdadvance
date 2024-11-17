import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';

const AddManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'admin',
  });

  const [editAdmin, setEditAdmin] = useState(null); // Estado para manejar la edición
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false); // Nuevo estado para manejar el modal de agregar
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Estado para la confirmación de eliminar
  const [adminToDelete, setAdminToDelete] = useState(null); // Administrador a eliminar
  const [editConfirmationModalVisible, setEditConfirmationModalVisible] = useState(false); // Modal de confirmación de edición

  useEffect(() => {
    fetch('http://localhost:3001/admins')
      .then(response => response.json())
      .then(data => setAdmins(data))
      .catch(error => console.error('Error fetching admins:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddAdmin = () => {
    fetch('http://localhost:3001/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAdmin)
    })
      .then(response => response.json())
      .then(data => {
        setAdmins([...admins, data]);
        setNewAdmin({
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          role: 'admin',
        });
        setAddModalVisible(false); // Cerrar el modal después de agregar el admin
      })
      .catch(error => console.error('Error adding admin:', error));
  };

  const handleEditAdmin = (id) => {
    const adminToEdit = admins.find(admin => admin.id === id);
    setEditAdmin({ ...adminToEdit }); // Cargar los datos del administrador seleccionado
    setEditModalVisible(true); // Mostrar el modal de edición
  };

  const handleSaveEdit = () => {
    // Mostrar el modal de confirmación de edición
    setEditConfirmationModalVisible(true);
  };

  const confirmSaveEdit = () => {
    fetch(`http://localhost:3001/admins/${editAdmin.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editAdmin)
    })
    .then(response => response.json())
    .then(data => {
      setAdmins(admins.map(admin => (admin.id === data.id ? data : admin)));
      setEditModalVisible(false); // Cerrar el modal de edición
      setEditConfirmationModalVisible(false); // Cerrar la confirmación
      setEditAdmin(null); // Resetear el administrador en edición
    })
    .catch(error => console.error('Error saving admin changes:', error));
  };

  const handleDeleteAdmin = () => {
    fetch(`http://localhost:3001/admins/${adminToDelete.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setAdmins(admins.filter(admin => admin.id !== adminToDelete.id)); // Actualiza el estado local
        setDeleteModalVisible(false); // Cerrar modal de confirmación
        setAdminToDelete(null); // Resetear admin a eliminar
      } else {
        console.error('Failed to delete the admin:', response.statusText);
      }
    })
    .catch(error => console.error('Error deleting admin:', error));
  };

  return (
    <div className="container">
      <h2 className="mb-3">Manage Administrators</h2>

      <div className="text-start">
        <CButton color="success" onClick={() => setAddModalVisible(true)} className="px-4">
          Add Administrator
        </CButton>
      </div>

      {/* Table for displaying admins */}
      <CCard className="mt-4 shadow-sm">
        <CCardHeader style={{ backgroundColor: '#f8f9fa' }}>
          <h3>Administrator List</h3>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive striped bordered>
            <CTableHead>
              <CTableRow className="text-center">
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>First Name</CTableHeaderCell>
                <CTableHeaderCell>Last Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {admins.map(admin => (
                <CTableRow className="text-center" key={admin.id}>
                  <CTableDataCell>{admin.id}</CTableDataCell>
                  <CTableDataCell>{admin.username}</CTableDataCell>
                  <CTableDataCell>{admin.firstName}</CTableDataCell>
                  <CTableDataCell>{admin.lastName}</CTableDataCell>
                  <CTableDataCell>{admin.email}</CTableDataCell>
                  <CTableDataCell>{admin.role}</CTableDataCell>
                  <CTableDataCell>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <CButton variant="link" onClick={() => handleEditAdmin(admin.id)} title="Edit">
                        <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                      </CButton>
                      <CButton variant="link" onClick={() => {
                        setAdminToDelete(admin);
                        setDeleteModalVisible(true);
                      }} title="Delete">
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal for Adding Administrator */}
      <CModal visible={addModalVisible} onClose={() => setAddModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Administrator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  onChange={handleInputChange}
                  value={newAdmin.username}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={newAdmin.firstName}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={newAdmin.lastName}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={newAdmin.email}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Phone Number"
                  onChange={handleInputChange}
                  value={newAdmin.phoneNumber}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  name="role"
                  className="form-control"
                  onChange={handleInputChange}
                  value={newAdmin.role}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="12">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={newAdmin.password}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddAdmin}>
            Save Administrator
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Editing Administrator */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Administrator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  value={editAdmin?.username || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, username: e.target.value })}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  value={editAdmin?.firstName || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, firstName: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Last Name"
                  value={editAdmin?.lastName || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, lastName: e.target.value })}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={editAdmin?.email || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, email: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Phone Number"
                  value={editAdmin?.phoneNumber || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, phoneNumber: e.target.value })}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  name="role"
                  className="form-control"
                  value={editAdmin?.role || 'admin'}
                  onChange={e => setEditAdmin({ ...editAdmin, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="12">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={editAdmin?.password || ''}
                  onChange={e => setEditAdmin({ ...editAdmin, password: e.target.value })}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Confirming Edit */}
      <CModal visible={editConfirmationModalVisible} onClose={() => setEditConfirmationModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Changes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to save the changes made to this administrator?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditConfirmationModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmSaveEdit}>
            Confirm Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Confirming Deletion */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this administrator?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteAdmin}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddManageAdmins;
