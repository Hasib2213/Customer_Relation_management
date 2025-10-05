import React from 'react';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '../slices/authSlice';
import '../CSS/Navbar.css';



function Navbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <BootstrapNavbar.Brand as={Link} to="/">CRM</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/contacts">Contacts</Nav.Link>
          <Nav.Link as={Link} to="/companies">Companies</Nav.Link>
          <Nav.Link as={Link} to="/opportunities">Opportunities</Nav.Link>
          <Nav.Link as={Link} to="/interactions">Interactions</Nav.Link>
          <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
          <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
          <Nav.Link onClick={handleLogout} as={Link} to="/login">LogIn</Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;