import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import { Popover, OverlayTrigger } from 'react-bootstrap'; // Importar popover
import 'react-calendar/dist/Calendar.css';
import '../../css/styles.css';

const API_URL = "http://localhost:5000/api"; // URL base del API

const RoomCalendar = () => {
  const [value, setValue] = useState(new Date()); // Inicializa con la fecha de hoy
  const [rooms, setRooms] = useState([]); 
  const [roomAvailability, setRoomAvailability] = useState({}); // Mantener estado de disponibilidad por habitación
  const [reservations, setReservations] = useState([]); // Mantener estado de las reservas

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/rooms`);
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      const checkin = value.toISOString().split('T')[0];
      const checkout = new Date(value);
      checkout.setDate(checkout.getDate() + 1);
      const checkoutStr = checkout.toISOString().split('T')[0];

      const fetchReservationsForDateRange = async () => {
        try {
          const response = await axios.get(`${API_URL}/reservations`, {
            params: { checkin, checkout: checkoutStr },
          });
          setReservations(response.data);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchReservationsForDateRange();
    }
  }, [rooms, value]);

  useEffect(() => {
    const availability = {};
    rooms.forEach((room) => {
      const isAvailable = !reservations.some(reservation =>
        reservation.rooms.includes(room.id) &&
        new Date(value) >= new Date(reservation.date_checkin) &&
        new Date(value) < new Date(reservation.date_checkout)
      );
      availability[room.id] = isAvailable;
    });
    setRoomAvailability(availability);
  }, [reservations, value]);

  const handleDateChange = (date) => {
    setValue(date);
  };

  const renderRoomDetails = (roomId) => {
    const roomReservations = reservations.filter(reservation => reservation.rooms.includes(roomId));
    if (roomReservations.length > 0) {
      const reservation = roomReservations[0];
      return (
        <>
          <tr><td><strong>Room ID:</strong></td><td>{roomId}</td></tr>
          <tr><td><strong>Name:</strong></td><td>{rooms.find(room => room.id === roomId)?.name || `Room ${roomId}`}</td></tr>
          <tr><td><strong>Status:</strong></td><td>Occupied</td></tr>
          <tr><td><strong>Reservation ID:</strong></td><td>{reservation.id}</td></tr>
          <tr><td><strong>Guest ID:</strong></td><td>{reservation.guests_id_guest}</td></tr>
          <tr><td><strong>Check-in Date:</strong></td><td>{new Date(reservation.date_checkin).toLocaleDateString()}</td></tr>
          <tr><td><strong>Check-out Date:</strong></td><td>{new Date(reservation.date_checkout).toLocaleDateString()}</td></tr>
          <tr><td><strong>Number of Nights:</strong></td><td>{reservation.number_nights}</td></tr>
        </>
      );
    }
    return (
      <>
        <tr><td><strong>Room ID:</strong></td><td>{roomId}</td></tr>
        <tr><td><strong>Name:</strong></td><td>{rooms.find(room => room.id === roomId)?.name || `Room ${roomId}`}</td></tr>
        <tr><td><strong>Status:</strong></td><td>Available</td></tr>
      </>
    );
  };

  return (
    <CCard>
      <CCardHeader>
        <h4>Room Availability Calendar</h4>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol md={12}>
            <Calendar onChange={handleDateChange} value={value} className="calendar-custom mx-auto" />
          </CCol>
        </CRow>
        <CRow className="d-flex justify-content-center">
          {rooms.map((room) => (
            <CCol key={room.id} sm={6} md={4} lg={2} className="mb-4" style={{ padding: '10px' }}>
              <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={
                  <Popover id={`popover-${room.id}`} className="custom-popover">
                    <Popover.Header as="h3">Room {room.id}</Popover.Header>
                    <Popover.Body>
                      {roomAvailability[room.id] ? (
                        <div>Available</div>
                      ) : (
                        <table>
                          <thead>
                            <tr><th>Field</th><th>Details</th></tr>
                          </thead>
                          <tbody>{renderRoomDetails(room.id)}</tbody>
                        </table>
                      )}
                    </Popover.Body>
                  </Popover>
                }
              >
                <div
                  className={`room p-2 text-white text-center mx-auto rounded ${roomAvailability[room.id] ? 'available' : 'occupied'}`}
                  title={`Room ${room.id}`}
                  style={{ backgroundColor: roomAvailability[room.id] ? 'green' : 'red', height: '80px', width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '5px' }}
                >
                  <FontAwesomeIcon icon={faDoorOpen} size="2x" />
                  <div>Room {room.id}</div>
                </div>
              </OverlayTrigger>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default RoomCalendar;