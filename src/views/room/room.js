import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CIcon } from '@coreui/icons-react';
import { cilCheck, cilX, cilSettings, cilPen } from '@coreui/icons';
import { Modal, Button, Form } from 'react-bootstrap';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/room_types');
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error loading room types:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:3001/room_equipment');
      setEquipment(response.data);
    } catch (error) {
      console.error("Error loading equipment:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchEquipment();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.id && room.id.toLowerCase().includes(roomTypeFilter.toLowerCase())
  );

  const handleRoomTypeFilterChange = (event) => {
    setRoomTypeFilter(event.target.value);
  };

  const getPriceByTypeId = (typeId) => {
    const roomType = roomTypes.find(type => type.id === typeId);
    return roomType ? roomType.price : 'N/A';
  };

  const getEquipmentNames = (equipmentIds) => {
    return equipmentIds.map(id => {
      const equip = equipment.find(e => e.id === id);
      return equip ? equip.name : 'Unknown';
    }).join(', ');
  };

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const handleEditRoom = (room) => {
    setCurrentRoom(room);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentRoom(null);
  };

  const handleModalSave = () => {
    if (currentRoom) {
      setRooms(rooms.map(room =>
        room.id === currentRoom.id ? currentRoom : room
      ));
    }
    handleModalClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentRoom(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-start">Rooms</h1>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Filter by room type" 
        value={roomTypeFilter} 
        onChange={handleRoomTypeFilterChange} 
      />

      <table className="table table-bordered">
        <thead className="thead-light text-center bg-light" style={{ backgroundColor: '#b4d3ff' }}>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Equipment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map(room => (
            <tr className="text-center" key={room.id}>
              <td>{room.id}</td>
              <td>{room.typeId || 'N/A'}</td>
              <td>{getPriceByTypeId(room.typeId) || 'N/A'}</td>
              <td>{room.status || 'N/A'}</td>
              <td>{getEquipmentNames(room.equipment) || 'N/A'}</td>
              <td className="text-center">
                <button className="btn btn-link" onClick={() => handleEditRoom(room)}>
                  <CIcon icon={cilPen} size="lg" />
                </button>
                <button 
                  className="btn btn-link text-success" 
                  onClick={() => handleStatusChange(room.id, 'occupied')}
                  disabled={room.status === 'occupied'}
                >
                  <CIcon icon={cilCheck} size="lg" />
                </button>
                <button 
                  className="btn btn-link text-danger" 
                  onClick={() => handleStatusChange(room.id, 'available')}
                  disabled={room.status === 'available'}
                >
                  <CIcon icon={cilX} size="lg" />
                </button>
                <button 
                  className="btn btn-link text-purple" 
                  onClick={() => handleStatusChange(room.id, 'maintenance')}
                  disabled={room.status === 'maintenance'}
                >
                  <CIcon icon={cilSettings} size="lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Flex container for both tables */}
      <div className="d-flex justify-content-between mt-5">
        {/* Section for Room Equipment */}
        <div className="me-2" style={{ flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
          <h2>Room Equipment</h2>
          <table className="table table-bordered">
            <thead className="thead-light text-center" style={{ backgroundColor: '#b4d3ff' }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.available ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section for Room Types */}
        <div className="ms-2" style={{ flex: 1 }}>
          <h2>Room Types</h2>
          <table className="table table-bordered">
            <thead className="thead-light text-center" style={{ backgroundColor: '#b4d3ff' }}>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Size</th>
                <th>Floor</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map(type => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td>{type.type}</td>
                  <td>{type.capacity}</td>
                  <td>{type.price}</td>
                  <td>{type.size}</td>
                  <td>{type.hotel_floor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Room Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRoom && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={currentRoom.id}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type ID</Form.Label>
                <Form.Control
                  type="text"
                  name="typeId"
                  value={currentRoom.typeId}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={currentRoom.status}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Equipment</Form.Label>
                <Form.Control
                  type="text"
                  name="equipment"
                  value={currentRoom.equipment.join(', ')}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Rooms;
