import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ReservationForm = ({ show, handleClose, addReservation, updateReservation, reservation }) => {
  const [formData, setFormData] = useState({
    dateReserve: '',
    dateCheckin: '',
    dateCheckout: '',
    numberNights: '',
    roomAssigned: '',
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        dateReserve: reservation.dateReserve,
        dateCheckin: reservation.dateCheckin,
        dateCheckout: reservation.dateCheckout,
        numberNights: reservation.numberNights,
        roomAssigned: reservation.roomAssigned,
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reservation) {
      updateReservation({ ...reservation, ...formData }); // actualiza con los datos del formulario
    } else {
      addReservation(formData);
    }
    handleClose(); // Cierra el modal después de enviar el formulario
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
            />
          </div>
          <div className="mb-3">
            <label htmlFor="roomAssigned" className="form-label">Room Assigned</label>
            <input
              type="text"
              id="roomAssigned"
              name="roomAssigned"
              className="form-control"
              value={formData.roomAssigned}
              onChange={handleChange}
              required
            />
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
