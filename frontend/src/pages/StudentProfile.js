import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const StudentProfileEdit = () => {
  const [editableStudent, setEditableStudent] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [dname, setDepartment] = useState('');

  useEffect(() => {
    // Fetch student profile data
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3001/StudentTokenCheck', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEditableStudent(response.data); // Initialize editableStudent with the fetched data
          setDepartment(response.data.department); // Initialize department with the fetched department
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    }

    // Fetch department names
    axios
      .get('http://localhost:3001/departments')
      .then((response) => {
        setDepartments(response.data.map((department) => department.dname));
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  const handleEditProfile = () => {
    const email = editableStudent.email;
    if (!email) { 
      console.error('Email not found in editableStudent.');
      return;
    }

    // Make the axios PUT request to update the student profile based on the email
    axios
      .put(`http://localhost:3001/updateprofile/${email}`, { ...editableStudent, dname })
      .then((response) => {
        console.log('Profile updated successfully:', response.data);
        alert('Profile updated successfully');
        // Optionally, you can set a success message or handle navigation after successful update.
      })
      .catch((error) => {
        console.error('Error updating student profile:', error);
        // Optionally, you can set an error message to display to the user.
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditableStudent({ ...editableStudent, [name]: value });
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  return (
    <Card variant="outlined" style={{ maxWidth: 400, margin: 'auto', padding: 16, marginTop: 20 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Edit Profile
        </Typography>
        {editableStudent ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
            {/* Editable 'name' field */}
            <TextField
              label="Name"
              name="name"
              value={editableStudent.name}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              fullWidth
            />

            {/* Editable 'usn' field */}
            <TextField
              label="Roll Number (USN)"
              name="usn"
              value={editableStudent.usn}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              fullWidth
            />

            {/* Department dropdown */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="dname"
                value={dname}
                onChange={handleDepartmentChange}
                label="Department"
              >
                <MenuItem value="">Select Department</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add more details as per your student schema */}
            {/* Add more fields here */}

            {/* Edit Profile button */}
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </Box>
        ) : (
          <p>Loading...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileEdit;
