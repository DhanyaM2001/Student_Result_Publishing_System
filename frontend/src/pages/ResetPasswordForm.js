import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Retrieve the email from the URL (assuming it's passed as a query parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');

    if (userEmail) {
      setEmail(userEmail);
    } else {
      setMessage('Email not found.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const data = {
        email: email,
        newPassword,
      };

      const response = await axios.put('http://localhost:3001/reset-password/', data);
      console.log('Password updated:', response.data);

      setMessage('Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password. Please try again later.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        maxWidth: '300px',
        margin: '0 auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Reset Password
      </Typography>
      <TextField
        type="password"
        label="New Password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        type="password"
        label="Re-enter Password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Reset Password
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

export default ResetPasswordForm;
