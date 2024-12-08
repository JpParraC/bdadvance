import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash, cilPlus, cilZoom } from '@coreui/icons';
import '../../css/styles.css';

const PaymentTable = ({ payments }) => (
  <div>
    <h3 className="bl">Payments</h3>
    <table className="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date Invoice</th>
          <th>Amount</th>
          <th>Reservation ID</th>
          <th>Client ID</th>
          <th>Notes</th>
          <th>Time</th>
          <th>Payment Method</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>{payment.dateInvoice}</td>
            <td>{payment.amount}</td>
            <td>{payment.id_reservation}</td>
            <td>{payment.idClient}</td>
            <td>{payment.notes}</td>
            <td>{payment.time}</td>
            <td>{payment.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InvoiceTable = ({ invoices = [], onAddPayment, onViewDetails }) => (
  <div>
    <h3 className="bl">Invoices</h3>
    <table className="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Reservation ID</th>
          <th>Total Amount</th>
          <th>Date</th>
          <th>Payment IDs</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td>
            <td>{invoice.reservationId || 'N/A'}</td>
            <td>{invoice.totalAmount}</td>
            <td>{invoice.date}</td>
            <td>{invoice.paymentIds?.join(', ') || 'N/A'}</td>
            <td>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Button
                  variant="link"
                  title="Add Payment"
                  style={{ textDecoration: 'none', padding: '5px' }}
                  onClick={() => onAddPayment(invoice)}
                >
                  <CIcon icon={cilPlus} style={{ fontSize: '1.5rem', color: 'green' }} />
                </Button>
                <Button
                  variant="link"
                  title="View"
                  style={{ textDecoration: 'none', padding: '5px' }}
                  onClick={() => onViewDetails(invoice)}
                >
                  <CIcon icon={cilZoom} style={{ fontSize: '1.5rem', color: 'blue' }} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Invoice = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetailsModal, setInvoiceDetailsModal] = useState(false);
  const [isAddPaymentDisabled, setIsAddPaymentDisabled] = useState(false);

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const form = e.target;

    const reservationId = form.reservationId.value;
    const reservationExists = reservations.find((res) => res.id === reservationId);

    if (!reservationExists) {
      alert('Reservation does not exist!');
      return;
    }

    const roomDetails = reservationExists.rooms.map((room) => {
      const roomType = roomTypes.find((type) => type.id === room.roomType);
      return {
        roomType: roomType.name,
        price: roomType.price,
        nights: reservationExists.numberNights,
        total: roomType.price * reservationExists.numberNights,
      };
    });

    const totalAmount = roomDetails.reduce((sum, room) => sum + room.total, 0);

    const newInvoice = {
      id: `INV${Math.floor(Math.random() * 10000)}`,
      reservationId: reservationId,
      totalAmount: totalAmount,
      date: form.date.value,
      clientId: reservationExists.clientId || '',
      roomDetails: roomDetails,
      paymentIds: [],
    };

    axios.post('http://localhost:3001/invoices', newInvoice)
      .then((response) => {
        setInvoices((prevInvoices) => [...prevInvoices, response.data]);
        setShowInvoiceForm(false);
        setSelectedInvoice(response.data);
        setInvoiceDetailsModal(true);
        alert('Invoice created successfully!');
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
        alert('Failed to create invoice.');
      });
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    const form = e.target;

    const newPayment = {
      id: `PAY${Math.floor(Math.random() * 10000)}`,
      dateInvoice: form.date.value,
      amount: parseFloat(form.amount.value),
      id_reservation: selectedInvoice?.reservationId || '',
      idClient: selectedInvoice?.clientId || '',
      notes: form.notes.value,
      time: form.time.value,
      paymentMethod: form.paymentMethod.value,
    };

    axios.post('http://localhost:3001/payments', newPayment)
      .then(() => {
        setPayments((prevPayments) => [...prevPayments, newPayment]);

        // Actualizar la lista de pagos de la factura
        const updatedInvoice = {
          ...selectedInvoice,
          paymentIds: [...selectedInvoice.paymentIds, newPayment.id],
        };

        axios.put(`http://localhost:3001/invoices/${selectedInvoice.id}`, updatedInvoice)
          .then(() => {
            setInvoices((prevInvoices) =>
              prevInvoices.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
            );
            setSelectedInvoice(updatedInvoice);
            alert('Payment registered successfully!');
          })
          .catch((error) => console.error('Error updating invoice:', error));

        setShowPaymentForm(false);
      })
      .catch((error) => console.error('Error saving payment:', error));
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailsModal(true);  // Mostrar el modal de detalles de la factura
    setIsAddPaymentDisabled(true);
  };

  const calculateRemainingAmount = () => {
    const paymentsMade = payments.filter((payment) =>
      selectedInvoice?.paymentIds.includes(payment.id)
    );
    const totalPayments = paymentsMade.reduce((sum, payment) => sum + payment.amount, 0);
    return selectedInvoice?.totalAmount - totalPayments;  // Calcular la deuda restante
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentResponse = await axios.get('http://localhost:3001/payments');
        const invoiceResponse = await axios.get('http://localhost:3001/invoices');
        const reservationResponse = await axios.get('http://localhost:3001/reservations');
        const clientResponse = await axios.get('http://localhost:3001/clients');
        const roomTypeResponse = await axios.get('http://localhost:3001/room_types');
        setPayments(paymentResponse.data || []);
        setInvoices(invoiceResponse.data || []);
        setReservations(reservationResponse.data || []);
        setClients(clientResponse.data || []);
        setRoomTypes(roomTypeResponse.data || []);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getClientDetails = (clientId) => clients.find((client) => client.id === clientId);

  return (
    <div>
      <Button className='button-blue mb-4' onClick={() => setShowInvoiceForm(true)}>Add Invoice</Button>
      <InvoiceTable
        invoices={invoices}
        onAddPayment={(invoice) => {
          setSelectedInvoice(invoice);
          setShowPaymentForm(true);
        }}
        onViewDetails={handleViewDetails}
      />
      <PaymentTable payments={payments} />

      {/* Modal for Invoice Details */}
      <Modal show={invoiceDetailsModal} onHide={() => {
        setInvoiceDetailsModal(false);
        setIsAddPaymentDisabled(false);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice && (
            <div>
              <h5>Invoice ID: {selectedInvoice.id}</h5>
              <p>Reservation ID: {selectedInvoice.reservationId}</p>
              <p>Total Amount: {selectedInvoice.totalAmount}</p>
              <p>Remaining Amount: {calculateRemainingAmount()}</p> {/* Mostrar el saldo pendiente */}
              <p>Date: {selectedInvoice.date}</p>
              <h6>Room Details:</h6>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Room Type</th>
                    <th>Price per Night</th>
                    <th>Number of Nights</th>
                    <th>Total for Room</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.roomDetails.map((room, index) => (
                    <tr key={index}>
                      <td>{room.roomType}</td>
                      <td>{room.price}</td>
                      <td>{room.nights}</td>
                      <td>{room.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h6>Payments:</h6>
              <ul>
                {selectedInvoice.paymentIds?.map((id) => {
                  const payment = payments.find((pay) => pay.id === id);
                  return payment ? (
                    <li key={id}>
                      Amount: {payment.amount}, Date: {payment.dateInvoice}, Method: {payment.paymentMethod}
                    </li>
                  ) : (
                    <li key={id}>Payment not found.</li>
                  );
                })}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setInvoiceDetailsModal(false);
            setIsAddPaymentDisabled(false);
          }}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding Invoice */}
      <Modal show={showInvoiceForm} onHide={() => setShowInvoiceForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveInvoice}>
            <Form.Group className="mb-3">
              <Form.Label>Reservation ID</Form.Label>
              <Form.Control type="text" name="reservationId" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required />
            </Form.Group>
            <Button variant="primary" type="submit">Save Invoice</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Adding Payment */}
      <Modal show={showPaymentForm} onHide={() => setShowPaymentForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePayment}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" step="0.01" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control type="text" name="notes" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" name="time" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control as="select" name="paymentMethod" required>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isAddPaymentDisabled}>Save Payment</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invoice;
