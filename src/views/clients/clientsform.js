import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const ClientsForm = ({ show, handleClose, handleSave, client }) => {
  const [idGuest, setIdGuest] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberPersons, setNumberPersons] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    console.log(client); 
    if (client) {
      setIdGuest(client.id_guest || ''); // Aseguramos un valor predeterminado
      setFirstName(client.first_name || '');
      setMiddleName(client.middle_name || '');
      setLastName(client.first_lastname || '');
      setEmail(client.email || '');
      setDateOfBirth(client.date_ofbirth || '');
      setPhoneNumber(client.phone_number || '');
      setNumberPersons(client.number_persons || '');
      setNationality(client.nationality || '');
    } else {
      resetForm();
    }
  }, [client]);

  const resetForm = () => {
    setIdGuest('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmail('');
    setDateOfBirth('');
    setPhoneNumber('');
    setNumberPersons('');
    setNationality('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({
      id_guest: idGuest,
      first_name: firstName,
      first_lastname: lastName,
      middle_name: middleName,
      email,
      date_ofbirth: dateOfBirth,
      phone_number: phoneNumber,
      number_persons: numberPersons,
      nationality,
    });
    resetForm();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{client ? 'Edit Client' : 'Add Client'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formIdGuest">
            <Form.Label>ID Guest</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ID Guest"
              value={idGuest}
              onChange={(e) => setIdGuest(e.target.value)}
              required
              readOnly={!!client} // Hacer ID Guest solo lectura al editar
            />
          </Form.Group>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMiddleName">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter middle name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDateOfBirth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date of birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNumberPersons">
            <Form.Label>Number of Persons of Habitation</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of persons in habitation"
              value={numberPersons}
              onChange={(e) => setNumberPersons(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNationality">
            <Form.Label>Nationality</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" type="submit" className="mb-3">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClientsForm;
