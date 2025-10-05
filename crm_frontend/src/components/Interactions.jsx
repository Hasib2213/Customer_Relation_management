import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";
import axios from "axios";

function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    contact: "",
    company: "",
    type: "call",
    subject: "",
    summary: "",
    next_steps: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInteractions();
    fetchDropdowns();
  }, []);

  const fetchInteractions = () => {
    axios
      .get("/api/interactions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInteractions(res.data))
      .catch((err) => console.error("Error fetching interactions:", err));
  };

  const fetchDropdowns = () => {
    axios
      .get("/api/contacts/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setContacts(res.data));
    axios
      .get("/api/companies/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCompanies(res.data));
  };

  const handleSave = () => {
    const payload = {
      contact: formData.contact,
      company: formData.company || null,
      type: formData.type,
      subject: formData.subject,
      summary: formData.summary,
      next_steps: formData.next_steps,
    };

    if (formData.id) {
      // Update
      axios
        .put(`/api/interactions/${formData.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setShowModal(false);
          resetForm();
          fetchInteractions();
        })
        .catch((err) => console.error("Error updating interaction:", err));
    } else {
      // Create
      axios
        .post("/api/interactions/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setShowModal(false);
          resetForm();
          fetchInteractions();
        })
        .catch((err) => console.error("Error creating interaction:", err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/interactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchInteractions())
      .catch((err) => console.error("Error deleting interaction:", err));
  };

  const handleEdit = (inter) => {
    setFormData({
      id: inter.id,
      contact: inter.contact,
      company: inter.company,
      type: inter.type,
      subject: inter.subject,
      summary: inter.summary,
      next_steps: inter.next_steps,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      contact: "",
      company: "",
      type: "call",
      subject: "",
      summary: "",
      next_steps: "",
    });
  };

  return (
    <Container className="mt-4">
      <h2>Interactions</h2>
      <Button
        variant="primary"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        Add Interaction
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Contact</th>
            <th>Company</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Summary</th>
            <th>Next Steps</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((inter) => (
            <tr key={inter.id}>
              <td>{new Date(inter.date).toLocaleString()}</td>
              <td>{inter.contact_detail || "-"}</td>
              <td>{inter.company_detail || "-"}</td>
              <td>{inter.type}</td>
              <td>{inter.subject}</td>
              <td>{inter.summary}</td>
              <td>{inter.next_steps}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(inter)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(inter.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Edit Interaction" : "Add Interaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Contact</Form.Label>
              <Form.Control
                as="select"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              >
                <option value="">Select Contact</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control
                as="select"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Next Steps</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.next_steps}
                onChange={(e) =>
                  setFormData({ ...formData, next_steps: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Interactions;
