const express = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer'); 
const app = express();
const port = 3001;
require('dotenv').config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test',
  database: 'ResultSystem',
});

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());

// Middleware for handling preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

// Route for file upload and data insertion


//start excel code
app.post('/excel', upload.single('fileData'), async (req, res) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Read the Excel file
    const file = xlsx.read(req.file.buffer);

    const headingRow = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { header: 1 })[0];
    console.log(headingRow);

    // Extract the data from the Excel file
    const sheets = file.SheetNames;
    const data = [];
    for (let i = 0; i < sheets.length; i++) {
      const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    // Insert the data into the MySQL database
    for (let i = 0; i < data.length; i++) {
      const { Branch, USN, Name, Semester, Year, ...subjects } = data[i];

      // Prepare the data for insertion
      const resultData = {
        dname: Branch, // Department Name
        usn: USN,
        name: Name,
        semester_no: Semester,
        year: Year
      };

      // Get the subject codes from the subjects object (excluding "SGPA")
      const subjectCodes = Object.keys(subjects).filter((key) => key !== 'SGPA');

      // Calculate the count of subject columns
      const subjectCount = Math.min(subjectCodes.length, 10);

      // Insert the subject details into corresponding columns
      for (let j = 0; j < subjectCount; j++) {
        const subjectCode = subjectCodes[j];
        const subjectColumn = `sub${j + 1}`;
        resultData[subjectColumn] = subjects[subjectCode];
      }

      // Calculate the count of columns between Semester and SGPA
      const remainingColumnsCount = 10 - subjectCount; // No need to subtract for SGPA

      // Fill in the remaining subject columns with NULL values
      for (let j = subjectCount + 1; j <= subjectCount + remainingColumnsCount; j++) {
        const subjectColumn = `sub${j}`;
        resultData[subjectColumn] = null; // Set to NULL
      }

      // Insert the SGPA value
      resultData['SGPA'] = subjects['SGPA'];

      // Insert the data into the MySQL database
      const query = 'INSERT INTO result SET ?';
      connection.query(query, resultData, (error, results, fields) => {
        if (error) {
          console.error('Error inserting data into the database:', error);
          return;
        }

        console.log('Data inserted successfully');

        // Check if it is the last iteration
        if (i === data.length - 1) {
          // Insert headData after successful insert of all data
          const headData = {
            dname: 'Branch', // Department Name
            usn: 'USN',
            name: 'Name',
            semester_no: 'Semester',
            year:headingRow[4],
            sub1: headingRow[5] === 'SGPA' ? null : headingRow[5],
            sub2: headingRow[6] === 'SGPA' ? null : headingRow[6],
            sub3: headingRow[7] === 'SGPA' ? null : headingRow[7],
            sub4: headingRow[8] === 'SGPA' ? null : headingRow[8],
            sub5: headingRow[9] === 'SGPA' ? null : headingRow[9],
            sub6: headingRow[10] === 'SGPA' ? null : headingRow[10],
            sub7: headingRow[11] === 'SGPA' ? null : headingRow[11],
            sub8: headingRow[12] === 'SGPA' ? null : headingRow[12],
            sub9: headingRow[13] === 'SGPA' ? null : headingRow[13],
            sub10: headingRow[14] === 'SGPA' ? null : headingRow[14],
            SGPA: 'SGPA'
          };
          

          const query1 = 'INSERT INTO result SET ?';
          connection.query(query1, headData, (error, results, fields) => {
            if (error) {
              console.error('Error inserting headData into the database:', error);
              return;
            }

            console.log('headData inserted successfully');
          });
        }
      });
    }

    return res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


 //end excel code


// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Retrieve user from the database
  connection.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length > 0) {
        const user = results[0];

        try {
          // Compare the hashed password with the input password
          const match = await bcrypt.compare(password, user.password);

          if (match) {
            // Generate JWT
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
            console.log(token); // Display the token in the console

            return res.json({ token });
          } else {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
        } catch (bcryptErr) {
          console.error(bcryptErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  );
});

// Route for retrieving all departments
app.get('/departments', (req, res) => {
  // Retrieve all departments from the department table
  const query = 'SELECT * FROM department';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving departments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(results);
  });
});

