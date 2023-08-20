import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 40px 0;
  background-color: #f9f9f9;
`;

const CardContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const FormContainer = styled.div`
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background-color: #eaeaea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      const data = {
        email,
      };

      // Update the URL to match your server's endpoint
      const response = await axios.post('http://localhost:3001/ForgotPassword', data);

      console.log('Password reset request:', response.data);
      // Assuming the server responds with a message about the email being sent
      setMessage('A password reset link has been sent to your email address.');
    } catch (error) {
      console.error('Error sending password reset link:', error);
      setMessage('Email not registered. Please enter a valid email address.');
    }
  };

  return (
    <PageContainer>
      <CardContainer>
        <FormContainer>
          <FormTitle>FORGOT PASSWORD</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <Button type="submit">Reset Password</Button>
          </Form>
          {message && <p>{message}</p>}
        </FormContainer>
      </CardContainer>
    </PageContainer>
  );
};

export default ForgotPassword;
