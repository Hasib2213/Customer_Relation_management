import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Companies from './components/Companies';
import Opportunities from './components/Opportunities';
import Interactions from './components/Interactions';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <Container fluid>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/interactions" element={<Interactions />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;