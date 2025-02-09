import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const StaffForm = ({ show, handleClose, staff, handleSave }) => {
  // Initial state with default values
  const [formData, setFormData] = useState({
    id_staff: '',
    name_staff: '',
    lastname_staff: '',
    email_staff: '',
    phone: '',
    gen: '', // Nuevo campo de género
    rol_staffname: '',
  });

  const [roles, setRoles] = useState([]); // State to hold roles fetched from API
  const [isLoading, setIsLoading] = useState(true); // State to track if roles are loading
  const [error, setError] = useState(null); // State to handle potential API errors

  // Fetch roles from API when the form is shown
  useEffect(() => {
    if (show) {
      setIsLoading(true);
      fetch('http://localhost:5000/api/roles/')
        .then(response => response.json())
        .then(data => {
          setRoles(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
          setError('Failed to load roles.');
          setIsLoading(false);
        });
    }

    if (staff) {
      // If editing a staff member, populate form data
      setFormData({
        id_staff: staff.id_staff || '',
        name_staff: staff.name_staff || '',
        lastname_staff: staff.lastname_staff || '',
        email_staff: staff.email_staff || '',
        phone: staff.phone || '',
        gen: staff.gen || '', // Nuevo campo de género
        rol_staffname: staff.rol_staffname || '',
      });
    } else {
      // Clear the form if adding new entry
      setFormData({
        id_staff: '',
        name_staff: '',
        lastname_staff: '',
        email_staff: '',
        phone: '',
        gen: '', // Nuevo campo de género vacío por defecto
        rol_staffname: '',
      });
    }
  }, [staff, show]); // Trigger re-fetch on form visibility

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Log formData to check the values being submitted
    console.log('Form data being submitted:', formData);

    // Check if gender is selected
    if (!formData.gen) {
      alert('Please select a gender');
      return;
    }

    handleSave(formData); // Pass the form data to handleSave method
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{staff ? 'Edit Staff' : 'Add Staff'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Handle loading state */}
        {isLoading ? (
          <p>Loading roles...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id_staff"
                value={formData.id_staff}
                onChange={handleChange}
                placeholder="ID"
                disabled={staff !== null} // El campo se deshabilita solo cuando staff no es nulo (editando)
              />
            </Form.Group>

            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="name_staff"
                value={formData.name_staff}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname_staff"
                value={formData.lastname_staff}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email_staff"
                value={formData.email_staff}
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

            {/* Nuevo campo para el género */}
            <Form.Group controlId="formGen">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gen"
                value={formData.gen}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="rol_staffname"
                value={formData.rol_staffname}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.id} value={role.rol_name}>
                      {role.rol_name}
                    </option>
                  ))
                ) : (
                  <option>Loading roles...</option>
                )}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              {staff ? 'Update' : 'Add'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default StaffForm;
