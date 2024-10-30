import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import ClientsForm from './clientsform';
import ReservationForm from './reservationform'; 
import RoomCalendar from './roomcalendar'; // Importa el calendario de habitaciones
import { CIcon } from '@coreui/icons-react'; 
import { cilPen, cilTrash } from '@coreui/icons'; 

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [editReservation, setEditReservation] = useState(null);

  // Datos de clientes de ejemplo 
  const clients = [
    { id: 1, idclient: '30056463', firstName: 'Juan', middleName: 'Carlos', lastName: 'Pérez', email: 'juan@example.com', dateOfBirth: '1990-01-01', phoneNumber: '123-456-7890', numberPersons: 3, nationality: 'Mexican' },
    { id: 2, idclient: '30056464', firstName: 'María', middleName: 'Luisa', lastName: 'García', email: 'maria@example.com', dateOfBirth: '1985-05-15', phoneNumber: '098-765-4321', numberPersons: 2, nationality: 'Spanish' },
    { id: 3, idclient: '30056465', firstName: 'Carlos', middleName: 'Alberto', lastName: 'López', email: 'carlos@example.com', dateOfBirth: '1992-12-12', phoneNumber: '555-123-4567', numberPersons: 4, nationality: 'Colombian' },
  ];

  // Datos de reservas de ejemplo
  const [reservations, setReservations] = useState([
    { id: 1, clientId: '30056463', clientName: 'Juan Carlos Pérez', reservationDate: '2024-10-29', checkIn: '2024-11-10', checkOut: '2024-11-15', numberOfNights: 5, room: '101' },
    { id: 2, clientId: '30056464', clientName: 'María Luisa García', reservationDate: '2024-10-28', checkIn: '2024-11-12', checkOut: '2024-11-18', numberOfNights: 6, room: '102' },
    { id: 3, clientId: '30056465', clientName: 'Carlos Alberto López', reservationDate: '2024-10-27', checkIn: '2024-11-15', checkOut: '2024-11-20', numberOfNights: 5, room: '103' },
  ]);

  const handleOpenForm = () => { setEditClient(null); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); };
  const handleOpenReservationForm = () => { setEditReservation(null); setShowReservationForm(true); };
  const handleCloseReservationForm = () => { setShowReservationForm(false); };
  const handleDeleteReservation = (id) => { setReservations(reservations.filter(reservation => reservation.id !== id)); };

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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Calendario de Habitaciones */}
     
      <RoomCalendar /> {/* Renderizar el calendario de habitaciones */}
    </div>
  );
};

export default Clients;
