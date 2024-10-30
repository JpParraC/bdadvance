import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const ClientsForm = ({ show, handleClose, handleSave, client }) => {
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberPersons, setNumberPersons] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    if (client) {
      setId(client.id);
      setFirstName(client.firstName);
      setMiddleName(client.middleName);
      setLastName(client.lastName);
      setEmail(client.email);
      setDateOfBirth(client.dateOfBirth);
      setPhoneNumber(client.phoneNumber);
      setNumberPersons(client.numberPersons);
      setNationality(client.nationality);
    } else {
      // Reset fields if no client is selected
      setId('');
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setEmail('');
      setDateOfBirth('');
      setPhoneNumber('');
      setNumberPersons('');
      setNationality('');
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({
      id, 
      firstName, 
      middleName, 
      lastName, 
      email, 
      dateOfBirth, 
      phoneNumber, 
      numberPersons, 
      nationality
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{client ? 'Edit Client' : 'Add Client'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
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
