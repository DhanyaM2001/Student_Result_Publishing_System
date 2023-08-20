import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { styled } from '@mui/system'; // Import the styled function from @mui/system
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/login.png'; // Import the background image
import logoImage from '../assets/logo.png'; // Import the logo image

// Create a custom styled TextField component
const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#ffffff', // White background color
    borderColor: '#0CA686', // Border color
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

      // Handle successful login
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Navigate to the sidebar component or perform any other actions
      navigate('/home'); // Replace '/sidebar' with the actual route path of your sidebar component
    } catch (error) {
      console.error(error);
      setError('Invalid credentials');
      setSnackbarMessage('Invalid credentials');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              flex: '0 0 58%', // Set the width of the image container
              position: 'relative',
              left: '-200px',
              marginRight: '100px',
              marginLeft: '30px',
              justifyContent: 'flex-start',
              alignSelf: 'flex-start',
            }}
          >
            <img
              src={backgroundImage} // Replace with the actual login image path
              alt="" // Update the alt attribute
              style={{
                width: '120%',
                height: '100%',
                objectFit: 'cover',
                position: 'relative',
                top: 0,
                left: '0px',
              }}
            />
          </Box>
          <Box
            sx={{
              marginRight: '50px',
              backgroundColor: '#f9f9f9', // Different shade of white
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Add box shadow
              padding: '30px',
              borderRadius: '8px',
              flex: '0 0 60%',
              height: '480px', // Increased height to make the form visible
            }}
          >
            <img
              src={logoImage} // Replace with the actual logo image path
              alt="Logo"
              style={{ width: '70px', marginBottom: '20px' }} // Adjust the image size and margin
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Box component="form" onSubmit={handleLogin}>
              <CustomTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <AccountCircle sx={{ color: 'gray', marginRight: '10px' }} />
                  ),
                }}
              />
              <CustomTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Lock sx={{ color: 'gray', marginRight: '10px' }} />
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  marginTop: '20px',
                  backgroundColor: '#0CA686',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: '#0CA686', // Change background color on hover
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
};

export default Login;