// Route for inserting department name
app.post('/departments', (req, res) => {
  const { dname } = req.body;

  // Check if the department already exists
  const checkQuery = 'SELECT * FROM department WHERE dname = ?';
  connection.query(checkQuery, [dname], (error, results) => {
    if (error) {
      console.error('Error checking department:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      console.log('Department already exists');
      return res.status(409).json({ error: 'Department already exists' });
    }

    // Insert the department name into the department table
    const insertQuery = 'INSERT INTO department (dname) VALUES (?)';
    connection.query(insertQuery, [dname], (error, results, fields) => {
      if (error) {
        console.error('Department already exists:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Department inserted successfully');
      return res.json({ message: 'Department inserted successfully' });
    });
  });
});

// Route for updating a department
app.put('/departments/:dname', (req, res) => {
  const { dname } = req.params;
  const { newDname } = req.body;

  // Update the department with the provided dname
  const query = 'UPDATE department SET dname = ? WHERE dname = ?';
  connection.query(query, [newDname, dname], (error, results) => {
    if (error) {
      console.error('Error updating department:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Department updated successfully');
    // Use the results parameter if needed
    console.log(results);

    return res.json({ message: 'Department updated successfully' });
  });
});

// Route for deleting a department
app.delete('/departments/:dname', (req, res) => {
  const { dname} = req.params;

  // Delete the department with the provided ID
  const query = 'DELETE FROM department WHERE dname = ?';
  connection.query(query, [dname], (error, results) => {
    if (error) {
      console.error('Error deleting department:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Department deleted successfully');
    return res.json({ message: 'Department deleted successfully' });
  });
});



// Route for adding a subject
app.post('/subjects', (req, res) => {
  const { subjectName, subjectCode, year, semesterNo, selectedDepartment,credits } = req.body;

  // Check if the subject already exists
  const checkQuery = 'SELECT * FROM subject WHERE subject_code = ?';
  connection.query(checkQuery, [subjectCode], (error, results) => {
    if (error) {
      console.error('Error checking subject:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      console.log('Subject already exists');
      return res.status(409).json({ error: 'Subject already exists' });
    }

    // Insert the subject details into the subject table
    const insertQuery = 'INSERT INTO subject (subject_name, subject_code, year, semester_no, dname,credits) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [subjectName, subjectCode, year, semesterNo, selectedDepartment,credits], (error, results, fields) => {
      if (error) {
        console.error('Error inserting subject:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Subject inserted successfully');
      return res.json({ message: 'Subject inserted successfully' });
    });
  });
});

app.get('/getsubjects', (req, res) => {
  // Retrieve all subjects from the subject table
  const query = 'SELECT subject_name,subject_code,year,semester_no,credits,dname FROM subject';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving subjects:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(results);
  });
});


// Route for updating a subject
app.put('/subjectsEdit/:subjectCode', (req, res) => {
  const { subjectCode } = req.params;
  const { subject_name, year, semester_no,credits, dname } = req.body;
  
  const updateSubjectQuery = 'UPDATE subject SET subject_name = ?, year = ?, semester_no = ?,credits=?, dname = ? WHERE subject_code = ?';
  connection.query(
  updateSubjectQuery,
  [subject_name, year, semester_no,credits, dname, subjectCode],
  (error, results) => {
  if (error) {
  console.error('Error updating the subject', error);
  return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  console.log('Subject updated successfully');
  console.log(results);
  
  return res.json({ message: 'Subject updated successfully' });
  }
  );
  });
// Route for deleting a subject
app.delete('/subjectsDelete/:subjectCode', (req, res) => {
  const { subjectCode } = req.params;

  // Delete the subject with the provided subjectCode
  const query = 'DELETE FROM subject WHERE subject_code = ?';
  connection.query(query, [subjectCode], (error, results) => {
    if (error) {
      console.error('Error deleting subject:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Subject deleted successfully');
    return res.json({ message: 'Subject deleted successfully' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





//display result get
app.get('/StudentResults', (req, res) => {
  const { usn, department, semester, year } = req.query;

  // Perform the initial SQL query
  const query1 = `
    SELECT * FROM result
    WHERE usn = '${usn}' AND dname = '${department}' AND semester_no = '${semester}' AND year = '${year}'
  `;
  connection.query(query1, (err, results1) => {
    if (err) {
      console.error('Error performing initial SQL query:', err);
      res.status(500).json({ error: 'Error performing initial SQL query' });
    } else {
      // Find the initial row from the first query
      const initialRow = results1[0];


      if (!initialRow) {
        // Send an alert message if no initial row is found
        return res.status(404).json({ error: 'Student result not found' });
      }


      //changed now
      const sino_of_query1 = initialRow.sino;
      console.log(sino_of_query1);
      // Perform the second SQL query with condition2
      const query2 = `
        SELECT * FROM result
        WHERE dname = 'Branch' AND sino > ${sino_of_query1}
        limit 1
      `;
      // Perform the second SQL query with condition2
      // const query2 = `
      //   SELECT * FROM result
      //   WHERE dname = 'Branch' and 
      //   LIMIT 1
      // `;
      connection.query(query2, (err, results2) => {
        if (err) {
          console.error('Error performing second SQL query:', err);
          res.status(500).json({ error: 'Error performing second SQL query' });
        } else {
          const matchingRow1 = filterNullColumns(initialRow);
          const matchingRow2 = results2.length > 0 ? filterNullColumns(results2[0]) : null;

          // Retrieve subject codes for non-null and non-empty values
          const subjectCodes = Object.keys(matchingRow2)
            .filter(key => key.startsWith('sub') && matchingRow2[key])
            .map(key => matchingRow2[key]);

          const query3 = `
            SELECT subject_name FROM subject
            WHERE subject_code IN ('${subjectCodes.join("', '")}')
          `;
          connection.query(query3, (err, results3) => {
            if (err) {
              console.error('Error performing third SQL query:', err);
              res.status(500).json({ error: 'Error performing third SQL query' });
            } else {
              const subjectNames = results3.map(result => result.subject_name);

              // Calculate SGPA
              const sgpa = Object.values(matchingRow1)
                .filter(value => typeof value === 'number')
                .reduce((sum, value) => sum + value, 0) / subjectCodes.length;
              console.log(matchingRow1);
              console.log(matchingRow2);
              console.log(subjectNames);
              res.json({
                condition: matchingRow1,
                condition2: matchingRow2,
                subjectNames: subjectNames,
                SGPA: sgpa,
              });
            }
          });
        }
      });
    }
  });
});

function filterNullColumns(row) {
  const filteredRow = {};
  for (const column in row) {
    if (row.hasOwnProperty(column) && row[column] !== null) {
      filteredRow[column] = row[column];
    }
  }
  return filteredRow;
}

//display result end




// app.post('/subjects', (req, res) => {
//   const { subjectName, subjectCode, year, semesterNo, selectedDepartment } = req.body;

//   // Check if the subject already exists
//   const checkQuery = 'SELECT * FROM subject WHERE subject_code = ?';
//   connection.query(checkQuery, [subjectCode], (error, results) => {
//     if (error) {
//       console.error('Error checking subject:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length > 0) {
//       console.log('Subject already exists');
//       return res.status(409).json({ error: 'Subject already exists' });
//     }

//     // Insert the subject details into the subject table
//     const insertQuery = 'INSERT INTO subject (subject_name, subject_code, year, semester_no, dname) VALUES (?, ?, ?, ?, ?)';
//     connection.query(insertQuery, [subjectName, subjectCode, year, semesterNo, selectedDepartment], (error, results, fields) => {
//       if (error) {
//         console.error('Error inserting subject:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       console.log('Subject inserted successfully');
//       return res.json({ message: 'Subject inserted successfully' });
//     });
//   });
// });
app.get('/students', (req, res) => {
  // Retrieve all departments from the department table
  const query = 'SELECT * FROM student';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving departments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(results);
  });
});


//student register start




app.post('/StudentRegister', (req, res) => {
  const { usn, name, email, password, dname } = req.body;

  // Check if the student already exists in the database
  const checkQuery = 'SELECT * FROM student WHERE usn = ?';
  connection.query(checkQuery, [usn], (error, results) => {
    if (error) {
      console.error('Error checking student:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Student already exists' });
    }

    // Hash the password before saving it to the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'An error occurred while registering.' });
      }

      // Insert the student data into the database with the hashed password
      const query = `INSERT INTO student (usn, name, email, password, dname) VALUES (?, ?, ?, ?, ?)`;
      connection.query(query, [usn, name, email, hashedPassword, dname], (err, result) => {
        if (err) {
          console.error('Error saving data:', err);
          res.status(500).json({ error: 'An error occurred while saving the data.' });
        } else {
          res.json({ message: 'Data saved successfully.' });
        }
      });
    });
  });
});
//student register end



//student login start
// app.post('/StudentLogin', (req, res) => {
//   const { email, password } = req.body;

//   // Check if the student exists in the database
//   const query = 'SELECT * FROM student WHERE email = ? AND password = ?';
//   connection.query(query, [email, password], (error, results) => {
//     if (error) {
//       console.error('Error checking student:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length === 0) {
//       console.log('Invalid credentials');
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Student login successful
//     res.json({ message: 'Login successful' });
//     res.redirect('/dashboard');
//   });
// });

//student login end



// const jwt = require('jsonwebtoken');



// const jwt = require('jsonwebtoken');



app.post('/StudentLogin', (req, res) => {
  const { email, password } = req.body;

  // Check if the student exists in the database
  const query = 'SELECT * FROM student WHERE email = ?';
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error checking student:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      console.log('Invalid credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const student = results[0]; // Assuming the first result is the student's details

    // Compare the hashed password with the provided password
    bcrypt.compare(password, student.password, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!passwordMatch) {
        console.log('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Password matches, create a JWT and send it as a response
      const token = jwt.sign({ usn: student.usn, email: student.email }, process.env.JWT_SECRET_KEY);
      return res.json({ token });
    });
  });
});

const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service provider
    auth: {
      user: 'chandanamanjunath1986@gmail.com', // Replace with your email address
      pass: 'wklzyvtbaleoznfj', // Replace with your email password
    },
  });

  const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const mailOptions = {
    from: 'chandanamanjunath1986@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Dear user,</p>
           <p>Please click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};



// Route for handling forgot password
app.post('/ForgotPassword', (req, res) => {
  const { email } = req.body;

  // Check if the student with the provided email exists in the database
  const query = 'SELECT * FROM student WHERE email = ?';
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error checking student:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      console.log('Student with the provided email not found');
      return res.status(404).json({ error: 'Student with the provided email not found' });
    }

    console.log('Student with the provided email found');

    // Generate a JWT for password reset and send the reset password email
    const student = results[0];
    const token = jwt.sign({ usn: student.usn, email: student.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    sendResetPasswordEmail(email, token);

    return res.json({ message: 'Reset password email sent successfully' });
  });
});

