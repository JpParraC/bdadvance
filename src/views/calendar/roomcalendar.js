import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
import 'react-calendar/dist/Calendar.css';
import '../../css/styles.css';

const API_URL = "http://localhost:3001";

const RoomCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);

  const fetchRoomsAndReservations = async () => {
    try {
      const roomsResponse = await fetch(`${API_URL}/rooms`);
      const reservationsResponse = await fetch(`${API_URL}/reservations`);
      const roomsData = await roomsResponse.json();
      const reservationsData = await reservationsResponse.json();
      setRooms(roomsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isRoomReserved = (roomId, selectedDate) => {
    return reservations.some((reservation) => {
      const checkinDate = new Date(reservation.dateCheckin);
      const checkoutDate = new Date(reservation.dateCheckout);
      const currentDate = new Date(selectedDate);
      return reservation.rooms.some((room) => room.roomAssigned === roomId) &&
        currentDate >= checkinDate && 
        currentDate < checkoutDate;
    });
  };

  const updateRoomStatus = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const updatedRooms = rooms.map((room) => {
      const reserved = isRoomReserved(room.id, formattedDate);
      return {
        ...room,
        status: reserved ? 'occupied' : 'available',
      };
    });

    // Solo actualiza si hay cambios
    if (JSON.stringify(updatedRooms) !== JSON.stringify(rooms)) {
      setRooms(updatedRooms);
    }
  };

  const handleDateChange = (date) => {
    setValue(date);
  };

  useEffect(() => {
    fetchRoomsAndReservations();
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && reservations.length > 0) {
      updateRoomStatus(value);
    }
  }, [value, reservations]);

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
              <div
                className={`room p-2 text-white text-center mx-auto rounded ${room.status}`}
                title={room.name || `Room ${room.id}`}
                style={{
                  backgroundColor: room.status === 'available' ? 'green' : 'red',
                  height: '80px',
                  width: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0',
                  margin: '0',
                }}
              >
                <FontAwesomeIcon 
                  icon={faDoorOpen} 
                  size="1x" 
                  className="mb-3" 
                />
                <div style={{ fontSize: '10px', marginTop: '2px' }}>{room.name || `Room ${room.id}`}</div>
              </div>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default RoomCalendar;
