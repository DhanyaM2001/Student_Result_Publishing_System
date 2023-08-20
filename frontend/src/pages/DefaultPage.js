import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function DefaultPage() {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'rgb(0,0,0)',
    background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,147,148,1) 50%, rgba(0,0,0,1) 100%)', // Gradient background
    color: '#fff', // White text color for contrast
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const headingStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle text shadow
  };

  const paragraphStyle = {
    fontSize: '1.5rem',
    marginBottom: '30px',
  };

  const logoStyle = {
    width: '200px',
    marginBottom: '40px',
  };

  const linkContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    fontSize: '1.8rem',
    color: '#fff', // White text color for visibility
    padding: '12px 32px',
    borderRadius: '5px',
    background: 'linear-gradient(135deg, rgba(0, 147, 148, 1), rgba(0, 0, 0, 1))', // Updated gradient background
    border: '2px solid rgba(0, 0, 0, 1)', // Updated border color
    transition: 'background-color 0.3s, color 0.3s',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };
  
  

  const linkHoverStyle = {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(0, 147, 148, 1))', // Slightly different gradient on hover
  };

  return (
    <div style={pageStyle}>
      <img src={logo} alt="Your Logo" style={logoStyle} />
      <h1 style={headingStyle}>Welcome to Result Portal</h1>
      <p style={paragraphStyle}>Choose your role:</p>
      <div style={linkContainerStyle}>
        <Link to="/AdminLogin" style={linkStyle}>Admin Login</Link>
        <Link to="/StudentLogin" style={linkStyle}>Student Login</Link>
      </div>
    </div>
  );
}

export default DefaultPage;
