import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
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

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Dashboard</h1>
      {student ? (
        <div style={styles.infoContainer}>
          <h2 style={styles.welcomeMessage}>Welcome, {student.name}</h2>
          {/* Uncomment the lines below to display more student details */}
          {/* <p>Email: {student.email}</p>
          <p>Roll Number: {student.usn}</p>
          <p>Department: {student.dname}</p>
          Add more details as per your student schema */}
        </div>
      ) : (
        <p style={styles.loadingMessage}>Loading...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '20px auto',
    padding: '20px',
    maxWidth: '500px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  infoContainer: {
    marginTop: '20px',
  },
  welcomeMessage: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  loadingMessage: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#888',
  },
};

export default StudentDashboard;
