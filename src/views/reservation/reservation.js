import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ReservationForm from '../reservation/reservationform';

import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import axios from 'axios';
import '../../css/styles.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationDateFilter, setReservationDateFilter] = useState('');
  const [guestIdFilter, setGuestIdFilter] = useState(''); // Nuevo estado para el filtro de ID de huésped
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations/');
      setReservations(response.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
      alert("An error occurred while fetching reservations.");
    }
  };

  const handleShowEditModal = (reservation) => {
    setReservationToEdit(reservation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setReservationToEdit(null); // Limpiar la reserva cuando se cierra el formulario
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = Array.isArray(reservations)
    ? reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.dateReserve);
        const selectedDate = new Date(reservationDateFilter);
        const matchesDate = reservationDateFilter
          ? reservationDate.toDateString() === selectedDate.toDateString()
          : true;
        const matchesGuestId = guestIdFilter
          ? reservation.guests_id_guest.toString().includes(guestIdFilter) // Filtro por ID de huésped
          : true;

        return matchesDate && matchesGuestId;
      })
    : [];

  const handleCloseReservationForm = () => {
    setShowForm(false);
  };
  const exportToExcel = (reservations) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      reservations.map((reservation) => ({
        "Reservation ID": reservation.id,
        "Client ID": reservation.guests_id_guest,
        "Reservation Date": new Date(reservation.date_reserve).toLocaleDateString(),
        "Check-In Date": new Date(reservation.date_checkin).toLocaleDateString(),
        "Check-Out Date": new Date(reservation.date_checkout).toLocaleDateString(),
        "Number of Nights": reservation.number_nights,
        "Rooms Assigned": reservation.rooms ? reservation.rooms.join(", ") : "No rooms assigned",
      }))
    );
  
    // Ajuste de estilos para las columnas
    worksheet["!cols"] = [
      { wch: 15 }, // Reservation ID
      { wch: 10 }, // Client ID
      { wch: 15 }, // Reservation Date
      { wch: 15 }, // Check-In Date
      { wch: 15 }, // Check-Out Date
      { wch: 15 }, // Number of Nights
      { wch: 25 }, // Rooms Assigned
    ];
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Reservations.xlsx");
  };

  const addReservation = async (newReservation) => {
    try {
      const response = await axios.post('http://localhost:5000/api/reservations/', newReservation);
      setReservations([...reservations, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  const updateReservation = async (updatedReservation) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reservations/${updatedReservation.id}`,
        updatedReservation
      );
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === updatedReservation.id ? response.data : reservation
        )
      );
      setShowForm(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`);
      setReservations(reservations.filter((reservation) => reservation.id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const handleShowDeleteModal = (reservation) => {
    setReservationToDelete(reservation);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setReservationToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (reservationToDelete) {
      await deleteReservation(reservationToDelete.id);
      handleCloseDeleteModal();
    }
  };

  // Convertir la fecha al formato "yyyy-MM-dd" antes de asignarla al valor del campo de entrada
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value).toISOString().split('T')[0];
    setReservationDateFilter(selectedDate);
  };

  // Manejar el cambio del filtro de ID de huésped
  const handleGuestIdChange = (e) => {
    setGuestIdFilter(e.target.value);
  };

  return (
    <div>
      <h2 className="mt-5 bl">Reservations</h2>
      <div className="mb-3 row">
        <div className="col-md-2">
          <input
            type="date"
            id="reservationDateFilter"
            value={reservationDateFilter} // Usar la fecha formateada
            onChange={handleDateChange} // Manejar el cambio de fecha
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            id="guestIdFilter"
            value={guestIdFilter}
            onChange={handleGuestIdChange} // Manejar el cambio de filtro por ID de huésped
            placeholder="Filter by Guest ID"
            className="search-input "
          />
        </div>

        <div className="col-md-2">
        <Button variant="success" onClick={() => exportToExcel(reservations)} className="mb-3">
          Export to Excel
        </Button>
        </div>
      </div>

     
        <div className="table-responsive hh mt-3">
               
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>ID Reservation</th>
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
              {Array.isArray(filteredReservations) && filteredReservations.length > 0 ? (
                filteredReservations
                  .sort((a, b) => b.id - a.id) // Ordena de mayor a menor por ID
                  .map((reservation) => (
                    <tr className="text-center" key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{reservation.guests_id_guest}</td>
                      <td>{new Date(reservation.date_reserve).toLocaleDateString()}</td>
                      <td>{new Date(reservation.date_checkin).toLocaleDateString()}</td>
                      <td>{new Date(reservation.date_checkout).toLocaleDateString()}</td>
                      <td>{reservation.number_nights}</td>
                      <td>{reservation.rooms ? reservation.rooms.join(', ') : 'No rooms assigned'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            variant="link"
                            onClick={() => handleShowEditModal(reservation)}
                            title="Edit"
                          >
                            <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                          </Button>

                          <Button
                            variant="link"
                            onClick={() => handleShowDeleteModal(reservation)}
                            title="Delete"
                          >
                            <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      

      <ReservationForm
        show={showForm}
        handleClose={handleCloseForm}
        addReservation={addReservation}
        updateReservation={updateReservation}
        reservation={reservationToEdit} // Pasar la reserva a editar
      />

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the reservation with ID <strong>{reservationToDelete?.id}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reservations;
