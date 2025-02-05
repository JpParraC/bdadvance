import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import StaffForm from './stafform';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState(null);

  const fetchStaff = () => {
    axios.get('http://localhost:5000/api/staff')
      .then(response => setStaff(response.data))
      .catch(error => console.error("Error loading staff:", error));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenForm = () => {
    setEditStaff(null); // Reset edit staff when opening the form
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
    if (!updatedStaff.id_staff) {
      console.error("No staff ID found, cannot update");
      return; // No continúes si no tienes el id_staff
    }
    
    axios.put(`http://localhost:5000/api/staff/${updatedStaff.id_staff}`, updatedStaff)
      .then(response => {
        const updatedList = staff.map(member => 
          member.id_staff === updatedStaff.id_staff ? response.data : member
        );
        setStaff(updatedList);
        setShowForm(false);
      })
      .catch(error => console.error("Error updating staff:", error));
  };
  

  const confirmDelete = (member) => {
    setStaffToDelete(member);
    setShowDeleteModal(true);
  };

  const deleteStaff = () => {
    if (staffToDelete) {
      axios.delete(`http://localhost:5000/api/staff/${staffToDelete.id_staff}`)
        .then(() => {
          setStaff(staff.filter(member => member.id !== staffToDelete.id));
          setShowDeleteModal(false);
          setStaffToDelete(null);
        })
        .catch(error => console.error("Error deleting staff:", error));
    }
  };

  const confirmEdit = (member) => {
    setStaffToEdit(member); // Set the staff member to edit
    setEditStaff(member); // Set editStaff with the staff to edit
    setShowEditModal(true); // Show the edit modal
  };

  const editStaffMember = () => {
    setShowEditModal(false); // Close the confirmation modal
    setShowForm(true); // Open the form to edit the staff
  };

  const exportToExcel = (clients) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(clients.map(client => ({
      ID: client.idGuest,
      'First Name': client.firstName,
      'Middle Name': client.middleName || "",
      'Last Name': client.lastName,
      Email: client.email,
      'Date of Birth': client.dateOfBirth,
      'Phone Number': client.phoneNumber,
      'Number of Persons': client.numberPersons,
      Nationality: client.nationality
    })));
  
    const range = XLSX.utils.decode_range(worksheet['!ref']);
  
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  
    worksheet['!cols'] = [
      { wch: 5 },  // ID
      { wch: 15 }, // First Name
      { wch: 15 }, // Middle Name
      { wch: 15 }, // Last Name
      { wch: 25 }, // Email
      { wch: 15 }, // Date of Birth
      { wch: 15 }, // Phone Number
      { wch: 15 }, // Number of Persons
      { wch: 20 }  // Nationality
    ];
  
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          ...worksheet[cellAddress].s,
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients Data");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Clients_Data.xlsx");
  };
  return (
    <div>
      <h2>Staff Management</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '10px' }}>
        <Button variant="dark" onClick={handleOpenForm}>Add Staff</Button>
        <Button variant="success" onClick={exportToExcel}>Download Excel</Button>
      </div>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr className="text-center" key={member.id}>
                <td>{member.id_staff}</td>
                <td>{member.name_staff}</td>
                <td>{member.lastname_staff}</td>
                <td>{member.email_staff}</td>
                <td>{member.phone}</td>
                <td>{member.rol_staffname || "Unassigned"}</td>
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
            ))}
          </tbody>
        </Table>
      </div>

      <StaffForm
        show={showForm}
        handleClose={handleCloseForm}
        staff={editStaff} // Pass the editStaff to the form
        handleSave={editStaff ? updateStaff : addStaff}
        roles={roles}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{staffToDelete?.name_staff} {staffToDelete?.lastname_staff}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteStaff}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to edit <strong>{staffToEdit?.name_staff} {staffToEdit?.lastname_staff}</strong>?
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