// ... Your existing routes ...






app.get('/StudentTokenCheck', (req, res) => {
  // Extract the JWT from the Authorization header
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch the student details from the database using the decoded token information
    const query = 'SELECT * FROM student WHERE usn = ?';
    connection.query(query, [decoded.usn], (error, results) => {
      if (error) {
        console.log(decoded.usn);
        console.error('Error fetching student:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        console.log('Student not found');
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = results[0];
      // Return the student details as a response
      res.json(student);
    });
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});


//display result get
app.get('/LoginResults', (req, res) => {
  const { usn, department, semester, year } = req.query;

  // Perform the initial SQL query
  const query1 = `
    SELECT * FROM result
    WHERE usn = '${usn}' AND dname = '${department}' AND semester_no = '${semester}' AND year = '${year}'
  `;
  connection.query(query1, (err, results1) => {
    if (err) {
      console.error('Error performing initial SQL query:', err);
      res.status(500).json({ error: 'Error performing initial SQL query' });
    } else {
      // Find the initial row from the first query
      const initialRow = results1[0];

      if (!initialRow) {
        // Send an alert message if no initial row is found
        return res.status(404).json({ error: 'Student result not found' });
      }

      const sino_of_query1 = initialRow.sino;
      console.log(sino_of_query1);
      // Perform the second SQL query with condition2
      const query2 = `
        SELECT * FROM result
        WHERE dname = 'Branch' AND sino > ${sino_of_query1}
        limit 1
      `;
      connection.query(query2, (err, results2) => {
        if (err) {
          console.error('Error performing second SQL query:', err);
          res.status(500).json({ error: 'Error performing second SQL query' });
        } else {
          const matchingRow1 = filterNullColumns(initialRow);
          const matchingRow2 = results2.length > 0 ? filterNullColumns(results2[0]) : null;

          // Retrieve subject codes for non-null and non-empty values
          const subjectCodes = Object.keys(matchingRow2)
            .filter(key => key.startsWith('sub') && matchingRow2[key])
            .map(key => matchingRow2[key]);

          const query3 = `
            SELECT subject_name FROM subject
            WHERE subject_code IN ('${subjectCodes.join("', '")}')
          `;
          connection.query(query3, (err, results3) => {
            if (err) {
              console.error('Error performing third SQL query:', err);
              res.status(500).json({ error: 'Error performing third SQL query' });
            } else {
              const subjectNames = results3.map(result => result.subject_name);

              // Calculate SGPA
              const sgpa = Object.values(matchingRow1)
                .filter(value => typeof value === 'number')
                .reduce((sum, value) => sum + value, 0) / subjectCodes.length;

              res.json({
                condition: matchingRow1,
                condition2: matchingRow2,
                subjectNames: subjectNames,
                SGPA: sgpa,
              });
            }
          });
        }
      });
    }
  });
});

// Route to handle the password reset request start

app.put('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  // Basic validation
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and newPassword are required.' });
  }

  try {
    // Find the user by email in the MySQL database
    const findUserQuery = 'SELECT * FROM student WHERE email = ?';
    connection.query(findUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Error finding user. Please try again later.' });
      }

      const user = results[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Encrypt the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the MySQL database with the hashed password
      const updatePasswordQuery = 'UPDATE student SET password = ? WHERE email = ?';
      connection.query(updatePasswordQuery, [hashedPassword, email], (err) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Error updating password. Please try again later.' });
        }

        return res.json({ message: 'Password updated successfully.' });
      });
    });
  } catch (error) {
    console.error('Error encrypting password:', error);
    return res.status(500).json({ message: 'Error encrypting password. Please try again later.' });
  }
});

