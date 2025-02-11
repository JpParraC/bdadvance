import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash, cilPlus } from '@coreui/icons';

const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false); // Estado para mostrar el modal
  const [newRoom, setNewRoom] = useState({
    status: '0', // Valor por defecto para el estado
    room_type_id: '', // Este valor debe ser ingresado por el usuario
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/specific/roomsall/room');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/specific/roomsall/room', newRoom);
      setRooms([...rooms, response.data]); // Agregar la nueva habitación al estado
      setShowAddRoomModal(false); // Cerrar el modal
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="table-responsive hh mt-3">
      <Button
        className="mb-3"
        variant="primary"
        onClick={() => setShowAddRoomModal(true)}
      >
        <CIcon icon={cilPlus} style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
        Add Room
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Room ID</th>
            <th>Equipment Names</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr className="text-center" key={room.room_id}>
              <td>{room.room_id}</td>
              <td>{room.equipment_names}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="link" title="Edit">
                    <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                  </Button>
                  <Button variant="link" title="Delete">
                    <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar una nueva habitación */}
      <Modal show={showAddRoomModal} onHide={() => setShowAddRoomModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Room Type ID</Form.Label>
              <Form.Control
                type="text"
                name="room_type_id"
                value={newRoom.room_type_id}
                onChange={handleChange}
                required
                placeholder="Enter Room Type ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newRoom.status}
                onChange={handleChange}
                required
              >
                <option value="0">Inactive</option>
                <option value="1">Active</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddRoomModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddRoom}>
            Add Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomsTable;
