import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import loginImage from '../assets/sign-in.png'; // Import the sign-in image
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

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
  margin-top: 40px;
`;
const FormTitleLogo = styled.img`
align-items: center;
width: 50px; /* Adjust the size of the logo in the title */
height: 50px;
margin-left: 135px; /* Adjust the margin between the logo and title text */
`;

const ImageContainer = styled.img`
  flex-basis: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 120%;
  height: 120%;

  @media (max-width: 500px) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 0;
    height: 300px;
  }
`;

const FormContainer = styled.div`
  flex-basis: 50%;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const LoginFormLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #555;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const data = {
        email,
        password,
      };
      console.log(data);
      const response = await axios.post('http://localhost:3001/StudentLogin', data);
      console.log('Logged in:', response.data);

      setMessage('Login successful.');
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/StudentDashboard');

      // Reset the form fields
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <PageContainer>
      <CardContainer>
        <ImageContainer src={loginImage} alt="Sign In" />
        <FormContainer>
        <FormTitleLogo src={logo} alt="Logo" />

          <FormTitle>LOGIN FORM</FormTitle>
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
            <FormGroup>
              <Label htmlFor="password">Password:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button type="submit">Login</Button>
          </Form>
          
          {message && <p>{message}</p>}
          <LoginFormLink to="/StudentRegister">Not registered? Sign up</LoginFormLink>
          <LoginFormLink to="/ForgotPassword">Forgot Password?</LoginFormLink> {/* Add this line */}
        </FormContainer>
      </CardContainer>
    </PageContainer>
  );
};

export default StudentLogin;