function filterNullColumns(row) {
  const filteredRow = {};
  for (const column in row) {
    if (row.hasOwnProperty(column) && row[column] !== null) {
      filteredRow[column] = row[column];
    }
  }
  return filteredRow;
}

//display result end
// app.put('/updateprofile/:email', (req, res) => {
//   const { email } = req.params;
//   const { usn, name } = req.body;

//   // Update the student with the provided email
//   const query = 'UPDATE student SET usn = ?, name = ? WHERE email = ?';
//   connection.query(query, [usn, name, email], (error, results) => {
//     if (error) {
//       console.error('Error updating student:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     console.log('Student updated successfully');
//     // Use the results parameter if needed
//     console.log(results);

//     return res.json({ message: 'Student updated successfully' });
//   });
// });


app.put('/updateprofile/:email', (req, res) => {
  const { email } = req.params;
  const { usn, name, dname } = req.body; // Include the 'department' field

  // Update the student with the provided email
  const query = 'UPDATE student SET usn = ?, name = ?, dname = ? WHERE email = ?';
  connection.query(query, [usn, name, dname, email], (error, results) => {
    if (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Student updated successfully');
    // Use the results parameter if needed
    console.log(results);

    return res.json({ message: 'Student updated successfully' });
  });
});





//analytics

//count start

// Endpoint to fetch counts from the database
// server.js
app.get('/dept_count', (req, res) => {
  // Retrieve the count of departments from the department table
  const query = 'SELECT COUNT(*) AS departmentCount FROM department';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving department count:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Access the departmentCount value from the results
    const departmentCount = results[0].departmentCount;

    return res.json({ count: departmentCount });
  });
});


