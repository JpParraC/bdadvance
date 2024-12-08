import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ReservationForm = ({ show, handleClose, addReservation, updateReservation, reservation }) => {
  const [rooms, setRooms] = useState([]); // State for rooms
  const [roomTypes, setRoomTypes] = useState([]); // State for room types
  const [reservations, setReservations] = useState([]); // State for existing reservations
  const [formData, setFormData] = useState({
    dateReserve: '',
    dateCheckin: '',
    dateCheckout: '',
    numberNights: '',
  });
  const [roomBlocks, setRoomBlocks] = useState([]); // State for room blocks
  const [filteredRooms, setFilteredRooms] = useState([]); // Array of filtered rooms for each block

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://localhost:3001/rooms');
        const roomTypesResponse = await axios.get('http://localhost:3001/room_types');
        const reservationsResponse = await axios.get('http://localhost:3001/reservations');

        setRooms(roomsResponse.data);
        setRoomTypes(roomTypesResponse.data);
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Reset form data when modal is closed or when new reservation is added
  useEffect(() => {
    if (!show) { // Reset when modal is closed
      setFormData({
        dateReserve: '',
        dateCheckin: '',
        dateCheckout: '',
        numberNights: '',
      });
      setRoomBlocks([]);
      setFilteredRooms([]);
    } else if (reservation) {
      // Set form data if we are editing an existing reservation
      setFormData({
        dateReserve: reservation.dateReserve,
        dateCheckin: reservation.dateCheckin,
        dateCheckout: reservation.dateCheckout,
        numberNights: reservation.numberNights,
      });
      setRoomBlocks(reservation.rooms || [{ roomType: '', roomAssigned: '' }]);
    }
  }, [show, reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'dateCheckin' || name === 'dateCheckout') {
      calculateNumberOfNights(value, name);
    }
  };

  const calculateNumberOfNights = (changedDate, changedField) => {
    const checkinDate = changedField === 'dateCheckin' ? new Date(changedDate) : new Date(formData.dateCheckin);
    const checkoutDate = changedField === 'dateCheckout' ? new Date(changedDate) : new Date(formData.dateCheckout);

    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
      const diffTime = checkoutDate - checkinDate;
      const diffDays = diffTime / (1000 * 3600 * 24);
      setFormData((prevState) => ({
        ...prevState,
        numberNights: diffDays,
      }));
    }
  };

  const handleRoomTypeChange = (index, roomType) => {
    const newRoomBlocks = roomBlocks.map((block, idx) =>
      idx === index ? { ...block, roomType, roomAssigned: '' } : block
    );
    setRoomBlocks(newRoomBlocks);

    if (formData.dateCheckin && formData.dateCheckout && roomType) {
      const unavailableRooms = reservations
        .filter((res) => {
          const checkin = new Date(res.dateCheckin);
          const checkout = new Date(res.dateCheckout);
          const selectedCheckin = new Date(formData.dateCheckin);
          const selectedCheckout = new Date(formData.dateCheckout);

          return selectedCheckin < checkout && selectedCheckout > checkin;
        })
        .flatMap((res) => res.rooms.map((room) => room.roomAssigned));

      const availableRooms = rooms.filter(
        (room) =>
          room.typeId === roomType &&
          room.status === 'available' &&
          !unavailableRooms.includes(room.id)
      );

      const newFilteredRooms = [...filteredRooms];
      newFilteredRooms[index] = availableRooms;
      setFilteredRooms(newFilteredRooms);
    }
  };

  const handleRoomChange = (index, roomAssigned) => {
    const newRoomBlocks = roomBlocks.map((block, idx) =>
      idx === index ? { ...block, roomAssigned } : block
    );
    setRoomBlocks(newRoomBlocks);
  };

  const handleAddRoom = () => {
    setRoomBlocks([...roomBlocks, { roomType: '', roomAssigned: '' }]);
    setFilteredRooms([...filteredRooms, []]); // Add a new empty array for the new block
  };

  const handleRemoveRoom = (index) => {
    const newRoomBlocks = roomBlocks.filter((_, idx) => idx !== index);
    const newFilteredRooms = filteredRooms.filter((_, idx) => idx !== index);
    setRoomBlocks(newRoomBlocks);
    setFilteredRooms(newFilteredRooms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = { ...formData, rooms: roomBlocks };

    if (reservation) {
      updateReservation({ ...reservation, ...reservationData });
    } else {
      addReservation(reservationData); // Reset the form after adding
      handleClose(); // Close the modal
    }
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
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rooms</label>
            {roomBlocks.map((block, index) => (
              <div key={index} className="mb-2 d-flex align-items-center">
                <select
                  className="form-control me-2"
                  value={block.roomType}
                  onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control me-2"
                  value={block.roomAssigned}
                  onChange={(e) => handleRoomChange(index, e.target.value)}
                  required
                  disabled={!block.roomType}
                >
                  <option value="">Select Room</option>
                  {filteredRooms[index]?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.id}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveRoom(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-primary mt-2" onClick={handleAddRoom}>
              Add Room
            </button>
          </div>
          <Button type="submit" variant="primary">
            {reservation ? 'Update Reservation' : 'Add Reservation'}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservationForm;
