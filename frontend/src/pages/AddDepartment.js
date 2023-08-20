import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, withStyles } from '@material-ui/core';
import { keyframes } from '@emotion/react';
import axios from 'axios';

const AddDepartment = () => {
  const [dname, setDepartmentName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform the submission logic here
    console.log('Submitted:', dname);
  
    // Make an HTTP POST request to your backend server
    axios.post('http://localhost:3001/departments', { dname })
      .then((response) => {
        console.log('Department added successfully:', response.data);
        setDepartmentName('');
        setSuccessMessage('Department inserted successfully.');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Hide the success message after 3 seconds (3000 milliseconds)
      })
      .catch((error) => {
        console.error('Error adding department:', error);
        setSuccessMessage('');
        setErrorMessage('Error adding department. Please try again.');
      });
  };

  const handleReset = () => {
    setDepartmentName('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const GreenButton = withStyles((theme) => ({
    root: {
      backgroundColor: '#4CAF50',
      '&:hover': {
        backgroundColor: '#45A049',
      },
    },
  }))(Button);

  const YellowButton = withStyles((theme) => ({
    root: {
      backgroundColor: '#FFEB3B',
      '&:hover': {
        backgroundColor: '#FDD835',
      },
    },
  }))(Button);

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#004646">
      <Container maxWidth="sm" style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', marginTop: '50px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
        {/* Success message */}
        {successMessage && (
          <Typography variant="subtitle1" style={{ color: 'green', textAlign: 'center', marginBottom: '16px', animation: `${fadeIn} 1s ease-in` }}>
            {successMessage}
          </Typography>
        )}

        {/* Error message */}
        {errorMessage && (
          <Typography variant="subtitle1" style={{ color: 'red', textAlign: 'center', marginBottom: '16px', animation: `${fadeIn} 1s ease-in` }}>
            {errorMessage}
          </Typography>
        )}

        <Typography variant="h5" style={{ fontSize: '30px', marginBottom: '16px', color: '#0CA686', textAlign: 'center', animation: `${fadeIn} 1s ease-in` }}>
          Add Department
        </Typography>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px', animation: `${fadeIn} 1s ease-in` }}>
            <Typography variant="subtitle1" style={{ color: '#004646' }}>Department Name</Typography>
            <TextField
              value={dname}
              onChange={(event) => setDepartmentName(event.target.value)}
              variant="outlined"
              fullWidth
            />
          </div>
          <Box display="flex" justifyContent="center" alignItems="center">
            <GreenButton
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              style={{ marginRight: '8px', animation: `${fadeIn} 1s ease-in` }}
            >
              Submit
            </GreenButton>
            <YellowButton
              type="button"
              variant="contained"
              color="secondary"
              disableElevation
              onClick={handleReset}
              style={{ animation: `${fadeIn} 1s ease-in` }}
            >
              Reset
            </YellowButton>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AddDepartment;
