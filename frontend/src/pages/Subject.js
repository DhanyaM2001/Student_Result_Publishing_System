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
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withStyles,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from '@material-ui/core';
import { Edit, Delete, Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  subject: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& h1': {
      margin: theme.spacing(2),
      fontSize: '24px',
    },
  },
  centerTable: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  editIcon: {
    color: 'green',
    fontSize: '1.8rem',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  deleteIcon: {
    color: 'red',
    fontSize: '1.8rem',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  dialogTitle: {
    backgroundColor: 'rgb(12, 166, 134)',
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  scrollableMenu: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  tableHeaderCell: {
    backgroundColor: '#0ca686',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    textTransform: 'uppercase',
  },
  tableRow: {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  pagination: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
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
  tableContainer: {
    boxShadow: 'none', // Remove the table shadow
  },
}));

const Subject = () => {
  const classes = useStyles();

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editedSubject, setEditedSubject] = useState({
    subject_name: '',
    subject_code: '',
    year: '',
    semester_no: '',
    dname: '',
    credits: '',
  });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [validationErrors, setValidationErrors] = useState({});


  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getsubjects');
      setSubjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching subject data:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments');
      setDepartments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const handleOpenDialog = (subject) => {
    setOpen(true);
    setSelectedSubject(subject);
    setEditedSubject({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      year: subject.year,
      semester_no: subject.semester_no,
      credits : subject.credits,
      dname: subject.dname,
    });
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedSubject(null);
    setEditedSubject({
      subject_name: '',
      subject_code: '',
      year: '',
      semester_no: '',
      credits : '',
      dname: '',
    });
  };

  const handleSaveChanges = async () => {
    const isValid = validateFields();
    if (isValid) {
    if (selectedSubject) {
      try {
        await axios.put(
          `http://localhost:3001/subjectsEdit/${selectedSubject.subject_code}`,
          editedSubject
        );
        fetchSubjects();
        showSuccessMessage('Subject updated successfully!'); 
      } catch (error) {
        showErrorMessage('Can not update subject..!');
        console.error('Error updating subject:', error);
      }
    }
    handleCloseDialog();
  }
  };

  const handleDeleteSubject = async (subject) => {
    try {
      await axios.delete(`http://localhost:3001/subjectsDelete/${subject.subject_code}`);
      showSuccessMessage('Subject deleted successfully'); 
      fetchSubjects();
    } catch (error) {
      showErrorMessage('Can not delete subject..!');
      console.error('Error deleting subject:', error);
    }
  };

  const BrightIconButton = withStyles(() => ({
    root: {
      '&.edit': {
        color: 'green',
        fontSize: '1.8rem',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.2)',
        },
      },
      '&.delete': {
        color: 'red',
        fontSize: '1.8rem',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.2)',
        },
      },
    },
  }))(IconButton);

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: 'rgb(12, 166, 134)',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '20px',
      textTransform: 'uppercase',
    },
    body: {
      fontSize: '16px',
    },
  }))(TableCell);

  const yearList = (() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;
    const endYear = currentYear + 20;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  })();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, filteredSubjects.length - page * rowsPerPage);


    const showSuccessMessage = (message) => {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Hide the message after 3 seconds
    };
    
    const showErrorMessage = (message) => {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide the message after 3 seconds
    };
    

    const validateFields = () => {
      const errors = {};
    
      if (editedSubject.subject_name === '') {
        errors.subject_name = 'Subject Name is required.';
      } else if (!/^[a-zA-Z\s]+$/.test(editedSubject.subject_name)) {
        errors.subject_name = 'Subject Name should only contain letters and spaces.';
      }
    
      if (editedSubject.year === '') {
        errors.year = 'Year is required.';
      }
    
      if (editedSubject.semester_no === '') {
        errors.semester_no = 'Semester is required.';
      } else {
        const semesterNumber = parseInt(editedSubject.semester_no, 10);
        if (isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 8) {
          errors.semester_no = 'Semester should be a number between 1 and 8.';
        }
      }
    
      if (editedSubject.credits === '') {
        errors.credits = 'Credits are required.';
      } else {
        const creditsNumber = parseInt(editedSubject.credits, 10);
        if (isNaN(creditsNumber) || creditsNumber < 1 || creditsNumber > 5) {
          errors.credits = 'Credits should be a number between 1 and 5.';
        }
      }
    
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
    



  return (
    <div className={classes.subject}>
      <h1>Subject View</h1>
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

      {successMessage && (
      <div className="success-message" style={{ color: 'green' }}>
        {successMessage}
      </div>
    )}
    {errorMessage && (
      <div className="error-message" style={{ color: 'red' }}>
        {errorMessage}
      </div>
    )}


      <div className={classes.centerTable}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.tableHeaderCell}>Subject Name</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Subject Code</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Year</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Semester</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Credits</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Department</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredSubjects
              ).map((subject) => (
                <TableRow key={subject.subject_code} className={classes.tableRow}>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>{subject.subject_code}</TableCell>
                  <TableCell>{subject.year}</TableCell>
                  <TableCell>{subject.semester_no}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>{subject.dname}</TableCell>
                  <TableCell>
                    <BrightIconButton
                      className={`${classes.editIcon} edit`}
                      onClick={() => handleOpenDialog(subject)}
                      color="primary"
                    >
                      <Edit />
                    </BrightIconButton>
                    <BrightIconButton
                      className={`${classes.deleteIcon} delete`}
                      onClick={() => handleDeleteSubject(subject)}
                      color="secondary"
                    >
                      <Delete />
                    </BrightIconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredSubjects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          className={classes.pagination}
        />
      </div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle className={classes.dialogTitle}>Edit Subject</DialogTitle>
        <DialogContent>
          <form className={classes.form}>
            <TextField
              label="Subject Name"
              value={editedSubject.subject_name}
              onChange={(e) =>
                setEditedSubject({ ...editedSubject, subject_name: e.target.value })
              }
              error={!!validationErrors.subject_name}
              helperText={validationErrors.subject_name}
            />
            <TextField
              label="Subject Code"
              value={editedSubject.subject_code}
              disabled 
            />
            <FormControl>
              <InputLabel>Year</InputLabel>
              <Select
                value={editedSubject.year}
                onChange={(e) => setEditedSubject({ ...editedSubject, year: e.target.value })}
              >
                {yearList.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Semester"
              value={editedSubject.semester_no}
              onChange={(e) =>
                setEditedSubject({ ...editedSubject, semester_no: e.target.value })
              }
              error={!!validationErrors.semester_no}
              helperText={validationErrors.semester_no}
            />
            <TextField
              label="Credits"
              value={editedSubject.credits}
              onChange={(e) =>
                setEditedSubject({ ...editedSubject, credits: e.target.value })
              }
              error={!!validationErrors.credits}
              helperText={validationErrors.credits}
            />

            <FormControl>
              <InputLabel>Department</InputLabel>
              <Select
                value={editedSubject.dname}
                onChange={(e) => setEditedSubject({ ...editedSubject, dname: e.target.value })}
                MenuProps={{ classes: { paper: classes.scrollableMenu } }}
              >
                {departments.map((department) => (
                  <MenuItem key={department.dname} value={department.dname}>
                    {department.dname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Subject;
