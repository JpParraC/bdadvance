import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ClientsForm from './clientsform';
import ReservationForm from './reservationform';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash, cilMoney, cilFile, cilCalendar } from '@coreui/icons';
import axios from 'axios';
import '../../css/styles.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [editReservation, setEditReservation] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientCheckedIn, setClientCheckedIn] = useState(false);
  const [clientIdFilter, setClientIdFilter] = useState(''); // Estado para el filtro
  const [reservationDateFilter, setReservationDateFilter] = useState(''); // Filtro de fecha de reservación


  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3001/clients');
      setClients(response.data);
    } catch (error) {
      console.error("Error loading clients:", error);
      alert("An error occurred while fetching clients.");
    }
  };
  
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
      alert("An error occurred while fetching reservations.");
    }
  };
  

  const filteredClients = clients.filter(client => 
    client.id.toString().includes(clientIdFilter)
  );
 
  useEffect(() => {
    fetchClients();
    fetchReservations();
  }, []);

  const handleOpenForm = () => { setEditClient(null); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); };
//no se esta utilizando
  const handleOpenReservationForm = (client) => {
    setSelectedClient(client);
    const isClientRegistered = clients.some(existingClient => existingClient.id === client.id);
    
    if (!isClientRegistered) {
      alert('Client is not registered. Please register the client first.');
    } else {
      setShowCheckInModal(true);
    }
  };

  const handleCloseReservationForm = () => { setShowReservationForm(false); };

  const handleCheckInConfirmation = (checkedIn) => {
    setShowCheckInModal(false);
    if (checkedIn) {
      setClientCheckedIn(true);
      setShowReservationForm(true);
    } else {
      alert('Client must be checked in to make a reservation.');
    }
  };
  
  const addClient = async (newClient) => {
    try {
      const response = await axios.post('http://localhost:3001/clients', newClient);
      setClients([...clients, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding the client.");
    }
  };
  
  const updateClient = async (updatedClient) => {
    try {
      const response = await axios.put(`http://localhost:3001/clients/${updatedClient.id}`, updatedClient);
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
      await axios.delete(`http://localhost:3001/clients/${id}`);
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };
  
  const addReservation = (newReservation) => {
    if (clientCheckedIn && selectedClient) {
      newReservation.clientId = selectedClient.id;
      axios.post('http://localhost:3001/reservations', newReservation)
        .then(response => {
          setReservations([...reservations, response.data]);
          setShowReservationForm(false);
          setClientCheckedIn(false);
        })
        .catch(error => console.error("Error adding reservation:", error));
    } else {
      alert('Client must be checked in before adding a reservation.');
    }
  };

  const updateReservation = (updatedReservation) => {
    axios.put(`http://localhost:3001/reservations/${updatedReservation.id}`, updatedReservation)
      .then(response => {
        const updatedReservations = reservations.map(reservation => 
          reservation.id === updatedReservation.id ? response.data : reservation
        );
        setReservations(updatedReservations);
        setShowReservationForm(false);
      })
      .catch(error => console.error("Error updating reservation:", error));
  };

  const deleteReservation = (id) => {
    axios.delete(`http://localhost:3001/reservations/${id}`)
      .then(() => {
        setReservations(reservations.filter(reservation => reservation.id !== id));
      })
      .catch(error => console.error("Error deleting reservation:", error));
  };

  const handleRegisterPayment = (reservation) => {
    setSelectedReservation(reservation);
    setShowPaymentForm(true);
  };

  const handleGenerateInvoice = (reservation) => {
    setSelectedReservation(reservation);
    setShowInvoice(true);
  };

  

  const handleSavePayment = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPayment = {
      id: `PAY${Math.floor(Math.random() * 10000)}`, // Genera un ID único para el pago
      dateInvoice: form.date.value,
      total_amount: parseFloat(form.amount.value),
      id_reservation: selectedReservation.id,
      idClient: selectedReservation.clientId,
      notes: form.notes.value,
      time: form.time.value,
      paymentMethod: form.paymentMethod.value,
    };

    axios.post('http://localhost:3001/payments', newPayment) 
      .then(response => {
        setShowPaymentForm(false);
        alert('Payment registered successfully!');
      })
      .catch(error => console.error("Error saving payment:", error));
  };

  const filteredReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.dateReserve);
    const selectedDate = new Date(reservationDateFilter);
  
    // Compara la fecha de la reservación con la fecha seleccionada
    return reservationDateFilter ? reservationDate.toDateString() === selectedDate.toDateString() : true;
  });
  

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
        min="0" /* Establece un valor mínimo si es necesario */
        max="999999" /* Establece un valor máximo si es necesario */
        step="1" /* Establece el valor de incremento (por ejemplo, solo números enteros) */
      />

      <div className="table-responsive hh mt-3">
        <div className="custom-table-container">
        <Table className="custom-table" >
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
              <tr className='text-center' key={client.id}>
                <td>{client.id}</td>
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
                    <Button variant="link" onClick={() => deleteClient(client.id)} title="Delete">
                      <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                    </Button>
                    <Button variant="link" onClick={() => handleOpenReservationForm(client)} title="Check-In and Add Reservation">
                      <CIcon icon={cilCalendar} style={{ fontSize: '1.5rem', color: 'blue' }} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
       
      </div>
      <ClientsForm
        show={showForm}
        handleClose={handleCloseForm}
        client={editClient}
        handleSave={editClient ? updateClient : addClient}
      />


        
        <h2 className="mt-5 bl">Reservations</h2>
        <div className="mb-3 row">
    
    <div className="col-md-2">
      <input
        type="date"
        id="reservationDateFilter"
        value={reservationDateFilter}
        onChange={(e) => setReservationDateFilter(e.target.value)}
        className="form-control"
      />
    
    </div>
    <div className="col-md-2">
        <input 
            type="text" 
            placeholder="Filter by Client ID" 
            value={clientIdFilter} 
            onChange={(e) => setClientIdFilter(e.target.value)} 
            style={{ marginLeft: '-15px', padding: '5px' }} 
             className="search-input"
        />
    
    </div>
  </div>


      <div className="table-responsive mt-3">
        <div className="custom-table-container">
          <Table className=" custom-table" >
           <thead>
              <tr className='text-center'>
                <th> ID reservation</th>
                <th>Client ID</th>
                <th>Reservation Date</th>
                <th>Check-In Date</th>
                <th>Check-Out Date</th>
                <th>Number of Nights</th>
                <th>Room Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr className='text-center' key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.clientId}</td>
                <td>{reservation.dateReserve}</td>
                <td>{reservation.dateCheckin}</td>
                <td>{reservation.dateCheckout}</td>
                <td>{reservation.numberNights}</td>
                <td>
                  {reservation.rooms
                    .map((room) => `${room.roomType} (${room.roomAssigned})`)
                    .join(', ')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="link" onClick={() => { setEditReservation(reservation); setShowReservationForm(true); }} title="Edit">
                      <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                    </Button>
                    <Button variant="link" onClick={() => deleteReservation(reservation.id)} title="Delete">
                      <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                    </Button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
        
      </div>
      
      <ReservationForm show={showReservationForm} handleClose={handleCloseReservationForm} addReservation={addReservation} updateReservation={updateReservation} reservation={editReservation} />
      
      {/* Payment Form Modal */}
      <Modal show={showPaymentForm} onHide={() => setShowPaymentForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSavePayment}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input type="date" className="form-control" id="date" required />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input type="number" className="form-control" id="amount" required />
            </div>
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notes</label>
              <input type="text" className="form-control" id="notes" />
            </div>
            <div className="mb-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input type="time" className="form-control" id="time" />
            </div>
            <div className="mb-3">
              <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
              <select className="form-select" id="paymentMethod">
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <Button variant="primary" type="submit">Save Payment</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Check-In Modal */}
      <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Check In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to check in this client?</p>
          <Button variant="success" onClick={() => handleCheckInConfirmation(true)}>Yes</Button>
          <Button variant="danger" onClick={() => handleCheckInConfirmation(false)}>No</Button>
        </Modal.Body>
      </Modal>

      {/* Invoice Modal */}
      <Modal show={showInvoice} onHide={() => setShowInvoice(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice for Reservation {selectedReservation?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí iría la lógica para generar y mostrar la factura */}
          <p>Generating invoice for reservation...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clients;
