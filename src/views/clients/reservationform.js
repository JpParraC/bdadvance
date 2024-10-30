import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReservationForm = ({ show, handleClose }) => {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    numberPersons: '',
    nationality: '',
  });
  const [reservationData, setReservationData] = useState({
    dateReserve: '',
    dateCheckin: '',
    dateCheckout: '',
    numberNights: '',
  });

  const handleNextStep = () => {
    if (step === 1) {
      // Validar datos del cliente aquí si es necesario
      setStep(2);
    } else if (step === 2) {
      // Guardar datos de la reserva
      console.log('Datos del Cliente:', clientData);
      console.log('Datos de la Reserva:', reservationData);
      handleClose(); // Cierra el modal después de guardar
    }
  };

  const handleChangeClientData = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeReservationData = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{step === 1 ? 'Client Information' : 'Reservation Details'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 ? (
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={clientData.firstName}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formMiddleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter middle name"
                name="middleName"
                value={clientData.middleName}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={clientData.lastName}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={clientData.email}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={clientData.dateOfBirth}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phoneNumber"
                value={clientData.phoneNumber}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formNumberPersons">
              <Form.Label>Number of Persons</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of persons"
                name="numberPersons"
                value={clientData.numberPersons}
                onChange={handleChangeClientData}
              />
            </Form.Group>
            <Form.Group controlId="formNationality">
              <Form.Label>Nationality</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter nationality"
                name="nationality"
                value={clientData.nationality}
                onChange={handleChangeClientData}
              />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group controlId="formDateReserve">
              <Form.Label>Date Reserved</Form.Label>
              <Form.Control
                type="date"
                name="dateReserve"
                value={reservationData.dateReserve}
                onChange={handleChangeReservationData}
              />
            </Form.Group>
            <Form.Group controlId="formDateCheckin">
              <Form.Label>Date Check-in</Form.Label>
              <Form.Control
                type="date"
                name="dateCheckin"
                value={reservationData.dateCheckin}
                onChange={handleChangeReservationData}
              />
            </Form.Group>
            <Form.Group controlId="formDateCheckout">
              <Form.Label>Date Check-out</Form.Label>
              <Form.Control
                type="date"
                name="dateCheckout"
                value={reservationData.dateCheckout}
                onChange={handleChangeReservationData}
              />
            </Form.Group>
            <Form.Group controlId="formNumberNights">
              <Form.Label>Number of Nights</Form.Label>
              <Form.Control
                type="number"
                name="numberNights"
                value={reservationData.numberNights}
                onChange={handleChangeReservationData}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleNextStep}>
          {step === 1 ? 'Next' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationForm;
