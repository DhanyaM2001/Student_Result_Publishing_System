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
  TablePagination,
} from '@material-ui/core';
import { Edit, Delete, Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  department: {
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
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
  cancelButton: {
    color: 'red',
  },
  saveButton: {
    color: 'green',
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

const Department = () => {
  const classes = useStyles();

  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editedDepartment, setEditedDepartment] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');


  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/departments');
      setDepartments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const handleOpenDialog = (department) => {
    setOpen(true);
    setSelectedDepartment(department);
    setEditedDepartment(department.dname);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDepartment(null);
    setEditedDepartment('');
  };

  const handleSaveChanges = async () => {
    if (selectedDepartment) {
      try {
        await axios.put(
          `http://localhost:3001/departments/${selectedDepartment.dname}`,
          {
            newDname: editedDepartment,
          }
        );
        showSuccessMessage('Department updated successfully!');
        fetchDepartments();
      } catch (error) {
        showErrorMessage('Can not update this department..!');
        console.error('Error updating department:', error);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteDepartment = async (department) => {
    try {
      var dname = department.dname;
      await axios.delete(`http://localhost:3001/departments/${dname}`);
     console.log(department.dname);
     showSuccessMessage('Department deleted successfully!');
      fetchDepartments();
    } catch (error) {
      showErrorMessage('Can not delete this department..!');
      console.error('Error deleting department:', error);
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
      fontWeight: 'bold',
      fontSize: '14px',
      textTransform: 'uppercase',
    },
    body: {
      fontSize: '16px',
    },
  }))(TableCell);

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

  const filteredDepartments = departments.filter((department) =>
    department.dname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredDepartments.length - page * rowsPerPage);


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
  

  return (
    <div className={classes.department}>
      <h1>Department View</h1>
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
      <div className="success-message" style={{marginBottom:'10px', color: 'green' }}>
        {successMessage}
      </div>
    )}
    {errorMessage && (
      <div className="error-message" style={{marginBottom:'10px', color: 'red' }}>
        {errorMessage}
      </div>
    )}

      <div className={classes.centerTable}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.tableHeaderCell}>DEPARTMENT NAME</StyledTableCell>
                <StyledTableCell className={classes.tableHeaderCell}>ACTIONS</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredDepartments
              ).map((department) => (
                <TableRow key={department.dname} className={classes.tableRow}>
                  <TableCell>{department.dname}</TableCell>
                  <TableCell>
                    <BrightIconButton
                      className={`${classes.editIcon} edit`}
                      onClick={() => handleOpenDialog(department)}
                      color="primary"
                    >
                      <Edit />
                    </BrightIconButton>
                    <BrightIconButton
                      className={`${classes.deleteIcon} delete`}
                      onClick={() => handleDeleteDepartment(department)}
                      color="secondary"
                    >
                      <Delete />
                    </BrightIconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.pagination}>
          <TablePagination
            component="div"
            count={filteredDepartments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      </div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle className={classes.dialogTitle}>Edit Department</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            label="Department Name"
            fullWidth
            value={editedDepartment}
            onChange={(e) => setEditedDepartment(e.target.value)}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleCloseDialog} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} className={classes.saveButton}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Department;