app.get('/sub_count', (req, res) => {
  // Retrieve the count of departments from the department table
  const query = 'SELECT COUNT(*) AS subjectCount FROM subject';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving subject count:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Access the departmentCount value from the results
    const subjectCount = results[0].subjectCount;

    return res.json({ count: subjectCount });
  });
});


app.get('/student_count', (req, res) => {
  // Retrieve the count of students from the student table
  const query = 'SELECT COUNT(*) AS studentCount FROM student';
  console.log(query);
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving student count:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Access the studentCount value from the results
    const studentCount = results[0].studentCount;

    return res.json({ count: studentCount });
  });
});

//count end



//topper list start

// app.get('/api/topper_data', (req, res) => {
//   const { department, semester, year } = req.query;

//   // Construct your SQL query to fetch top 3 rows with highest SGPA
//   const resultQuery = `
//     SELECT usn,name,sgpa
//     FROM result
//     WHERE dname = ? AND semester_no = ? AND year = ?
//     ORDER BY sgpa DESC
//     LIMIT 3
//   `;

//   // Fetch data from the database using the connection pool


//     connection.query(resultQuery, [department, semester, year], (resultError, resultRows) => {
//       // connection.release();
//       if (resultError) {
//         console.error('Error querying result table:', resultError);
//         res.status(500).json({ error: 'Error fetching result data' });
//         return;
//       }
//       console.log(resultRows);
//       res.json(resultRows);
//     });
 
