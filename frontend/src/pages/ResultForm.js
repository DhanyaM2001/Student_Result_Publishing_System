import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import axios from 'axios';
import logo from "../assets/logo.png";

const ResultForm = ({ setResult }) => {
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3001/StudentTokenCheck', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setStudent(response.data);
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const usn = student.usn;
        const department = student.dname;
        const response = await axios.get('http://localhost:3001/StudentResults', {
          params: {
            usn,
            department,
            semester,
            year,
          },
        });

        setResult(response.data); // Set the result data
      
      } catch (error) {
        alert('Student result not found');
        console.error('Error performing SQL query:', error);
      }
      resetForm();
    } else {
      setValidationErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!semester) {
      errors.semester = 'Semester is required';
    } else if (isNaN(semester) || semester < 1 || semester > 8) {
      errors.semester = 'Semester should be a number between 1 and 8';
    }

    if (!year) {
      errors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(year)) {
      errors.year = 'Invalid Year (should be 4 digits)';
    }

    return errors;
  };

  const resetForm = () => {
    setSemester('');
    setYear('');
    setValidationErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' ,marginTop : '0px'}}>
      <AppBar position="static" color="default">
        <Toolbar>
          <img src={logo} alt="Logo" style={{ marginRight: "1rem", height: "40px" }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            RVCE RESULTS
          </Typography>
          <Box>
            <Button color="inherit">Contact</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
     display="flex"
     justifyContent="center"
     alignItems="center"
     minHeight="100vh"
     overflow="hidden" /* Add overflow: hidden to disable scrolling */
     bgcolor="#f3f3f3"
    >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="500px"
          bgcolor="#ffffff"
          boxShadow={1}
          p={4}
          borderRadius={8}
          mt={5}
        >
          <Typography variant="h5" align="center" gutterBottom style={{ fontSize: '2rem' }}>
            RVCE Provisional Results
          </Typography>
          <TextField
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!validationErrors.semester}
            helperText={validationErrors.semester}
            style={{ fontSize: '1.2rem' }}
          />
          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!validationErrors.year}
            helperText={validationErrors.year}
            style={{ fontSize: '1.2rem' }}
          />
          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary" style={{ fontSize: '1.2rem', marginRight: '1rem' }}>
              Submit
            </Button>
            <Button color="secondary" variant="contained" style={{ fontSize: '1.2rem' }} onClick={resetForm}>
              Reset
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default ResultForm;
