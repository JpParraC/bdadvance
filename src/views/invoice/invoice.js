import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import { cilPen, cilTrash, cilPlus, cilZoom } from '@coreui/icons';
import moment from 'moment'; // Importa moment.js
import '../../css/styles.css';


const Invoice = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetailsModal, setInvoiceDetailsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentResponse = await axios.get('http://localhost:5000/api/payments/');
        const invoiceResponse = await axios.get('http://localhost:5000/api/invoices/');
        setPayments(paymentResponse.data || []);
        setInvoices(invoiceResponse.data || []);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvoiceStatusUpdate = async (invoiceId, pendingAmount) => {
    if (pendingAmount === 0) {
      try {
        // Actualizar estado al backend
        await axios.patch(`http://localhost:5000/api/invoices/${invoiceId}`, {
          status: 0, // Factura marcada como pagada
        });

        // Actualizar la factura en el estado local
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: 0 } : invoice
        );
        setInvoices(updatedInvoices); // Actualiza el estado local
      } catch (error) {
        console.error('Error updating invoice status:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Button className="button-blue mb-4" onClick={() => setShowInvoiceForm(true)}>
        Add Invoice
      </Button>

      <div className="mb-4">
        <InvoiceTable
          invoices={invoices}
          onAddPayment={(invoice) => {
            setSelectedInvoice(invoice);
            setShowPaymentForm(true);
          }}
          onViewDetails={(invoice) => {
            setSelectedInvoice(invoice);
            setInvoiceDetailsModal(true);
          }}
        />
      </div>

      <div className="mb-4">
        <PaymentTable payments={payments} />
      </div>

      {/* Modals */}
      <InvoiceFormModal
        show={showInvoiceForm}
        handleClose={() => setShowInvoiceForm(false)}
      />
      <PaymentFormModal
        show={showPaymentForm}
        handleClose={() => setShowPaymentForm(false)}
        selectedInvoice={selectedInvoice}
      />
      <InvoiceDetailsModal
        show={invoiceDetailsModal}
        handleClose={() => setInvoiceDetailsModal(false)}
        invoice={selectedInvoice}
        payments={payments}
        onStatusUpdate={handleInvoiceStatusUpdate}
      />
    </div>
  );
};

const PaymentTable = ({ payments }) => (
  <div>
    <h3>Payments</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Invoice</th>
          <th>Amount</th>
          <th>Notes</th>
          <th>Time</th>
          <th>Payment Method</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>{payment.invoice_id}</td>
            <td>{payment.mount}</td>
            <td>{payment.notes}</td>
            <td>{moment(payment.time).format('YYYY-MM-DD HH:mm:ss')}</td> {/* Formato de fecha */}
            <td>{payment.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

const InvoiceTable = ({ invoices, onAddPayment, onViewDetails }) => (
  <div>
    <h3>Invoices</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Reservation ID</th>
          <th>Total Amount</th>
          <th>Pending Amount</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td>
            <td>{invoice.reservation_id || 'N/A'}</td>
            <td>{invoice.total_amount}</td>
            <td>{invoice.mount_pending}</td>
            <td>{invoice.status === 0 ? 'Paid' : 'Pending'}</td>
            <td>{moment(invoice.date_invoice).format('YYYY-MM-DD')}</td> {/* Formato de fecha */}
            <td>
              <Button variant="link" onClick={() => onAddPayment(invoice)}>
                <CIcon icon={cilPlus} style={{ color: 'green' }} />
              </Button>
              <Button variant="link" onClick={() => onViewDetails(invoice)}>
                <CIcon icon={cilZoom} style={{ color: 'blue' }} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

const InvoiceFormModal = ({ show, handleClose }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reservationId = e.target.reservationId.value;
    const date = e.target.date.value;

    try {
      await axios.post('http://localhost:5000/api/invoices/', {
        reservation_id: reservationId,
        date_invoice: date,
        total_amount: 0, // O agregar el monto total si lo tienes
        mount_pending: 0, // Lo mismo para el monto pendiente
        status: 1, // Estatus inicial de la factura (pendiente)
      });

      // Refrescar la lista de facturas o cerrar el modal
      handleClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Reservation ID</Form.Label>
            <Form.Control type="text" name="reservationId" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Invoice
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const PaymentFormModal = ({ show, handleClose, selectedInvoice }) => {
  const [formData, setFormData] = useState({
    mount: '',
    notes: '',
    id_payment_method: '1', // Valor predeterminado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      notes: formData.notes,
      id_payment_method: formData.id_payment_method,
      invoice_id: selectedInvoice.id,
      mount: parseFloat(formData.mount),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/payments/', paymentData);
      if (response.data) {
        handleClose();
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="mount"
              step="0.01"
              value={formData.mount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Control
              as="select"
              name="id_payment_method"
              value={formData.id_payment_method}
              onChange={handleChange}
              required
            >
              <option value="1">Credit Card</option>
              <option value="2">Cash</option>
              <option value="3">Transfer</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Payment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const InvoiceDetailsModal = ({ show, handleClose, invoice, payments, onStatusUpdate }) => {
  const handleMarkAsPaid = () => {
    if (invoice.mount_pending === 0) {
      onStatusUpdate(invoice.id, invoice.mount_pending);
      handleClose(); // Cierra el modal después de marcar como pagado
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {invoice && (
          <div>
            <h5>Invoice ID: {invoice.id}</h5>
            <p>Reservation ID: {invoice.reservation_id || 'N/A'}</p>
            <p>Total Amount: {invoice.total_amount}</p>
            <p>Pending Amount: {invoice.mount_pending}</p>
            <p>Date: {moment(invoice.date_invoice).format('YYYY-MM-DD')}</p> {/* Formato de fecha */}
            <h6>Status: {invoice.status === 0 ? 'Paid' : 'Pending'}</h6>
            <h6>Payments:</h6>
            <ul>
              {payments
                .filter((payment) => payment.invoice_id === invoice.id)
                .map((payment) => (
                  <li key={payment.id}>
                    Payment ID: {payment.id}, Amount: {payment.mount}, Date: {moment(payment.time).format('YYYY-MM-DD HH:mm:ss')}, Method: {payment.paymentMethod}
                  </li>
                ))}
            </ul>
            {invoice.mount_pending === 0 && invoice.status !== 0 && (
              <Button variant="success" onClick={handleMarkAsPaid}>
                Mark as Paid
              </Button>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Invoice;
