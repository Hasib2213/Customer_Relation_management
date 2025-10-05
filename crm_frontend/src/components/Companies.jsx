import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size_revenue: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    axios.get('/api/companies/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setCompanies(res.data));
  };

  const handleShowModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({ name: "", industry: "", size_revenue: "", address: "", notes: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = () => {
    if (editingCompany) {
      // Update company
      axios.put(`/api/companies/${editingCompany.id}/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(() => {
        fetchCompanies();
        handleCloseModal();
      });
    } else {
      // Add new company
      axios.post(`/api/companies/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(() => {
        fetchCompanies();
        handleCloseModal();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      axios.delete(`/api/companies/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(() => fetchCompanies());
    }
  };

  return (
    <Container className="mt-4">
      <h2>Companies</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Industry</th>
            <th>Size/Revenue</th>
            <th>Primary Contact</th>
            <th>Address</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.industry}</td>
              <td>{company.size_revenue}</td>
              <td>{company.primary_contact?.full_name || '-'}</td>
              <td>{company.address}</td>
              <td>{company.notes}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(company)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(company.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={() => handleShowModal()}>Add Company</Button>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCompany ? "Edit Company" : "Add Company"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Industry</Form.Label>
              <Form.Control name="industry" value={formData.industry} onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Size/Revenue</Form.Label>
              <Form.Control name="size_revenue" value={formData.size_revenue} onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" name="notes" value={formData.notes} onChange={handleChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingCompany ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Companies;
