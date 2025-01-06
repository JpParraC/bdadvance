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

  // States for modals
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showAddClientSuccessModal, setShowAddClientSuccessModal] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/');
      const clientsData = response.data;

      const formattedClients = clientsData.map(client => ({
        id: client.id,
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
    console.log("Selected Client: ", client);
    setSelectedClient(client);
  
    // Verificar si el cliente está registrado antes de permitir la reserva
    if (!clientCheckedIn) {
      // Si no está "checked-in", mostrar el modal para confirmar el check-in
      setShowCheckInModal(true);
    } else {
      // Si está "checked-in", abrir directamente el formulario de reserva
      setShowReservationForm(true);
    }
  };
  


  const handleCloseReservationForm = () => { setShowReservationForm(false); };

  const handleCheckInConfirmation = (checkedIn) => {
    setShowCheckInModal(false); // Cerrar el modal después de la confirmación
  
    if (checkedIn) {
      setClientCheckedIn(true); // Marcar al cliente como "checked-in"
      console.log("Client checked-in, opening ReservationForm...");
      setShowReservationForm(true); // Mostrar el formulario de reserva
    } else {
      alert('Client must be checked in to make a reservation.');
    }
  };
  


  const addClient = async (newClient) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/', newClient);
      setClients(prevClients => [...prevClients, response.data]);
      setShowForm(false);
      setShowAddClientSuccessModal(true);  // Show success modal after adding client
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

  const deleteClient = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteClientId}`);
      setClients(clients.filter(client => client.id !== deleteClientId));
      setShowDeleteConfirmModal(false); // Close the confirmation modal
      setShowDeleteSuccessModal(true);  // Show success modal after deletion
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };

  const addReservation = async (reservation) => {
    console.log("Selected Client: ", selectedClient);

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
                      <Button variant="link" onClick={() => { setDeleteClientId(client.id); setShowDeleteConfirmModal(true); }} title="Delete">
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

      {showForm && (
        <ClientsForm
          show={showForm}
          handleClose={handleCloseForm}
          handleSave={editClient ? updateClient : addClient}
          client={editClient}
        />
      )}

      {/* Modal for Confirming Deletion */}
      {showDeleteConfirmModal && (
        <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
          <Modal.Body>
            Are you sure you want to delete this client?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>No</Button>
            <Button variant="danger" onClick={deleteClient}>Yes, Delete</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for Successful Deletion */}
      {showDeleteSuccessModal && (
        <Modal show={showDeleteSuccessModal} onHide={() => setShowDeleteSuccessModal(false)}>
          <Modal.Body>
            The client was successfully deleted.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowDeleteSuccessModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}

          {showCheckInModal && (
          <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
            <Modal.Body>
              Is this client checked-in?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleCheckInConfirmation(false)}>No</Button>
              <Button variant="primary" onClick={() => handleCheckInConfirmation(true)}>Yes</Button>
            </Modal.Footer>
          </Modal>
        )}
        {showForm && (
      <ClientsForm
        show={showForm}
        handleClose={handleCloseForm}
        handleSave={editClient ? updateClient : addClient}
        client={editClient}
      />
    )}

      {showReservationForm && (
          <ReservationForm
          show={showReservationForm}
          handleClose={() => setShowReservationForm(false)}
          client={selectedClient}
          addReservation={addReservation}
          
        />
        )}


      {/* Modal for Successfully Adding a Client */}
      {showAddClientSuccessModal && (
        <Modal show={showAddClientSuccessModal} onHide={() => setShowAddClientSuccessModal(false)}>
          <Modal.Body>
            The client was successfully added.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowAddClientSuccessModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>

    
  );
};

export default Clients;