// });



//topper list end



//analytics pass fail topper start

// app.get('/api/topper_data', (req, res) => {
//   const { department, semester, year } = req.query;

//   // Construct your SQL query to fetch top 3 rows with highest SGPA
//   const resultQuery = `
//     SELECT usn, name, sgpa
//     FROM result
//     WHERE dname = ? AND semester_no = ? AND year = ?
//     ORDER BY sgpa DESC
//     LIMIT 3
//   `;

//   // Construct query to get count of pass and fail students
//   const countQuery = `
//     SELECT COUNT(*) AS total_students,
//       SUM(CASE WHEN sub1 = 'F' OR sub2 = 'F' OR sub3 = 'F' OR sub4 = 'F' OR sub5 = 'F' OR sub6 = 'F' OR sub7 = 'F' OR sub8 = 'F' OR sub9 = 'F' OR sub10 = 'F' THEN 1 ELSE 0 END) AS fail_count
//     FROM result
//     WHERE dname = ? AND semester_no = ? AND year = ?
//   `;

//   // Fetch data from the database using the connection pool
//   connection.query(resultQuery, [department, semester, year], (resultError, resultRows) => {
//     if (resultError) {
//       console.error('Error querying result table:', resultError);
//       res.status(500).json({ error: 'Error fetching result data' });
//       return;
//     }

//     // Fetch count of pass and fail students
//     connection.query(countQuery, [department, semester, year], (countError, countRows) => {
//       if (countError) {
//         console.error('Error querying count data:', countError);
//         res.status(500).json({ error: 'Error fetching count data' });
//         return;
//       }

