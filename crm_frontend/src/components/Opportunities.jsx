import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";
import axios from "axios";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null, // id null মানে new opportunity
    deal_name: "",
    contact: "",
    company: "",
    stage: "prospecting",
    deal_value: 0,
    expected_close_date: "",
    probability: 0,
    owner: "",
    next_action: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOpportunities();
    fetchDropdowns();
  }, []);

  const fetchOpportunities = () => {
    axios.get("http://127.0.0.1:8000/api/opportunities/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOpportunities(res.data))
      .catch(err => console.error(err));
  };

  const fetchDropdowns = () => {
    axios.get("http://127.0.0.1:8000/api/contacts/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setContacts(res.data));
    axios.get("/api/companies/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCompanies(res.data));
    axios.get("/api/users/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      deal_value: parseFloat(formData.deal_value),
      probability: parseInt(formData.probability),
      company: formData.company || null,
      owner: formData.owner || null,
    };

    if (formData.id) {
      // Update existing opportunity
      axios.put(`/api/opportunities/${formData.id}/`, payload, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setShowModal(false);
          resetForm();
          fetchOpportunities();
        })
        .catch(err => console.error("Error updating opportunity:", err));
    } else {
      // Create new opportunity
      axios.post("/api/opportunities/", payload, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setShowModal(false);
          resetForm();
          fetchOpportunities();
        })
        .catch(err => console.error("Error creating opportunity:", err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`/api/opportunities/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchOpportunities())
      .catch(err => console.error("Error deleting opportunity:", err));
  };

  const handleEdit = (opp) => {
    setFormData({
      id: opp.id,
      deal_name: opp.deal_name,
      contact: opp.contact,
      company: opp.company,
      stage: opp.stage,
      deal_value: opp.deal_value,
      expected_close_date: opp.expected_close_date || "",
      probability: opp.probability,
      owner: opp.owner,
      next_action: opp.next_action,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      deal_name: "",
      contact: "",
      company: "",
      stage: "prospecting",
      deal_value: 0,
      expected_close_date: "",
      probability: 0,
      owner: "",
      next_action: "",
    });
  };

  return (
    <Container className="mt-4">
      <h2>Opportunities</h2>
      <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>Add Opportunity</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contact</th>
            <th>Company</th>
            <th>Deal Name</th>
            <th>Stage</th>
            <th>Deal Value</th>
            <th>Close Date</th>
            <th>Probability</th>
            <th>Owner</th>
            <th>Next Action</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td>{opp.id}</td>
              <td>{opp.contact_detail || "-"}</td>
              <td>{opp.company_detail || "-"}</td>
              <td>{opp.deal_name}</td>
              <td>{opp.stage}</td>
              <td>${opp.deal_value}</td>
              <td>{opp.expected_close_date || "-"}</td>
              <td>{opp.probability}%</td>
              <td>{opp.owner_detail || "-"}</td>
              <td>{opp.next_action}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(opp)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(opp.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Opportunity" : "Add Opportunity"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Deal Name</Form.Label>
              <Form.Control type="text" value={formData.deal_name}
                onChange={e => setFormData({ ...formData, deal_name: e.target.value })}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Contact</Form.Label>
              <Form.Control as="select" value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}>
                <option value="">Select Contact</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control as="select" value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}>
                <option value="">Select Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Stage</Form.Label>
              <Form.Control as="select" value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value })}>
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Deal Value</Form.Label>
              <Form.Control type="number" value={formData.deal_value}
                onChange={e => setFormData({ ...formData, deal_value: parseFloat(e.target.value) })}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Expected Close Date</Form.Label>
              <Form.Control type="date" value={formData.expected_close_date}
                onChange={e => setFormData({ ...formData, expected_close_date: e.target.value })}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Probability</Form.Label>
              <Form.Control type="number" value={formData.probability}
                onChange={e => setFormData({ ...formData, probability: parseInt(e.target.value) })}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Owner</Form.Label>
              <Form.Control as="select" value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}>
                <option value="">Select Owner</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Next Action</Form.Label>
              <Form.Control type="text" value={formData.next_action}
                onChange={e => setFormData({ ...formData, next_action: e.target.value })}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Opportunities;
