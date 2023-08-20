import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Container,
  AppBar,
  Toolbar,
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import logo from '../assets/logo.png';

const ResultDisplay = ({ result, resetForm }) => {
  const handlePrintPDF = () => {
    const element = document.getElementById('pdf-container');
    const opt = {
      margin: [10, 10, 0, 10], 
      filename: 'result.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
      {/* <AppBar position="static" color="default">
        <Toolbar>
          <img src={logo} alt="Logo" style={{ marginRight: "1rem", height: "40px" }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            RVCE RESULTS
          </Typography>
          <Box>
            <Button color="inherit">Contact</Button>
          </Box>
        </Toolbar>
      </AppBar> */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#ffffff"
        overflow="hidden"
      >
        <Container maxWidth="lg" >
          <Box
            bgcolor="#ffffff"
            pl={15}
            pt={0}
            borderRadius={8}
            alignItems="center"
            mt={0}
            mb={0}
            width="100%"
            maxWidth="1100px"
            id="pdf-container" 
          >
            {/* Title */}
           {/* Title and logo */}
           <Box display="flex" alignItems="center" mb={4} ml={40}>
            <img src={logo} alt="Logo" style={{ width: '70px', height: '70px', marginRight: '16px' }} />
            <Typography variant="h5" align="center" style={{ fontWeight: 'bold' }} gutterBottom>
              RVCE PROVISIONAL RESULT
            </Typography>
          </Box>

            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body1" align="left" mb={2} style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  USN: {result.condition.usn}
                </Typography>
                <Typography variant="body1" align="left" mb={2} style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Department Name: {result.condition.dname}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" align="right" mb={2} style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Name: {result.condition.name}
                </Typography>
                <Typography variant="body1" align="right" mb={2} style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Semester: {result.condition.semester_no}
                </Typography>
              </Box>
            </Box>
            {result.subjectNames && (
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Subject Code</TableCell>
                      <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Subject Name</TableCell>
                      <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.subjectNames.map((subjectName, index) => {
                      const key = `sub${index + 1}`;
                      const grade = result.condition[key];

                      if (grade !== "NULL") {
                        return (
                          <TableRow key={key}>
                            <TableCell>{result.condition2[key]}</TableCell>
                            <TableCell style={{ fontSize: '1.0rem' }}>
                              {subjectName || '-'}
                            </TableCell>
                            <TableCell>{grade || '-'}</TableCell>
                          </TableRow>
                        );
                      } else {
                        return null; // Skip rendering if grade is "NULL"
                      }
                    })}
                  </TableBody>
                </Table>
                <Typography variant="h3" align="center" style={{ marginTop: '38px', fontSize: '1rem', fontWeight: 'bold' }}>
                  SGPA {result.condition.sgpa}
                </Typography>
              </Box>
            )}
          </Box>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="primary" onClick={resetForm} style={{ marginRight: '38px',marginTop:'0px',marginLeft:'230px'}}>
              Go Back
            </Button>
            <Button variant="contained" color="secondary" onClick={handlePrintPDF}>
              Print PDF
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ResultDisplay;
