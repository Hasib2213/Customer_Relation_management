import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { setToken } from '../slices/authSlice';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/token/', credentials);
      dispatch(setToken(res.data.access));
      navigate('/'); // redirect to dashboard
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login failed:', error);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Login to CRM</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Login</Button>
      </Form>
    </Container>
  );
}

export default Login;
