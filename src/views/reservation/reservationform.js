import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ReservationForm = ({ show, handleClose, addReservation, updateReservation, reservation, client }) => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    dateReserve: '',
    dateCheckin: '',
    dateCheckout: '',
    numberNights: '',
  });
  const [roomBlocks, setRoomBlocks] = useState([{ roomType: '', roomAssigned: '' }]);
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date value:', date);
      return ''; // Return an empty string or some placeholder
    }
    return d.toISOString().split('T')[0]; // Returns the date part in 'yyyy-MM-dd' format
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://localhost:5000/api/rooms');
        const roomTypesResponse = await axios.get('http://localhost:5000/api/roomtypes');
        const reservationsResponse = await axios.get('http://localhost:5000/api/reservations');

        setRooms(roomsResponse.data);
        setRoomTypes(roomTypesResponse.data);
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!show) {
      setFormData({
        dateReserve: '',
        dateCheckin: '',
        dateCheckout: '',
        numberNights: '',
      });
      setRoomBlocks([{ roomType: '', roomAssigned: '' }]);
      setAssignedRooms([]);
    } else if (reservation) {
      const { date_reserve, date_checkin, date_checkout, number_nights, guests_id_guest, rooms } = reservation;
  
      setFormData({
        dateReserve: date_reserve ? formatDate(date_reserve) : '',
        dateCheckin: date_checkin ? formatDate(date_checkin) : '',
        dateCheckout: date_checkout ? formatDate(date_checkout) : '',
        numberNights: number_nights || '',
        guests_id_guest: guests_id_guest || '',
      });
  
      setRoomBlocks(
        rooms?.map(room => ({
          roomType: room.roomTypeId,
          roomAssigned: room.id,
        })) || [{ roomType: '', roomAssigned: '' }]
      );
  
      setAssignedRooms(rooms?.map(room => room.id) || []);
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
    const newRoomBlocks = [...roomBlocks];
    newRoomBlocks[index].roomType = roomType;
    newRoomBlocks[index].roomAssigned = '';
    setRoomBlocks(newRoomBlocks);
  };

  const isRoomAvailable = async (roomId, dateCheckin, dateCheckout) => {
    try {
      const roomIdInt = parseInt(roomId, 10);
      if (isNaN(roomIdInt)) {
        console.error('Invalid roomId provided:', roomId);
        setErrorMessage('Invalid room ID.');
        setShowErrorModal(true);
        return false;
      }

      const params = {
        roomId: roomIdInt,
        checkin: new Date(dateCheckin).toISOString(),
        checkout: new Date(dateCheckout).toISOString(),
        _: new Date().getTime(),
      };

      console.log('Sending the following parameters to the backend:', params);

      const response = await axios.get('http://localhost:5000/api/availability', {
        params: params,
      });

      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking room availability:', error);
      setErrorMessage('Error checking room availability.');
      setShowErrorModal(true);
      return false;
    }
  };

  const handleRoomChange = async (index, roomAssigned) => {
    const { dateCheckin, dateCheckout } = formData;

    const isAvailable = await isRoomAvailable(roomAssigned, dateCheckin, dateCheckout);

    if (!isAvailable) {
      setErrorMessage(`Room ID: ${roomAssigned} is not available for the selected dates.`);
      setShowErrorModal(true);
      return;
    }

    const newRoomBlocks = [...roomBlocks];
    if (assignedRooms.includes(roomAssigned)) {
      setErrorMessage(`Room ID: ${roomAssigned} has already been assigned.`);
      setShowErrorModal(true);
      return;
    }

    newRoomBlocks[index].roomAssigned = roomAssigned;
    setRoomBlocks(newRoomBlocks);

    const newAssignedRooms = newRoomBlocks.map(block => block.roomAssigned).filter(Boolean);
    setAssignedRooms(newAssignedRooms);
  };

  const handleAddRoom = () => {
    setRoomBlocks([...roomBlocks, { roomType: '', roomAssigned: '' }]);
  };

  const handleRemoveRoom = (index) => {
    const newRoomBlocks = roomBlocks.filter((_, idx) => idx !== index);
    setRoomBlocks(newRoomBlocks);

    const newAssignedRooms = newRoomBlocks.map(block => block.roomAssigned).filter(Boolean);
    setAssignedRooms(newAssignedRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomsAssigned = roomBlocks
      .map(block => parseInt(block.roomAssigned, 10))
      .filter(room => !isNaN(room));

    const reservationData = {
      ...formData,
      rooms: roomsAssigned,
      date_reserve: new Date(formData.dateReserve).toISOString(),
      date_checkin: new Date(formData.dateCheckin).toISOString(),
      date_checkout: new Date(formData.dateCheckout).toISOString(),
      number_nights: formData.numberNights,
      guests_id_guest: reservation ? reservation.guests_id_guest : client.idGuest, // Asegurarse de usar `client.id_guest` cuando no haya `reservation`
    };

    console.log("Sending reservation data to backend:", reservationData);

    try {
      if (reservation) {
        await updateReservation({ ...reservation, ...reservationData });
        setSuccessMessage(`Reservation updated successfully for Guest ID: ${reservation.guests_id_guest}!`);
      } else {
        await addReservation(reservationData);
        setSuccessMessage(`Reservation added successfully for Guest ID: ${client.id_guest}!`);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error handling reservation:', error);
      setErrorMessage('An error occurred while processing the reservation.');
      setShowErrorModal(true);
    }
  };

  const getAvailableRooms = (roomType) => {
    if (!roomType) return [];

    const availableRooms = rooms.filter((room) =>
      room.room_type_id === parseInt(roomType) && room.status === '1' && !assignedRooms.includes(room.id)
    );

    return availableRooms;
  };

  const getRoomId = (roomId) => {
    return roomId ? `Room ID: ${roomId}` : 'N/A';
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  return (
    <>
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
              <label htmlFor="dateCheckin" className="form-label">Check-in Date</label>
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
              <label htmlFor="dateCheckout" className="form-label">Check-out Date</label>
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
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roomAssigned" className="form-label">Assigned Rooms</label>
              {roomBlocks.map((roomBlock, index) => (
                <div key={index} className="mb-3">
                  <select
                    value={roomBlock.roomType}
                    onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        
                        {type.id}
                      </option>
                    ))}
                  </select>

                  {roomBlock.roomType && (
                    <select
                      value={roomBlock.roomAssigned}
                      onChange={(e) => handleRoomChange(index, e.target.value)}
                      className="form-control mt-2"
                    >
                      <option value="">Select Room</option>
                      {getAvailableRooms(roomBlock.roomType).map((room) => (
                        <option key={room.id} value={room.id}>
                          {getRoomId(room.id)}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveRoom(index)}
                    className="btn btn-danger mt-2"
                  >
                    Remove Room
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddRoom}
                className="btn btn-primary"
              >
                Add Room
              </button>
            </div>

            <button type="submit" className="btn btn-success">
              {reservation ? 'Update Reservation' : 'Add Reservation'}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationForm;
