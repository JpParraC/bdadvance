import React, { useState, useEffect } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import { hasPermission } from '../../permissions'; 
import { useAuth } from '../../contexts/authcontext';
import '../../css/styles.css';

const AddManageAdmins = () => {
  const { user } = useAuth();  // Obtener los datos del usuario desde el contexto
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

  const [editAdmin, setEditAdmin] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [editConfirmationModalVisible, setEditConfirmationModalVisible] = useState(false);

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
        setAddModalVisible(false);
      })
      .catch(error => console.error('Error adding admin:', error));
  };

  const handleEditAdmin = (id) => {
    const adminToEdit = admins.find(admin => admin.id === id);
    setEditAdmin({ ...adminToEdit });
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
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
      setEditModalVisible(false);
      setEditConfirmationModalVisible(false);
      setEditAdmin(null);
    })
    .catch(error => console.error('Error saving admin changes:', error));
  };

  const handleDeleteAdmin = () => {
    fetch(`http://localhost:3001/admins/${adminToDelete.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setAdmins(admins.filter(admin => admin.id !== adminToDelete.id));
        setDeleteModalVisible(false);
        setAdminToDelete(null);
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
        {hasPermission(user, 'manage_admins') && (  // Verifica si el usuario tiene el permiso 'manage_admins'
          <CButton color="success" onClick={() => setAddModalVisible(true)} className="px-4">
            Add Administrator
          </CButton>
        )}
      </div>

      <div className="table-responsive mt-3">
        <table className="table">
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr className="text-center" key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.firstName}</td>
                <td>{admin.lastName}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {hasPermission(user, 'manage_admins') && (  // Verifica si el usuario tiene permiso para editar
                      <button
                        className="btn btn-link"
                        onClick={() => handleEditAdmin(admin.id)}
                        title="Edit"
                      >
                        <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                      </button>
                    )}
                    {hasPermission(user, 'manage_admins') && (  // Verifica si el usuario tiene permiso para eliminar
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          setAdminToDelete(admin);
                          setDeleteModalVisible(true);
                        }}
                        title="Delete"
                      >
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  className="form-select"
                  onChange={handleInputChange}
                  value={newAdmin.role}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddAdmin}>
            Add Administrator
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, username: e.target.value })}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, firstName: e.target.value })}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, lastName: e.target.value })}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
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
                  onChange={(e) => setEditAdmin({ ...editAdmin, phoneNumber: e.target.value })}
                />
              </CCol>
              <CCol md="6">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value })}
                  value={editAdmin?.role || 'admin'}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
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

      {/* Modal for Edit Confirmation */}
      <CModal visible={editConfirmationModalVisible} onClose={() => setEditConfirmationModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Edit</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to save the changes?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditConfirmationModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={confirmSaveEdit}>
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Deleting Administrator */}
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
            Confirm Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddManageAdmins;
