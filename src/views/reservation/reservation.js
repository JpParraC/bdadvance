import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ReservationForm from './reservationform';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash } from '@coreui/icons';
import axios from 'axios';
import '../../css/styles.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [reservationDateFilter, setReservationDateFilter] = useState('');

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations/');
      setReservations(response.data);
    } catch (error) {
      console.error("Error loading reservations:", error);
      alert("An error occurred while fetching reservations.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = Array.isArray(reservations)
  ? reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.dateReserve);
      const selectedDate = new Date(reservationDateFilter);

      return reservationDateFilter
        ? reservationDate.toDateString() === selectedDate.toDateString()
        : true;
    })
  : [];


  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
  };

  const addReservation = async (newReservation) => {
    try {
      const response = await axios.post('http://localhost:5000/api/reservations/', newReservation);
      setReservations([...reservations, response.data]);
      setShowReservationForm(false);
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  const updateReservation = async (updatedReservation) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/reservations/'${updatedReservation.id}`, updatedReservation);
      const updatedReservations = reservations.map((reservation) =>
        reservation.id === updatedReservation.id ? response.data : reservation
      );
      setReservations(updatedReservations);
      setShowReservationForm(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/'/${id}`);
      setReservations(reservations.filter((reservation) => reservation.id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div>
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
      </div>

      <div className="table-responsive mt-3">
        <div className="custom-table-container">
          <Table className="custom-table">
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
                  filteredReservations.map((reservation) => (
                    <tr className="text-center" key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{reservation.guests_id_guest}</td>

                      {/* Formateo de la fecha */}
                      <td>{new Date(reservation.date_reserve).toLocaleDateString()}</td>
                      <td>{new Date(reservation.date_checkin).toLocaleDateString()}</td>
                      <td>{new Date(reservation.date_checkout).toLocaleDateString()}</td>
                      
                      <td>{reservation.number_nights}</td>

                      {/* Mostrar las habitaciones separadas por comas */}
                      <td>{reservation.rooms ? reservation.rooms.join(', ') : 'No rooms assigned'}</td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            variant="link"
                            onClick={() => {
                              setEditReservation(reservation);
                              setShowReservationForm(true);
                            }}
                            title="Edit"
                          >
                            <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => deleteReservation(reservation.id)}
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
      </div>

      <ReservationForm
        show={showReservationForm}
        handleClose={handleCloseReservationForm}
        addReservation={addReservation}
        updateReservation={updateReservation}
        reservation={editReservation}
      />
    </div>
  );
};

export default Reservations;