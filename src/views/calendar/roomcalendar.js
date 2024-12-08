import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
import 'react-calendar/dist/Calendar.css';
import '../../css/styles.css'; // Asegúrate de crear este archivo CSS

// URL de la API
const API_URL = "http://localhost:3001";

const RoomCalendar = () => {
  const [value, setValue] = useState(new Date()); // Selected date on the calendar
  const [rooms, setRooms] = useState([]); // List of rooms
  const [reservations, setReservations] = useState([]); // List of reservations

  // Fetch rooms and reservations data from the API
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

  // Check if the room is reserved for the selected date
  const isRoomReserved = (roomId, selectedDate) => {
    return reservations.some((reservation) => {
      const checkinDate = new Date(reservation.dateCheckin);
      const checkoutDate = new Date(reservation.dateCheckout);
      const currentDate = new Date(selectedDate);

      // Check if any of the rooms in the reservation includes this room
      return reservation.rooms.some((room) => room.roomAssigned === roomId) &&
        currentDate >= checkinDate && 
        currentDate < checkoutDate;
    });
  };

  // Update the status of rooms based on the selected date
  const updateRoomStatus = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Get the date in 'YYYY-MM-DD' format

    const updatedRooms = rooms.map((room) => {
      const reserved = isRoomReserved(room.id, formattedDate); // Check if room is reserved for this date
      return {
        ...room,
        status: reserved ? 'occupied' : 'available', // Set status based on reservation
      };
    });

    setRooms(updatedRooms); // Update rooms state with new status
  };

  // Handle date change on the calendar
  const handleDateChange = (date) => {
    setValue(date); // Update selected date
    updateRoomStatus(date); // Update room status based on new date
  };

  // Fetch room and reservation data when the component mounts
  useEffect(() => {
    fetchRoomsAndReservations();
  }, []);

  // Update room statuses whenever the selected date, rooms, or reservations change
  useEffect(() => {
    if (rooms.length && reservations.length) {
      updateRoomStatus(value); // Update rooms based on the selected date
    }
  }, [value, rooms, reservations]);

  return (
    <CCard>
      <CCardHeader>
        <h4>Room Availability Calendar</h4>
      </CCardHeader>
      <CCardBody>
        {/* Calendar Row */}
        <CRow className="mb-4">
          <CCol md={12}>
            <Calendar 
              onChange={handleDateChange} 
              value={value} 
              className="calendar-custom mx-auto" // Apply custom styles to the calendar
            />
          </CCol>
        </CRow>

        {/* Rooms Grid - Rooms displayed below the calendar in a responsive grid */}
        <CRow className="d-flex justify-content-center">
          {rooms.map((room) => (
            <CCol 
              key={room.id} 
              sm={6} // For small screens, show 2 rooms per row
              md={4} // For medium screens, show 3 rooms per row
              lg={2} // For large screens, show 4 rooms per row
              className="mb-4" // Add margin between rooms
              style={{ padding: '10px' }} // Add padding for spacing between rooms
            > 
              <div
                className={`room p-2 text-white text-center mx-auto rounded ${room.status}`}
                title={room.name || `Room ${room.id}`}
                style={{
                  backgroundColor: room.status === 'available' ? 'green' : 'red',
                  height: '80px', // Fixed height for the room
                  width: '70%',  // Make the width dynamic to fit the column
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0', // Remove any padding that might increase size
                  margin: '0',  // Remove margin to ensure tight spacing
                }}
              >
                {/* Door Icon */}
                <FontAwesomeIcon 
                  icon={faDoorOpen} 
                  size="1x" // Adjust icon size to '1x' for better visibility
                  className="mb-3" 
                />
                {/* Room Name */}
                <div style={{ fontSize: '10px', marginTop: '2px' }}>{room.name || `Room ${room.id}`}</div> {/* Slightly larger font */}
              </div>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default RoomCalendar;
