import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const StaffForm = ({ show, handleClose, staff, handleSave, roles }) => {
  // Initial state with default values
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: '',
    status: 'Active',
    rol_staff_id: ''
  });

  // UseEffect to populate form data if editing
  useEffect(() => {
    if (staff) {
      setFormData(staff); // Fill the form with staff data if we are editing
    } else {
      // Clear the form if we are adding a new entry
      setFormData({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        hireDate: '',
        status: 'Active',
        rol_staff_id: ''
      });
    }
  }, [staff]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData); // Save data
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{staff ? 'Edit Staff' : 'Add Staff'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* ID Field, disabled */}
          <Form.Group controlId="formId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="ID"
              disabled // ID is not editable
            />
          </Form.Group>

          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formMiddleName">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="rol_staff_id"
              value={formData.rol_staff_id}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.role}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            {staff ? 'Update' : 'Add'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StaffForm;
