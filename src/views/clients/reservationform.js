import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ReservationForm = ({ show, handleClose, addReservation, updateReservation, reservation }) => {
  const [rooms, setRooms] = useState([]); // State for rooms
  const [roomTypes, setRoomTypes] = useState([]); // State for room types
  const [equipments, setEquipments] = useState([]); // State for equipment
  const [reservations, setReservations] = useState([]); // State for existing reservations
  const [formData, setFormData] = useState({
    dateReserve: '',
    dateCheckin: '',
    dateCheckout: '',
    numberNights: '',
    roomAssigned: '', // This field is removed
  });

  const [roomType, setRoomType] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]); // State for filtered rooms
  const [roomsNotAvailable, setRoomsNotAvailable] = useState(false); // State to track if rooms are available

  useEffect(() => {
    // Function to fetch data from the database (JSON) using axios
    const fetchData = async () => {
      try {
        // Requests to get room data, room types, equipment, and existing reservations
        const roomsResponse = await axios.get('http://localhost:3001/rooms'); // URL to fetch rooms
        const roomTypesResponse = await axios.get('http://localhost:3001/room_types'); // URL to fetch room types
        const equipmentsResponse = await axios.get('http://localhost:3001/room_equipment'); // URL to fetch equipment
        const reservationsResponse = await axios.get('http://localhost:3001/reservations'); // URL to fetch existing reservations
        
        // Set the state with the fetched data
        setRooms(roomsResponse.data);
        setRoomTypes(roomTypesResponse.data);
        setEquipments(equipmentsResponse.data);
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    if (reservation) {
      setFormData({
        dateReserve: reservation.dateReserve,
        dateCheckin: reservation.dateCheckin,
        dateCheckout: reservation.dateCheckout,
        numberNights: reservation.numberNights,
      });
      setRoomType(reservation.roomType || ''); // Set the room type if we are editing a reservation
    }
  }, [reservation]);

  useEffect(() => {
    // Filter rooms by the selected room type
    if (roomType) {
      const availableRooms = rooms.filter(room => room.status === "available" && room.typeId === roomType);
      setFilteredRooms(availableRooms); // Update filtered rooms based on room type
    } else {
      setFilteredRooms([]); // Reset when no room type is selected
    }
  }, [roomType, rooms]);

  useEffect(() => {
    // Filter out rooms that are already booked in the selected dates
    if (formData.dateCheckin && formData.dateCheckout && roomType) {
      const unavailableRooms = reservations.filter(reservation => {
        const checkin = new Date(reservation.dateCheckin);
        const checkout = new Date(reservation.dateCheckout);
        const selectedCheckin = new Date(formData.dateCheckin);
        const selectedCheckout = new Date(formData.dateCheckout);

        // Check for overlapping dates
        return (selectedCheckin < checkout && selectedCheckout > checkin);
      }).map(reservation => reservation.roomAssigned);

      const availableRooms = rooms.filter(room => 
        room.status === "available" && 
        room.typeId === roomType && 
        !unavailableRooms.includes(room.id)
      );

      setFilteredRooms(availableRooms); // Set available rooms excluding booked ones

      // Set roomsNotAvailable to true if no rooms are available
      setRoomsNotAvailable(availableRooms.length === 0);
    }
  }, [formData.dateCheckin, formData.dateCheckout, roomType, reservations, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Automatically calculate the number of nights when check-in or check-out dates change
    if (name === 'dateCheckin' || name === 'dateCheckout') {
      calculateNumberOfNights(value, name);
    }
  };

  // Function to calculate the number of nights based on check-in and check-out dates
  const calculateNumberOfNights = (changedDate, changedField) => {
    const checkinDate = changedField === 'dateCheckin' ? new Date(changedDate) : new Date(formData.dateCheckin);
    const checkoutDate = changedField === 'dateCheckout' ? new Date(changedDate) : new Date(formData.dateCheckout);

    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
      const diffTime = checkoutDate - checkinDate;
      const diffDays = diffTime / (1000 * 3600 * 24); // Convert time difference to days
      setFormData((prevState) => ({
        ...prevState,
        numberNights: diffDays, // Set the calculated number of nights
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = { ...formData, roomType }; // Include room type in the data

    if (reservation) {
      updateReservation({ ...reservation, ...reservationData });
    } else {
      addReservation(reservationData);
    }
    handleClose(); // Close the modal after submitting the form
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{reservation ? 'Edit Reservation' : 'Add Reservation'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="dateReserve" className="form-label">Reservation Date</label>
            <input
              type="date"
              id="dateReserve"
              name="dateReserve"
              className="form-control"
              value={formData.dateReserve}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateCheckin" className="form-label">Check-In Date</label>
            <input
              type="date"
              id="dateCheckin"
              name="dateCheckin"
              className="form-control"
              value={formData.dateCheckin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateCheckout" className="form-label">Check-Out Date</label>
            <input
              type="date"
              id="dateCheckout"
              name="dateCheckout"
              className="form-control"
              value={formData.dateCheckout}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numberNights" className="form-label">Number of Nights</label>
            <input
              type="number"
              id="numberNights"
              name="numberNights"
              className="form-control"
              value={formData.numberNights}
              onChange={handleChange}
              required
              min="1"
              disabled
            />
          </div>

          {/* Room type selection */}
          <div className="mb-3">
            <label htmlFor="roomType" className="form-label">Room Type</label>
            <select
              id="roomType"
              name="roomType"
              className="form-control"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type} - {type.capacity} people - {type.price} $/night
                  <br />
                  Bed: {type.type_bed} - Size: {type.size} - Floor: {type.hotel_floor}
                </option>
              ))}
            </select>
          </div>

          {/* Show available rooms based on selected room type */}
          {roomType && !roomsNotAvailable && (
            <div className="mb-3">
              <label htmlFor="roomAssigned" className="form-label">Select Available Room</label>
              <select
                id="roomAssigned"
                name="roomAssigned"
                className="form-control"
                value={formData.roomAssigned}
                onChange={handleChange}
                required
              >
                <option value="">Select Room</option>
                {filteredRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.id} - {room.equipment.join(', ')} {/* Show the list of equipment as context */}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show message if no rooms are available */}
          {roomsNotAvailable && <div className="text-danger">Rooms not available for the selected dates.</div>}

          <Button type="submit" variant="primary" disabled={roomsNotAvailable}>
            {reservation ? 'Update Reservation' : 'Add Reservation'}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservationForm;