//       const totalStudents = countRows[0].total_students;
//       const failCount = countRows[0].fail_count;
//       const passCount = totalStudents - failCount;
//       console.log("total : ",totalStudents)
//       console.log('Pass count:', passCount);
//       console.log('Fail count:', failCount);
//       console.log(resultRows);
//       res.json({
//         toppers: resultRows,
//         pass_count: passCount,
//         fail_count: failCount,
//       });
//     });
//   });
// });


//analytics pass fail topper end




app.get('/api/topper_data', (req, res) => {
  const { department, semester, year } = req.query;

  // Construct your SQL query to fetch top 3 rows with highest SGPA
  const resultQuery = `
    SELECT usn, name, sgpa
    FROM result
    WHERE dname = ? AND semester_no = ? AND year = ?
    ORDER BY sgpa DESC
    LIMIT 3
  `;

  // Construct query to get count of pass and fail students
  const countQuery = `
    SELECT COUNT(*) AS total_students,
      SUM(CASE WHEN sub1 = 'F' OR sub2 = 'F' OR sub3 = 'F' OR sub4 = 'F' OR sub5 = 'F' OR sub6 = 'F' OR sub7 = 'F' OR sub8 = 'F' OR sub9 = 'F' OR sub10 = 'F' THEN 1 ELSE 0 END) AS fail_count
    FROM result
    WHERE dname = ? AND semester_no = ? AND year = ?
  `;

  // Query to get the number of students in the department
  const departmentStudentCountQuery = `
    SELECT COUNT(*) AS department_student_count
    FROM student
    WHERE dname = ?
  `;

  // Query to get the list of subjects for the department and semester
  const subjectsQuery = `
    SELECT subject_name,credits
    FROM subject
    WHERE dname = ? AND semester_no = ?
  `;


  // Fetch data from the database using the connection pool
  connection.query(resultQuery, [department, semester, year], (resultError, resultRows) => {
    if (resultError) {
      console.error('Error querying result table:', resultError);
      res.status(500).json({ error: 'Error fetching result data' });
      return;
    }

    // Fetch count of pass and fail students
    connection.query(countQuery, [department, semester, year], (countError, countRows) => {
      if (countError) {
        console.error('Error querying count data:', countError);
        res.status(500).json({ error: 'Error fetching count data' });
        return;
      }

      // Query to get the number of students in the department
      connection.query(departmentStudentCountQuery, [department], (studentCountError, studentCountRows) => {
        if (studentCountError) {
          console.error('Error querying department student count:', studentCountError);
          res.status(500).json({ error: 'Error fetching department student count data' });
          return;
        }

        // Query to get the list of subjects
        connection.query(subjectsQuery, [department, semester], (subjectsError, subjectsRows) => {
          if (subjectsError) {
            console.error('Error querying subjects:', subjectsError);
            res.status(500).json({ error: 'Error fetching subjects data' });
            return;
          }

          const totalStudents = countRows[0].total_students;
          const failCount = countRows[0].fail_count;
          const passCount = totalStudents - failCount;

          if (resultRows.length === 0) {
            // No data found
            console.log('No data found.');
            res.status(500).json({ error: 'No data found...!' });
            return;
          } else {
            // console.log("total : ", totalStudents);
            // console.log('Pass count:', passCount);
            // console.log('Fail count:', failCount);
            // console.log(resultRows);

            const departmentStudentCount = studentCountRows[0].department_student_count;
            // const subjectList = subjectsRows.map(subject => subject.subject_name);
            //console.log(departmentStudentCount);
            console.log(subjectsRows)
            
            res.json({
              toppers: resultRows,
              pass_count: passCount,
              fail_count: failCount,
              department_student_count: departmentStudentCount,
              subjects: subjectsRows,
            });
          }
        });
      });
    });
  });
});


