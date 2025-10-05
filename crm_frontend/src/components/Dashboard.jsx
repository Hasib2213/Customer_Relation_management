import React, { useState, useEffect } from 'react';
import { Card, Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const [data, setData] = useState({
    total_contacts: 0,
    total_leads: 0,
    total_clients: 0,
    leads_by_stage: [],
    open_opportunities_value: 0,
    recent_interactions: [],
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/dashboard/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setData(res.data));
  }, []);

  const chartData = {
    labels: data.leads_by_stage.map(item => item.stage),
    datasets: [{
      label: 'Leads by Stage',
      data: data.leads_by_stage.map(item => item.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Contacts</Card.Title>
              <Card.Text>{data.total_contacts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Leads</Card.Title>
              <Card.Text>{data.total_leads}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Clients</Card.Title>
              <Card.Text>{data.total_clients}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Open Opportunities Value</Card.Title>
              <Card.Text>${data.open_opportunities_value}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Leads by Pipeline Stage</Card.Title>
              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Recent Interactions</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_interactions.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.date).toLocaleString()}</td>
                      <td>{item.type}</td>
                      <td>{item.subject}</td>
                      <td>{item.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;