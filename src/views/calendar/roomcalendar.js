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

  // Función para obtener las habitaciones
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`); // Petición a la API para obtener habitaciones
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Función para obtener las reservas en un rango de fechas
  const fetchReservationsForDateRange = async (checkin, checkout) => {
    try {
      const response = await axios.get(`${API_URL}/reservations`, {
        params: { checkin, checkout },
      });
      setReservations(response.data); // Guardamos las reservas en el estado
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Función para verificar la disponibilidad de una habitación
  const checkRoomAvailability = (roomId, checkin, checkout) => {
    // Verificamos si la habitación está reservada en el rango de fechas
    for (const reservation of reservations) {
      if (reservation.rooms.includes(roomId)) {
        const isOverlapping =
          (new Date(checkin) >= new Date(reservation.date_checkin) && new Date(checkin) < new Date(reservation.date_checkout)) ||
          (new Date(checkout) > new Date(reservation.date_checkin) && new Date(checkout) <= new Date(reservation.date_checkout));

        if (isOverlapping) {
          return false; // Si hay superposición de fechas, la habitación no está disponible
        }
      }
    }
    return true; // Si no hay reservas, la habitación está disponible
  };

  // Función para obtener la disponibilidad de las habitaciones para la fecha seleccionada
  const fetchRoomAvailability = async (selectedDate) => {
    const checkin = selectedDate.toISOString(); // Convertimos la fecha seleccionada a formato ISO
    const checkout = new Date(selectedDate);
    checkout.setDate(checkout.getDate() + 1); // Agregar 1 día para el checkout

    const availability = {};

    // Verificamos la disponibilidad de cada habitación
    rooms.forEach((room) => {
      const isAvailable = checkRoomAvailability(room.id, checkin, checkout);
      availability[room.id] = isAvailable; // Guardamos la disponibilidad por habitación
    });

    setRoomAvailability(availability); // Actualizamos el estado con la disponibilidad de todas las habitaciones
  };

  const handleDateChange = (date) => {
    setValue(date); // Establecer la fecha seleccionada
  };

  // useEffect para cargar habitaciones y realizar la verificación de disponibilidad en la fecha inicial
  useEffect(() => {
    const fetchData = async () => {
      await fetchRooms(); // Cargar habitaciones
    };

    fetchData(); // Ejecutar la carga de datos al montar el componente
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // useEffect para cargar reservas y verificar la disponibilidad de la fecha actual
  useEffect(() => {
    if (rooms.length > 0) {
      const checkin = value.toISOString();
      const checkout = new Date(value);
      checkout.setDate(checkout.getDate() + 1); // Sumar un día para el checkout
      fetchReservationsForDateRange(checkin, checkout); // Cargar reservas
      fetchRoomAvailability(value); // Verificar disponibilidad de habitaciones para la fecha actual
    }
  }, [rooms, value]); // Ejecuta cuando cambian las habitaciones o la fecha

  // Función para mostrar detalles de la habitación cuando está ocupada
  const renderRoomDetails = (roomId) => {
    const roomReservations = reservations.filter((reservation) => 
      reservation.rooms.includes(roomId) // Verificamos si la habitación está en la reserva
    );

    if (roomReservations.length > 0) {
      const reservation = roomReservations[0]; // Tomamos la primera reserva que encontremos
      return (
        <>
          <tr>
            <td><strong>Room ID:</strong></td>
            <td>{roomId}</td>
          </tr>
          <tr>
            <td><strong>Name:</strong></td>
            <td>{rooms.find(room => room.id === roomId)?.name || `Room ${roomId}`}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td>Occupied</td>
          </tr>
          <tr>
            <td><strong>Reservation ID:</strong></td>
            <td>{reservation.id}</td>
          </tr>
          <tr>
            <td><strong>Guest ID:</strong></td>
            <td>{reservation.guests_id_guest}</td>
          </tr>
          <tr>
            <td><strong>Check-in Date:</strong></td>
            <td>{new Date(reservation.date_checkin).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Check-out Date:</strong></td>
            <td>{new Date(reservation.date_checkout).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td><strong>Number of Nights:</strong></td>
            <td>{reservation.number_nights}</td>
          </tr>
        </>
      );
    }

    // Si no hay reservas, mostramos un mensaje predeterminado
    return (
      <>
        <tr>
          <td><strong>Room ID:</strong></td>
          <td>{roomId}</td>
        </tr>
        <tr>
          <td><strong>Name:</strong></td>
          <td>{rooms.find(room => room.id === roomId)?.name || `Room ${roomId}`}</td>
        </tr>
        <tr>
          <td><strong>Status:</strong></td>
          <td>Available</td>
        </tr>
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
            <Calendar 
              onChange={handleDateChange} 
              value={value} 
              className="calendar-custom mx-auto"
            />
          </CCol>
        </CRow>
        <CRow className="d-flex justify-content-center">
          {rooms.map((room) => (
            <CCol 
              key={room.id} 
              sm={6} 
              md={4} 
              lg={2} 
              className="mb-4"
              style={{ padding: '10px' }}
            > 
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
                            <tr>
                              <th>Field</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {renderRoomDetails(room.id)}
                          </tbody>
                        </table>
                      )}
                    </Popover.Body>
                  </Popover>
                }
              >
                <div
                  className={`room p-2 text-white text-center mx-auto rounded ${roomAvailability[room.id] ? 'available' : 'occupied'}`}
                  title={`Room ${room.id}`}
                  style={{
                    backgroundColor: roomAvailability[room.id] ? 'green' : 'red',
                    height: '80px',
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0',
                    margin: '5px',
                  }}
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
