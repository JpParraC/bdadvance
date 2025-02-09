import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow, CProgress, CProgressBar, CButton, CCollapse } from '@coreui/react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import '../../css/styles.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0)
  const [totalRooms, setTotalRooms] = useState(0)
  const [totalReservations, setTotalReservations] = useState(0)
  const [totalStaff, setTotalStaff] = useState(0)
  const [reservations, setReservations] = useState([])
  const [tasks, setTasks] = useState([])
  const [reservationData, setReservationData] = useState({})
  const [completedTasks, setCompletedTasks] = useState(0)
  const [pendingTasks, setPendingTasks] = useState(0)
  const [auditLogs, setAuditLogs] = useState([])
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then((response) => {
        setTotalClients(response.data.totalClients)
        setTotalRooms(response.data.totalRooms)
        setTotalReservations(response.data.totalReservations)
        setTotalStaff(response.data.totalStaff)
      })
      .catch((error) => console.error('Error fetching dashboard data:', error))

    axios.get('http://localhost:5000/api/reservations')
      .then((response) => {
        setReservations(response.data)
        processReservations(response.data)
      })
      .catch((error) => console.error('Error fetching reservations data:', error))

    axios.get('http://localhost:5000/api/rooms')
      .then((response) => setRooms(response.data))
      .catch((error) => console.error('Error fetching rooms data:', error))

    axios.get('http://localhost:5000/api/staff')
      .then((response) => setStaff(response.data))
      .catch((error) => console.error('Error fetching staff data:', error))

    axios.get('http://localhost:5000/api/audit')
      .then((response) => setAuditLogs(response.data))
      .catch((error) => console.error('Error fetching audit data:', error))

    axios.get('http://localhost:3001/tasks')
      .then((response) => processTasks(response.data))
      .catch((error) => console.error('Error fetching tasks data:', error))
  }, [])

  const processReservations = (reservations) => {
    const dateCounts = {}

    reservations.forEach((reservation) => {
      const date = reservation.date_reserve
      dateCounts[date] = (dateCounts[date] || 0) + 1
    })

    const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b))

    const sortedData = {}
    sortedDates.forEach((date) => {
      sortedData[date] = dateCounts[date]
    })

    setReservationData(sortedData)
  }

  const processTasks = (tasks) => {
    const completed = tasks.filter((task) => task.status.toLowerCase() === 'completed').length
    const pending = tasks.filter((task) => task.status.toLowerCase() === 'pending').length
    setTasks(tasks)
    setCompletedTasks(completed)
    setPendingTasks(pending)
  }

  const chartData = {
    labels: Object.keys(reservationData).map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: 'Reservations',
        data: Object.values(reservationData),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
          autoSkip: true,
          maxRotation: 45,
          minRotation: 30,
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

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <>
      <CRow>
        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-primary shadow-lg">
            <CCardHeader className="text-center"><h4>Total Clients per Month</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{totalClients}</div>
            </CCardBody>
            <CCardFooter className="text-center">Registered Customers</CCardFooter>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-success shadow-lg">
            <CCardHeader className="text-center"><h4>Total Rooms</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{totalRooms}</div>
            </CCardBody>
            <CCardFooter className="text-center">Available Rooms</CCardFooter>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-danger shadow-lg">
            <CCardHeader className="text-center"><h4>Total Reservations <br /> per Month</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{totalReservations}</div>
            </CCardBody>
            <CCardFooter className="text-center">Total Bookings</CCardFooter>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} xl={3}>
          <CCard className="mb-4 text-white bg-warning shadow-lg">
            <CCardHeader className="text-center"><h4>Total Staff</h4></CCardHeader>
            <CCardBody>
              <div className="fs-3 fw-semibold text-center">{totalStaff}</div>
            </CCardBody>
            <CCardFooter className="text-center">Staff Members</CCardFooter>
          </CCard>
        </CCol>
      </CRow>

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

      {/* Audit Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="text-center bg-primary text-white"><h4>AUDIT LOG</h4></CCardHeader>
            <CCardBody>
              <div className="table-responsive mt-3">
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Table Name</th>
                      <th>Action</th>
                      <th>Timestamp</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.table_name}</td>
                        <td>{log.action}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td className='text-center'>
                          <CButton color="success"  onClick={() => handleRowClick(log.id)}>
                            {expandedRow  === log.id ? 'Hide Details' : 'Show Details'}
                          </CButton>
                          <CCollapse visible={expandedRow === log.id}>
                            <div className="mt-2 text-start">
                              <h6>Old Data</h6>
                              <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
                              <h6>New Data</h6>
                              <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
                            </div>
                          </CCollapse>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
