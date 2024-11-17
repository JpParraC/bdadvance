import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskForm = ({ show, handleClose, task, handleSave, staff }) => {
  const [description, setDescription] = useState(task ? task.description : 'cleaning');
  const [status, setStatus] = useState(task ? task.status : 'pending');
  const [staffId, setStaffId] = useState(task ? task.staffId : '');
  const [createdAt, setCreatedAt] = useState(task ? task.createdAt : new Date().toISOString().split('T')[0]); // Asignamos la fecha si es una nueva tarea

  // Lista de tareas posibles dentro del hotel
  const possibleDescriptions = [
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'room_service', label: 'Room Service' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'check_in', label: 'Check-in Assistance' },
    { value: 'check_out', label: 'Check-out Assistance' },
    { value: 'concierge', label: 'Concierge Service' },
    { value: 'event_management', label: 'Event Management' },
  ];

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setStatus(task.status);
      setStaffId(task.staffId);
      setCreatedAt(task.createdAt); // Mantener la fecha de creación si estamos editando una tarea
    }
  }, [task]);

  const handleSubmit = () => {
    const newTask = {
      id: task?.id,  // Si ya existe una tarea, usa su ID; si no, se asignará un nuevo ID en la base de datos
      description,
      status,
      staffId,
      createdAt,  // La fecha de creación se usa tal cual
    };
    handleSave(newTask);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Edit Task' : 'Add Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Cambiar descripción a un select */}
          <Form.Group controlId="taskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="select" value={description} onChange={(e) => setDescription(e.target.value)}>
              {possibleDescriptions.map(task => (
                <option key={task.value} value={task.value}>{task.label}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="taskStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="assignedStaff">
            <Form.Label>Assigned Staff</Form.Label>
            <Form.Control as="select" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
              <option value="">Select Staff</option>
              {staff.map(member => (
                <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
              ))}
            </Form.Control>
          </Form.Group>
          
          {/* Campo de fecha creado (solo se usará cuando sea una nueva tarea) */}
          {/* Este campo es solo visible al crear una tarea nueva */}
          {!task && (
            <Form.Group controlId="taskCreatedAt">
              <Form.Label>Created At</Form.Label>
              <Form.Control
                type="date"
                value={createdAt}
                onChange={() => {}}  // No dejamos que se edite manualmente
                readOnly  // Lo dejamos solo de lectura
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskForm;
