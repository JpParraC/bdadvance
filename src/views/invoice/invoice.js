import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash, cilPlus } from '@coreui/icons';

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

const InvoiceTable = ({ invoices, onAddPayment }) => (
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
            <td>{invoice.paymentIds.join(', ')}</td>
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
                <Button variant="link" title="Edit" style={{ textDecoration: 'none', padding: '5px' }}>
                  <CIcon icon={cilPen} style={{ fontSize: '1.5rem', color: 'orange' }} />
                </Button>
                <Button variant="link" title="Delete" style={{ textDecoration: 'none', padding: '5px' }}>
                  <CIcon icon={cilTrash} style={{ fontSize: '1.5rem', color: 'red' }} />
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
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSavePayment = (e) => {
    e.preventDefault();
    const form = e.target;

    const newPayment = {
      id: `PAY${Math.floor(Math.random() * 10000)}`, // Genera un ID único para el pago
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
        setPayments((prevPayments) => [...prevPayments, newPayment]); // Actualiza el estado con el nuevo pago
        setShowPaymentForm(false);
        alert('Payment registered successfully!');
      })
      .catch((error) => console.error("Error saving payment:", error));
  };

  const handleAddPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentResponse = await axios.get('http://localhost:3001/payments');
        const invoiceResponse = await axios.get('http://localhost:3001/invoices');
        setPayments(paymentResponse.data);
        setInvoices(invoiceResponse.data);
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

  return (
    <div>
      <InvoiceTable invoices={invoices} onAddPayment={handleAddPayment} />
      <PaymentTable payments={payments} />

      {/* Modal para agregar nuevo pago */}
      <Modal show={showPaymentForm} onHide={() => setShowPaymentForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePayment}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control type="text" name="notes" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" name="time" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select name="paymentMethod" required>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">Save Payment</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invoice;
