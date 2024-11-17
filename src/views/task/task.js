import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { CIcon } from '@coreui/icons-react';
import { cilPen, cilTrash, cilCheck } from '@coreui/icons';
import TaskForm from './taskform'; // Formulario para tareas
import StaffForm from '../staff/stafform';  // Sin la 's' final

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskIdFilter, setTaskIdFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState(''); // Estado para filtrar tareas por nombre de personal

  // Fetch tasks and staff data
  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => {
        const allTasks = response.data;
        // Ordenamos las tareas de la más reciente a la más antigua
        setTasks(allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setCompletedTasks(allTasks.filter(task => task.status === 'Completed')); // Filtrar tareas completadas
      })
      .catch(error => console.error("Error fetching tasks:", error));

    axios.get('http://localhost:3001/staff')
      .then(response => {
        setStaff(response.data);
      })
      .catch(error => console.error("Error fetching staff:", error));
  }, []);

  // Filtrar tareas por ID o nombre de personal
  const filteredTasks = tasks.filter(task => {
    // Filtramos las tareas que coinciden con el filtro por ID o por nombre de personal
    const assignedStaff = staff.find(member => member.id === task.staffId);
    const staffName = assignedStaff ? `${assignedStaff.firstName} ${assignedStaff.lastName}` : '';
    return (
      task.id.toString().includes(taskIdFilter) && 
      staffName.toLowerCase().includes(staffFilter.toLowerCase()) // Comparación de nombre de personal
    );
  });

  // Open task form
  const handleOpenTaskForm = () => {
    setEditTask(null);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  // Add new task
  const addTask = (newTask) => {
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => {
        setTasks([response.data, ...tasks]); // Añadimos la nueva tarea al principio de la lista
        setShowTaskForm(false);
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // Update existing task
  const updateTask = (updatedTask) => {
    axios.put(`http://localhost:3001/tasks/${updatedTask.id}`, updatedTask)
      .then(response => {
        const updatedList = tasks.map(task => task.id === updatedTask.id ? response.data : task);
        setTasks(updatedList);
        setShowTaskForm(false);
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Delete task
  const deleteTask = () => {
    if (taskToDelete) {
      axios.delete(`http://localhost:3001/tasks/${taskToDelete.id}`)
        .then(() => {
          setTasks(tasks.filter(task => task.id !== taskToDelete.id));
          setShowDeleteModal(false);
          setTaskToDelete(null);
        })
        .catch(error => console.error("Error deleting task:", error));
    }
  };

  // Change task status to "Completed"
  const markTaskAsCompleted = (task) => {
    const updatedTask = { ...task, status: 'Completed', completedAt: new Date().toISOString() }; // Añadimos la fecha y hora
    axios.put(`http://localhost:3001/tasks/${task.id}`, updatedTask)
      .then(response => {
        // Remover de la lista de tareas pendientes y añadir a las tareas completadas
        setTasks(tasks.filter(t => t.id !== task.id)); 
        setCompletedTasks([response.data, ...completedTasks]);
      })
      .catch(error => console.error("Error marking task as completed:", error));
  };

  return (
    <div>
      <h2>Task Management</h2>
      <Button variant="dark" onClick={handleOpenTaskForm}>Add Task</Button>

      <div style={{ marginTop: '10px' }}>
        {/* Filtro por Task ID */}
        <input 
          type="text"
          placeholder="Filter by Task ID"
          value={taskIdFilter}
          onChange={(e) => setTaskIdFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />

        {/* Filtro por nombre de personal */}
        <input 
          type="text"
          placeholder="Filter by Staff Name"
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>

      <div className="table-responsive mt-3">
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assigned Staff</th>
              <th>Staff ID</th>
              <th>Created At</th>   
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const assignedStaff = staff.find(member => member.id === task.staffId);
              return (
                <tr className="text-center" key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{assignedStaff ? `${assignedStaff.firstName} ${assignedStaff.lastName}` : 'Not Assigned'}</td>
                  <td>{task.staffId}</td>
                  <td>{task.createdAt}</td>
                  <td className="d-flex justify-content-center">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="link" onClick={() => {
                        setEditTask(task); 
                        setShowTaskForm(true);
                      }} title="Edit">
                        <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                      </Button>
                      <Button variant="link" onClick={() => {
                        setTaskToDelete(task);
                        setShowDeleteModal(true);
                      }} title="Delete">
                        <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
                      </Button>
                      {/* Icono para cambiar el estado a "Completed" */}
                      <Button variant="link" onClick={() => markTaskAsCompleted(task)} title="Mark as Completed">
                        <CIcon icon={cilCheck} style={{ fontSize: '1.5rem', color: 'green' }} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Tasks with status "Completed" */}
     {/* Tasks with status "Completed" */}
<h2>Completed Tasks</h2>
<div className="table-responsive mt-3">
  <Table striped bordered hover>
    <thead>
      <tr className="text-center">
        <th>ID</th>
        <th>Description</th>
        <th>Status</th>
        <th>Completed At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {completedTasks.map((task) => (
        <tr className="text-center" key={task.id}>
          <td>{task.id}</td>
          <td>{task.description}</td>
          <td>{task.status}</td>
          <td>{new Date(task.completedAt).toLocaleString()}</td>
          <td>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {/* Botón para editar la tarea */}
              <Button variant="link" onClick={() => {
                setEditTask(task); 
                setShowTaskForm(true);
              }} title="Edit">
                <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
              </Button>
              
              {/* Botón para eliminar la tarea */}
              <Button variant="link" onClick={() => {
                setTaskToDelete(task);
                setShowDeleteModal(true);
              }} title="Delete">
                <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

      {/* Task Form */}
      <TaskForm 
        show={showTaskForm}
        handleClose={handleCloseTaskForm}
        task={editTask} 
        handleSave={editTask ? updateTask : addTask}
        staff={staff}
      />

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete task <strong>{taskToDelete?.description}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteTask}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tasks;
