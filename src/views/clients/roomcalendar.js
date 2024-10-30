import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
import 'react-calendar/dist/Calendar.css';

const RoomCalendar = () => {
  const [value, setValue] = useState(new Date());

  // Lista ampliada de habitaciones
  const rooms = [
    { id: 1, name: 'Room 101', status: 'available' },
    { id: 2, name: 'Room 102', status: 'occupied' },
    { id: 3, name: 'Room 103', status: 'maintenance' },
    { id: 4, name: 'Room 104', status: 'available' },
    { id: 5, name: 'Room 105', status: 'occupied' },
    { id: 6, name: 'Room 106', status: 'maintenance' },
    { id: 7, name: 'Room 107', status: 'available' },
    { id: 8, name: 'Room 108', status: 'occupied' },
    { id: 9, name: 'Room 109', status: 'maintenance' },
    { id: 10, name: 'Room 110', status: 'available' },
    { id: 11, name: 'Room 111', status: 'occupied' },
    { id: 12, name: 'Room 112', status: 'available' },
  ];

  const handleDateChange = (date) => {
    setValue(date);
  };

  return (
    <CCard>
      <CCardHeader>
        <h4>Room Availability Calendar</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md={6}>
            <Calendar onChange={handleDateChange} value={value} />
          </CCol>
          <CCol md={6}>
            <div className="d-flex flex-wrap">
              {rooms.map(room => (
                <div 
                  key={room.id} 
                  className={`room p-3 m-1 text-white text-center rounded ${room.status}`}
                  title={room.name}
                  style={{ 
                    backgroundColor: room.status === 'available' ? 'green' : room.status === 'occupied' ? 'red' : 'purple',
                    flex: '1 1 calc(25% - 1rem)' 
                  }}
                >
                  <FontAwesomeIcon icon={faDoorOpen} size="2x" /> {/* Icono de puerta */}
                  <div>{room.name}</div>
                </div>
              ))}
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default RoomCalendar;
