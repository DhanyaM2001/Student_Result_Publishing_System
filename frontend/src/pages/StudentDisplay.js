import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  IconButton,
  
  makeStyles,
  TablePagination,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  student: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& h1': {
      margin: theme.spacing(2),
      fontSize: '18px',
    },
  },
  centerTable: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tableContainer: {
    width: '950px',
    boxShadow: 'none',
  },
  tableHeaderCell: {
    backgroundColor: '#0ca686',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '14px',
    textTransform: 'uppercase',
  },
  tableRow: {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  pagination: {
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  search: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(2),

    '& .MuiTextField-root': {
      width: '400px',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#0ca686',
        },
        '&:hover fieldset': {
          borderColor: '#0ca686',
        },
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px',
      },
    },
  },
}));

const StudentDisplay = () => {
  const classes = useStyles();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data);
      setFilteredStudents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredStudents = students.filter((student) => {
      const { name, email, usn } = student;
      return (
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        usn.toLowerCase().includes(searchValue)
      );
    });

    setFilteredStudents(filteredStudents);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredStudents.length - page * rowsPerPage);

  return (
    <div className={classes.student}>
      <h1>Student View</h1>
      <div className={classes.search}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <IconButton size="small">
                <Search />
              </IconButton>
            ),
          }}
        />
      </div>
      <div className={classes.centerTable}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>USN</TableCell>
                <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                <TableCell className={classes.tableHeaderCell}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredStudents
              ).map((student) => (
                <TableRow key={student.usn} className={classes.tableRow}>
                  <TableCell>{student.usn}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.pagination}>
          <TablePagination
            component="div"
            count={filteredStudents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDisplay;
