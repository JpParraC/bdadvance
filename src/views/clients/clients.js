import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ClientsForm from './clientsform';
import ReservationForm from './reservationform';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash, cilMoney, cilFile } from '@coreui/icons';

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [editReservation, setEditReservation] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Datos de clientes de ejemplo
  const clients = [
    { id: 1, idclient: '30056463', firstName: 'Juan', middleName: 'Carlos', lastName: 'Pérez', email: 'juan@example.com', dateOfBirth: '1990-01-01', phoneNumber: '123-456-7890', numberPersons: 3, nationality: 'Mexican' },
    { id: 2, idclient: '30056464', firstName: 'María', middleName: 'Luisa', lastName: 'García', email: 'maria@example.com', dateOfBirth: '1985-05-15', phoneNumber: '098-765-4321', numberPersons: 2, nationality: 'Spanish' },
    { id: 3, idclient: '30056465', firstName: 'Carlos', middleName: 'Alberto', lastName: 'López', email: 'carlos@example.com', dateOfBirth: '1992-12-12', phoneNumber: '555-123-4567', numberPersons: 4, nationality: 'Colombian' },
  ];

  // Datos de reservas de ejemplo
  const [reservations, setReservations] = useState([
    { id: 1, clientId: '30056463', clientName: 'Juan Carlos Pérez', reservationDate: '2024-10-29', checkIn: '2024-11-10', checkOut: '2024-11-15', numberOfNights: 5, room: '101', payments: [{ date: '2024-10-30', amount: 200, notes: 'Initial deposit', time: '12:00', paymentMethod: 'Credit Card', invoiceId: 'INV001' }] },
    { id: 2, clientId: '30056464', clientName: 'María Luisa García', reservationDate: '2024-10-28', checkIn: '2024-11-12', checkOut: '2024-11-18', numberOfNights: 6, room: '102', payments: [] },
    { id: 3, clientId: '30056465', clientName: 'Carlos Alberto López', reservationDate: '2024-10-27', checkIn: '2024-11-15', checkOut: '2024-11-20', numberOfNights: 5, room: '103', payments: [] },
  ]);

  const handleOpenForm = () => { setEditClient(null); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); };
  const handleOpenReservationForm = () => { setEditReservation(null); setShowReservationForm(true); };
  const handleCloseReservationForm = () => { setShowReservationForm(false); };
  const handleDeleteReservation = (id) => { setReservations(reservations.filter(reservation => reservation.id !== id)); };
  
  const handleRegisterPayment = (reservation) => { setSelectedReservation(reservation); setShowPaymentForm(true); };
  const handleGenerateInvoice = (reservation) => { setSelectedReservation(reservation); setShowInvoice(true); };

  const handleSavePayment = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPayment = {
      date: form.date.value,
      amount: parseFloat(form.amount.value),
      notes: form.notes.value,
      time: form.time.value,
      paymentMethod: form.paymentMethod.value,
      invoiceId: `INV${Math.floor(Math.random() * 10000)}`, // Generar ID de factura
    };

    const updatedReservations = reservations.map(reservation =>
      reservation.id === selectedReservation.id
        ? { ...reservation, payments: [...reservation.payments, newPayment] }
        : reservation
    );
    setReservations(updatedReservations);
    setShowPaymentForm(false);
  };

  return (
    <div>
      <h2>Client Management</h2>
      <Button variant="dark" onClick={handleOpenReservationForm}>Add reservation</Button>
      
      {/* Tabla de Clientes */}
      <div className="table-responsive mt-3">
        <Table striped bordered hover>
          <thead>
            <tr className='text-center'>
              <th>ID</th>
              <th>ID client</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone Number</th>
              <th>Number of Persons</th>
              <th>Nationality</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr className='text-center' key={client.id}>
                <td>{client.id}</td>
                <td>{client.idclient}</td>
                <td>{client.firstName}</td>
                <td>{client.middleName}</td>
                <td>{client.lastName}</td>
                <td>{client.email}</td>
                <td>{client.dateOfBirth}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.numberPersons}</td>
                <td>{client.nationality}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="link" onClick={() => { setEditClient(client); setShowForm(true); }} title="Edit">
                      <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                    </Button>
                    <Button variant="link" onClick={() => alert(`Delete ${client.firstName} ${client.lastName}`)} title="Delete">
                      <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Formulario de Cliente */}
      <ClientsForm show={showForm} handleClose={handleCloseForm} client={editClient} />

      {/* Formulario de Reserva */}
      <ReservationForm show={showReservationForm} handleClose={handleCloseReservationForm} reservation={editReservation} />

      {/* Tabla de Reservas */}
      <h2 className="mt-5">Reservations</h2>
      <div className="table-responsive mt-3">
        <Table striped bordered hover>
          <thead>
            <tr className='text-center'>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Reservation Date</th>
              <th>Check-In Date</th>
              <th>Check-Out Date</th>
              <th>Number of Nights</th>
              <th>Room Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr className='text-center' key={reservation.id}>
                <td>{reservation.clientId}</td>
                <td>{reservation.clientName}</td>
                <td>{reservation.reservationDate}</td>
                <td>{reservation.checkIn}</td>
                <td>{reservation.checkOut}</td>
                <td>{reservation.numberOfNights}</td>
                <td>{reservation.room}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="link" onClick={() => { setEditReservation(reservation); setShowReservationForm(true); }} title="Edit">
                      <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                    </Button>
                    <Button variant="link" onClick={() => handleDeleteReservation(reservation.id)} title="Delete">
                      <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                    </Button>
                    <Button variant="link" onClick={() => handleRegisterPayment(reservation)} title="Register Payment">
                      <CIcon icon={cilMoney} style={{ fontSize: '1.5rem', color: 'green' }} />
                    </Button>
                    <Button variant="link" onClick={() => handleGenerateInvoice(reservation)} title="Generate Invoice">
                      <CIcon icon={cilFile} style={{ fontSize: '1.5rem', color: 'blue' }} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para Registrar Pago */}
      <Modal show={showPaymentForm} onHide={() => setShowPaymentForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register Payment for {selectedReservation?.clientName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePayment}>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" required />
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" step="0.01" required />
            </Form.Group>
            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group controlId="paymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control as="select">
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Save Payment</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para Factura */}
      <Modal show={showInvoice} onHide={() => setShowInvoice(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice for {selectedReservation?.clientName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Date of Invoice: {new Date().toLocaleDateString()}</p>
          <p>Reservation ID: {selectedReservation?.id}</p>
          <ul>
            {selectedReservation?.payments.map((payment, index) => (
              <li key={index}>{payment.date} - ${payment.amount} ({payment.paymentMethod})</li>
            ))}
          </ul>
          <p>Total Paid: ${selectedReservation?.payments.reduce((sum, payment) => sum + payment.amount, 0)}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clients;
