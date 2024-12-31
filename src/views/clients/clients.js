import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ClientsForm from './clientsform';
import ReservationForm from '../reservation/reservationform';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash, cilCalendar } from '@coreui/icons';
import axios from 'axios';
import '../../css/styles.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientCheckedIn, setClientCheckedIn] = useState(false);
  const [clientIdFilter, setClientIdFilter] = useState('');

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/');
      const clientsData = response.data;
  
      const formattedClients = clientsData.map(client => ({
        idGuest: client.id_guest,
        firstName: client.first_name,
        middleName: client.middle_name,
        lastName: client.first_lastname,
        email: client.email,
        dateOfBirth: client.date_ofbirth,
        phoneNumber: client.phone_number,
        numberPersons: client.number_persons,
        nationality: client.nationality
      }));
  
      setClients(formattedClients);
    } catch (error) {
      console.error("Error loading clients:", error);
      alert("An error occurred while fetching clients.");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations/');
      setReservations(response.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
      alert("An error occurred while fetching reservations.");
    }
  };

  const filteredClients = clients.filter(client => 
    client.idGuest?.toString().includes(clientIdFilter) || client.idGuest === 0
  );

  useEffect(() => {
    fetchClients();
    fetchReservations();
  }, []);

  const handleOpenForm = () => { setEditClient(null); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); };

  const handleOpenReservationForm = (client) => {
    console.log("Selected Client: ", client);  // Verifica que el cliente esté correctamente seleccionado
    setSelectedClient(client);
    const isClientRegistered = clients.some(existingClient => existingClient.idGuest === client.idGuest);
    
    if (!isClientRegistered) {
      alert('Client is not registered. Please register the client first.');
    } else {
      setShowCheckInModal(true);  // Muestra el modal de confirmación de check-in
    }
  };

  const handleCloseReservationForm = () => { setShowReservationForm(false); };

  const handleCheckInConfirmation = (checkedIn) => {
    setShowCheckInModal(false); // Cierra el modal de check-in
  
    if (checkedIn) {
      setClientCheckedIn(true); // Marca al cliente como checked-in
      console.log("Client checked-in, opening ReservationForm...");
      setShowReservationForm(true); // Abre el formulario de reserva
    } else {
      alert('Client must be checked in to make a reservation.');
    }
  };

  const addClient = async (newClient) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/', newClient);
      setClients(prevClients => [...prevClients, response.data]);
      setShowForm(false);
      fetchClients();  
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding the client.");
    }
  };

  const updateClient = async (updatedClient) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${updatedClient.id}`, updatedClient);
      const updatedClients = clients.map(client => 
        client.id === updatedClient.id ? response.data : client
      );
      setClients(updatedClients);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("An error occurred while updating the client.");
    }
  };

  const deleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setClients(clients.filter(client => client.idGuest !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };

  const addReservation = async (reservation) => {
    console.log("Selected Client: ", selectedClient);  // Verifica los datos del cliente seleccionado
  
    if (clientCheckedIn && selectedClient) {
      reservation.clientId = selectedClient.idGuest;
      try {
        const response = await axios.post('http://localhost:5000/api/reservations/', reservation);
        setReservations([...reservations, response.data]);
        setShowReservationForm(false);
        setClientCheckedIn(false);
      } catch (error) {
        console.error("Error adding reservation:", error);
        alert("An error occurred while adding the reservation.");
      }
    } else {
      alert('Client must be checked in before adding a reservation.');
    }
  };

  return (
    <div>
      <h2 className='bl'>Client Management</h2>
      <Button className="button-blue" onClick={handleOpenForm}>Add Client</Button>
      <input
        type="number"
        placeholder="Filter by Client ID"
        value={clientIdFilter}
        onChange={(e) => setClientIdFilter(e.target.value)}
        className="search-input"
        style={{ marginLeft: '10px', padding: '5px' }}
        min="0" 
        max="999999" 
        step="1" 
      />

      <div className="table-responsive hh mt-3">
        <div className="custom-table-container">
          <Table className="custom-table">
            <thead>
              <tr className='text-center'>
                <th>ID</th>
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
              {filteredClients.map((client) => (
                <tr className='text-center' key={client.idGuest}>
                  <td>{client.idGuest}</td>
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
                      <Button variant="link" onClick={() => deleteClient(client.idGuest)} title="Delete">
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </Button>
                      <Button variant="link" onClick={() => handleOpenReservationForm(client)} title="Add Reservation">
                        <CIcon icon={cilCalendar} style={{ fontSize: '1.5rem', color: 'green' }} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal for Client Form */}
      {showForm && (
        <ClientsForm
          client={editClient}
          onClose={handleCloseForm}
          onSave={editClient ? updateClient : addClient}
        />
      )}

      {/* Modal for Check-In Confirmation */}
      {showCheckInModal && (
        <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
          <Modal.Body>
            Are you sure you want to check in this client?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleCheckInConfirmation(false)}>No</Button>
            <Button variant="primary" onClick={() => handleCheckInConfirmation(true)}>Yes</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Reservation Form */}
      // Asegúrate de pasar 'show' correctamente al formulario de reservas
        {showReservationForm && (
          <ReservationForm 
            show={showReservationForm}  // Verifica que esta línea pase 'show'
            handleClose={handleCloseReservationForm} 
            addReservation={addReservation}
          
          />
        )}

     </div>
    );
};

export default Clients;
