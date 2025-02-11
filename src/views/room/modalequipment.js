import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const AddEquipmentModal = ({ show, handleClose }) => {
  const [rooms, setRooms] = useState([]); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomEquipment, setRoomEquipment] = useState([]); 
  const [allEquipment, setAllEquipment] = useState([]); 
  const [availableEquipment, setAvailableEquipment] = useState([]); 
  const [selectedEquipment, setSelectedEquipment] = useState([]); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));

    fetch("http://localhost:5000/api/equipment/")
      .then((response) => response.json())
      .then((data) => setAllEquipment(data))
      .catch((error) => console.error("Error fetching equipment:", error));
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomEquipment(selectedRoom);
    }
  }, [selectedRoom]);

  const fetchRoomEquipment = (roomId) => {
    fetch(`http://localhost:5000/api/specific/room/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        setRoomEquipment(data);
        filterAvailableEquipment(data);
      })
      .catch((error) => console.error("Error fetching room equipment:", error));
  };

  const filterAvailableEquipment = (assignedEquipment) => {
    const assignedIds = assignedEquipment.map((item) => item.equipment_id);
    const available = allEquipment.filter(
      (item) => !assignedIds.includes(item.id)
    );
    setAvailableEquipment(available);
  };

  const handleEquipmentChange = (event) => {
    const { value, checked } = event.target;
    setSelectedEquipment((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleAddEquipment = () => {
    if (selectedEquipment.length > 0) {
      // Buscar el objeto de la habitación seleccionada en rooms
      const selectedRoomData = rooms.find((room) => room.id === Number(selectedRoom));
  
      if (!selectedRoomData) {
        console.error("Room data not found!");
        return;
      }
  
      const payload = {
        equipment_ids: selectedEquipment,
        room_type_id: selectedRoomData.room_type_id, // Se envía room_type_id
      };
  
      fetch(`http://localhost:5000/api/specific/add-equipment/${selectedRoom}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then(() => {
          setShowSuccessModal(true);
        })
        .catch((error) => console.error("Error adding equipment:", error));
    }
  };
  

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleClose(); // Cierra también el modal principal
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Room and View Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="roomSelect">
              <Form.Label>Select Room</Form.Label>
              <Form.Control
                as="select"
                value={selectedRoom || ""}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">-- Select a Room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.id} (Type {room.room_type_id})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>

          {selectedRoom && (
            <>
              <h5 className="mt-4">Current Equipment</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                  </tr>
                </thead>
                <tbody>
                  {roomEquipment.length > 0 ? (
                    roomEquipment.map((equipment) => (
                      <tr key={equipment.equipment_id}>
                        <td>{equipment.equipment_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No equipment assigned to this room.</td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <h5 className="mt-4">Add New Equipment</h5>
              {availableEquipment.length > 0 ? (
                availableEquipment.map((equipment) => (
                  <Form.Check
                    key={equipment.id}
                    type="checkbox"
                    label={equipment.equipment_name}
                    value={equipment.id}
                    onChange={handleEquipmentChange}
                  />
                ))
              ) : (
                <p>No available equipment to add.</p>
              )}

              <Button
                variant="primary"
                className="mt-3"
                onClick={handleAddEquipment}
                disabled={selectedEquipment.length === 0}
              >
                Add Equipment
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de éxito */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The equipment has been successfully added to the room!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEquipmentModal;
