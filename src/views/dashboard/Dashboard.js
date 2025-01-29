import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow, CProgress, CProgressBar } from '@coreui/react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const Dashboard = () => {
  const [clients, setClients] = useState([])
  const [rooms, setRooms] = useState([])
  const [reservations, setReservations] = useState([])
  const [staff, setStaff] = useState([])
  const [tasks, setTasks] = useState([])
  const [reservationData, setReservationData] = useState({})
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pendingTasks, setPendingTasks] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Error fetching clients data:', error))

    axios.get('http://localhost:5000/api/rooms')
      .then((response) => setRooms(response.data))
      .catch((error) => console.error('Error fetching rooms data:', error))

    axios.get('http://localhost:5000/api/reservations')
      .then((response) => {
        setReservations(response.data)
        processReservations(response.data)
      })
      .catch((error) => console.error('Error fetching reservations data:', error))

    axios.get('http://localhost:5000/api/staff')
      .then((response) => setStaff(response.data))
      .catch((error) => console.error('Error fetching staff data:', error))

    axios.get('http://localhost:3001/tasks')
      .then((response) => processTasks(response.data))
      .catch((error) => console.error('Error fetching tasks data:', error))
  }, [])

  // Procesar las reservas para contar por fecha
  const processReservations = (reservations) => {
  const dateCounts = {}

  reservations.forEach((reservation) => {
    const date = reservation.date_reserve
    dateCounts[date] = (dateCounts[date] || 0) + 1
  })

  // Ordenar las fechas
  const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b))

  // Crear un nuevo objeto con las fechas ordenadas
  const sortedData = {}
  sortedDates.forEach((date) => {
    sortedData[date] = dateCounts[date]
  })

  setReservationData(sortedData)
}

  // Procesar tareas para contar completadas y pendientes
  const processTasks = (tasks) => {
    const completed = tasks.filter((task) => task.status.toLowerCase() === 'completed').length
    const pending = tasks.filter((task) => task.status.toLowerCase() === 'pending').length
    setTasks(tasks)
    setCompletedTasks(completed)
    setPendingTasks(pending)
  }

  // Datos del gráfico de reservas
  const chartData = {
    labels: Object.keys(reservationData).map((date) => new Date(date).toLocaleDateString()), // Formateo de fecha legible
    datasets: [
      {
        label: 'Reservations',
        data: Object.values(reservationData),
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color de fondo para las barras
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las barras
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        ticks: {
          autoSkip: true, // Para evitar que las etiquetas de fechas se amontonen
          maxRotation: 45, // Rotar las etiquetas si es necesario
          minRotation: 30, // Mantener la rotación mínima para mayor legibilidad
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Reservations' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // Formatear la fecha en el tooltip
          label: function (tooltipItem) {
            return `Reservations: ${tooltipItem.raw}`;
          },
        },
      },
    },
  }

  const totalTasks = completedTasks + pendingTasks
  const completedPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  const pendingPercentage = totalTasks ? Math.round((pendingTasks / totalTasks) * 100) : 0

  return (
    <>
      <CRow>
        {/* Total Clients */}
        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-primary shadow-lg">
            <CCardHeader className="text-center"><h4>Total Clients</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{clients.length}</div>
            </CCardBody>
            <CCardFooter className="text-center">Registered Customers</CCardFooter>
          </CCard>
        </CCol>

        {/* Total Rooms */}
        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-success shadow-lg">
            <CCardHeader className="text-center"><h4>Total Rooms</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{rooms.length}</div>
            </CCardBody>
            <CCardFooter className="text-center">Available Rooms</CCardFooter>
          </CCard>
        </CCol>

        {/* Total Reservations */}
        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-danger shadow-lg">
            <CCardHeader className="text-center"><h4>Total Reservations</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{reservations.length}</div>
            </CCardBody>
            <CCardFooter className="text-center">Total Bookings</CCardFooter>
          </CCard>
        </CCol>

        {/* Total Staff */}
        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-warning shadow-lg">
            <CCardHeader className="text-center"><h4>Total Staff</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{staff.length}</div>
            </CCardBody>
            <CCardFooter className="text-center">Staff Members</CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      {/* Progress Bars for Task Completion */}
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader className="text-center"><h4>Task Progress</h4></CCardHeader>
            <CCardBody>
              <h6>Completed Tasks ({completedTasks})</h6>
              <CProgress className="mb-3">
                <CProgressBar value={completedPercentage} color="success">
                  {completedPercentage}%
                </CProgressBar>
              </CProgress>

              <h6>Pending Tasks ({pendingTasks})</h6>
              <CProgress>
                <CProgressBar value={pendingPercentage} color="warning">
                  {pendingPercentage}%
                </CProgressBar>
              </CProgress>
            </CCardBody>
            <CCardFooter className="text-center">Total Tasks: {totalTasks}</CCardFooter>
          </CCard>
        </CCol>

        {/* Reservations by Date Chart */}
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader className="text-center"><h4>Reservations by Date</h4></CCardHeader>
            <CCardBody>
              <Bar data={chartData} options={chartOptions} />
            </CCardBody>
            <CCardFooter className="text-center">Reservations per day for the month</CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
