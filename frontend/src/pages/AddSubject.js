import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { withStyles } from '@mui/styles';

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [semesterNo, setSemesterNo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
    generateYearOptions();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;
    const endYear = currentYear + 15;
    const years = [];

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    setYearOptions(years);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateFields();

    if (isValid) {
      try {
        const data = {
          subjectName,
          subjectCode,
          year,
          semesterNo,
          selectedDepartment,
          credits,
        };

        const response = await axios.post('http://localhost:3001/subjects', data);
        console.log('Submitted:', response.data);

        setSubjectName('');
        setSubjectCode('');
        setYear('');
        setSemesterNo('');
        setSelectedDepartment('');
        setCredits('');
        setMessage('Subject successfully added.');

        setTimeout(() => {
          setMessage('');
        }, 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleReset = () => {
    setSubjectName('');
    setSubjectCode('');
    setYear('');
    setSemesterNo('');
    setSelectedDepartment('');
    setMessage('');
    setCredits('');
    setValidationErrors({});
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

  const validateFields = () => {
    const errors = {};

    if (!subjectName) {
      errors.subjectName = 'Subject name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(subjectName)) {
      errors.subjectName = 'Subject name should only contain letters and spaces.';
    }

    if (!subjectCode) {
      errors.subjectCode = 'Subject code is required.';
    }

    if (!year) {
      errors.year = 'Year is required.';
    }

    if (!semesterNo || isNaN(semesterNo) || semesterNo < 1 || semesterNo > 8) {
      errors.semesterNo = 'Semester number should be between 1 and 8.';
    }

    if (!credits || isNaN(credits) || credits < 1 || credits > 5) {
      errors.credits = 'Credits should be between 1 and 5.';
    }

    if (!selectedDepartment) {
      errors.selectedDepartment = 'Department is required.';
    }

    setValidationErrors(errors);

    // Check if there are no validation errors
    return Object.keys(errors).length === 0;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f3f3f3" // Set the background color of the form
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '5px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center align the form elements
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontSize: '30px', marginBottom: '16px', color: '#0CA686', textAlign: 'center' }}
        >
          Add Subject
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: '16px' }}>
            <InputLabel style={{ color: '#004646' }}>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              style={{ backgroundColor: '#F0F0F0', maxHeight: '150px', overflowY: 'auto' }}
              label="Department"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '150px',
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.did} value={department.dname}>
                  {department.dname}
                </MenuItem>
              ))}
            </Select>
            {!!validationErrors.selectedDepartment && (
              <Typography variant="caption" color="error">
                {validationErrors.selectedDepartment}
              </Typography>
            )}
          </FormControl>
          <div style={{ marginBottom: '16px', width: '100%' }}>
            <Typography variant="subtitle1" style={{ color: '#004646' }}>
              Subject Name
            </Typography>
            <TextField
              value={subjectName}
              onChange={(event) => setSubjectName(event.target.value)}
              variant="outlined"
              fullWidth
              style={{ backgroundColor: '#F0F0F0' }}
              error={!!validationErrors.subjectName}
              helperText={validationErrors.subjectName}
            />
          </div>
          <div style={{ marginBottom: '16px', width: '100%' }}>
            <Typography variant="subtitle1" style={{ color: '#004646' }}>
              Subject Code
            </Typography>
            <TextField
              value={subjectCode}
              onChange={(event) => setSubjectCode(event.target.value)}
              variant="outlined"
              fullWidth
              style={{ backgroundColor: '#F0F0F0' }}
              error={!!validationErrors.subjectCode}
              helperText={validationErrors.subjectCode}
            />
          </div>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: '16px' }}>
            <InputLabel style={{ color: '#004646' }}>Year</InputLabel>
            <Select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              style={{ backgroundColor: '#F0F0F0' }}
              label="Year"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
              error={!!validationErrors.year}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {yearOptions.map((yearOption) => (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              ))}
            </Select>
            {!!validationErrors.year && (
              <Typography variant="caption" color="error">
                {validationErrors.year}
              </Typography>
            )}
          </FormControl>
          <div style={{ marginBottom: '16px', width: '100%' }}>
            <Typography variant="subtitle1" style={{ color: '#004646' }}>
              Semester Number
            </Typography>
            <TextField
              value={semesterNo}
              onChange={(event) => setSemesterNo(event.target.value)}
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 1, max: 8 }}
              error={!!validationErrors.semesterNo}
              helperText={validationErrors.semesterNo}
              style={{ backgroundColor: '#F0F0F0' }}
            />
          </div>

          <div style={{ marginBottom: '16px', width: '100%' }}>
            <Typography variant="subtitle1" style={{ color: '#004646' }}>
              Credits
            </Typography>
            <TextField
              value={credits}
              onChange={(event) => setCredits(event.target.value)}
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 1, max: 5 }}
              error={!!validationErrors.credits}
              helperText={validationErrors.credits}
              style={{ backgroundColor: '#F0F0F0' }}
            />
          </div>

          <Box display="flex" justifyContent="center" alignItems="center" marginTop="16px">
            <GreenButton
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              style={{ marginRight: '8px' }}
            >
              Submit
            </GreenButton>
            <YellowButton
              type="button"
              variant="contained"
              color="secondary"
              disableElevation
              onClick={handleReset}
            >
              Reset
            </YellowButton>
          </Box>
        </form>
        {message && (
          <Typography
            variant="subtitle1"
            sx={{
              color: '#4CAF50',
              marginTop: '16px',
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          >
            {message}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default AddSubject;
