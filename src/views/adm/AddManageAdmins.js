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

  const [editAdmin, setEditAdmin] = useState(null); // Estado para administrar la edición
  const [editModalVisible, setEditModalVisible] = useState(false);

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
      })
      .catch(error => console.error('Error adding admin:', error));
  };

  const handleEditAdmin = (id) => {
    const adminToEdit = admins.find(admin => admin.id === id);
    setEditAdmin(adminToEdit); // Cargar los datos del administrador seleccionado
    setEditModalVisible(true); // Mostrar el modal de edición
  };

  const handleSaveEdit = () => {
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
      setEditModalVisible(false);
      setEditAdmin(null); // Resetear el administrador en edición
    })
    .catch(error => console.error('Error saving admin changes:', error));
  };

  const handleDeleteAdmin = (id) => {
    // Confirmación antes de eliminar
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      console.log(`Attempting to delete admin with id: ${id}`); // Verifica el ID que intentas eliminar
  
      fetch(`http://localhost:3001/admins/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          console.log(`Admin with id ${id} deleted successfully.`);
          setAdmins(admins.filter(admin => admin.id !== id)); // Actualiza el estado local
        } else {
          console.error('Failed to delete the admin:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting admin:', error));
    }
  };
  
  
  

  return (
    <div className="container">
      <CCard className="mt-4 shadow-sm">
  <CCardHeader style={{ backgroundColor: '#b4d3ff', color: 'black' }}>
    <h2 className="mb-0">Manage Administrators</h2>
  </CCardHeader>
  <CCardBody>
    <CForm className="mb-4">
      <CRow className="mb-3">
        <CCol md="6">
          <label htmlFor="id" className="form-label">ID</label>
          <input
            type="text"
            name="id"
            className="form-control"
            placeholder="ID"
            onChange={handleInputChange}
            value={newAdmin.id}
          />
        </CCol>
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
      </CRow>
      <CRow className="mb-3">
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
      </CRow>
      <CRow className="mb-3">
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
        <CCol md="6">
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
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="reader">Reader</option>
          </select>
        </CCol>
      </CRow>
      <div className="text-center mt-4">
        <CButton color="success" onClick={handleAddAdmin} className="px-4">Add Administrator</CButton>
      </div>
    </CForm>
  </CCardBody>
</CCard>


      <CCard className="mt-4 shadow-sm">
        <CCardHeader style={{ backgroundColor: '#f8f9fa' }}>
          <h3>Administrator List</h3>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive striped bordered>
            <CTableHead>
              <CTableRow className="text-center">
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>username</CTableHeaderCell>
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
                      <CButton variant="link" onClick={() => handleDeleteAdmin(admin.id)} title="Delete">
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, username: e.target.value })}
                  value={editAdmin ? editAdmin.username : ''}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  onChange={(e) => setEditAdmin({ ...editAdmin, firstName: e.target.value })}
                  value={editAdmin ? editAdmin.firstName : ''}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, lastName: e.target.value })}
                  value={editAdmin ? editAdmin.lastName : ''}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                  value={editAdmin ? editAdmin.email : ''}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, phoneNumber: e.target.value })}
                  value={editAdmin ? editAdmin.phoneNumber : ''}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  name="role"
                  className="form-control"
                  onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value })}
                  value={editAdmin ? editAdmin.role : ''}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="reader">Reader</option>
                </select>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={handleSaveEdit} disabled={!editAdmin || !editAdmin.username || !editAdmin.email || !editAdmin.firstName || !editAdmin.lastName}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddManageAdmins;
