import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import signUpImage from '../assets/sign-up.png';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 40px 0; /* Adjust top and bottom padding */
  background-color: #f9f9f9; /* Add background color */
`;

const CardContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 60px;
  margin-top: 40px; /* Reduce top margin */
`;

const FormContainer = styled.div`
  flex-basis: 60%;
  padding-right: 70px;
`;

const ImageContainer = styled.img`
  flex-basis: 40%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 60%; /* Set the width to 100% */
  height: 60%; /* Automatically adjust the height */

  @media (max-width: 500px) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 0;
    height: 300px;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  margin-left: 55px;

  color: #333;
  display: flex;
  align-items: center;
  text-size: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const FormTitleLogo = styled.img`
  align-items: center;
  width: 50px; /* Adjust the size of the logo in the title */
  height: 50px;
  margin-left: 135px; /* Adjust the margin between the logo and title text */
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

const PasswordStrengthIndicator = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: ${(props) => props.color};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
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

// const DepartmentSelect = styled.select`
//   width: 100%;
//   padding: 16px;
//   border: none;
//   border-radius: 5px;
//   background-color: #f5f5f5;
//   color: #333;
//   font-size: 16px;
//   transition: background-color 0.3s ease;
//   appearance: none; /* Remove default arrow */

//   &:focus {
//     outline: none;
//     background-color: #eaeaea;
//   }
// `;
const StudentRegister = () => {
  const [usn, setUsn] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dname, setDepartment] = useState(''); // New state for department
  const [departments, setDepartments] = useState([]); // List of department names
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // New state for password focus

  // Fetch department names from the backend API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments');
      setDepartments(response.data.map((department) => department.dname));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const getPasswordStrength = () => {
    if (password.length < 6) {
      return {
        strength: 'Weak',
        color: 'red',
      };
    } else if (password.length < 8) {
      return {
        strength: 'Average',
        color: 'orange',
      };
    } else {
      return {
        strength: 'Strong',
        color: 'green',
      };
    }
  };

  const isEmailValid = () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@rvce\.edu\.in$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Basic validation
      if (!usn || !name || !email || !password || !dname) {
        alert('Please fill in all fields.');
        return;
      }

      // Email validation
      if (!isEmailValid()) {
        alert('Please enter a valid RVCE email address.');
        return;
      }

      const data = {
        usn,
        name,
        email,
        password,
        dname, // Include the selected department in the form data
      };

      const response = await axios.post('http://localhost:3001/StudentRegister', data);

      if (response.status === 200) {
        alert(response.data.message); // Success message
      }

      // Reset the form fields
      setUsn('');
      setName('');
      setEmail('');
      setPassword('');
      setDepartment('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Student already exists'); // Student already exists message
      } else {
        console.error('Error submitting form:', error);
        alert('An error occurred while registering. Please try again later.'); // Other error message
      }
    }
  };

  const passwordStrength = getPasswordStrength();
  const isPasswordValid = isPasswordFocused && password.length > 0;

  return (
    <PageContainer>
      <CardContainer>
        <FormContainer>
          <FormTitleLogo src={logo} alt="Logo" />
          <FormTitle>REGISTER FORM</FormTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="usn">USN:</Label>
              <Input
                type="text"
                id="usn"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="name">Name:</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
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
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
              />
              <PasswordStrengthIndicator
                color={passwordStrength.color}
                visible={isPasswordValid}
              >
                Password Strength: {passwordStrength.strength}
              </PasswordStrengthIndicator>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="department">Department:</Label>
              <select
                id="department"
                value={dname}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </FormGroup>
            <Button type="submit">Register</Button>
          </Form>
          <LoginFormLink to="/StudentLogin">Already registered? Log in</LoginFormLink>
        </FormContainer>
        <ImageContainer src={signUpImage} alt="Sign Up" />
      </CardContainer>
    </PageContainer>
  );
};

export default StudentRegister;
  