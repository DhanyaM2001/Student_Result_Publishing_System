const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'ResultSystem',
});

// Encrypt password using bcrypt and update in the database
const encryptPasswordAndUpdate = async (email, password) => {
  try {
    // Generate a salt to use for hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    connection.query(
      'UPDATE user SET password = ? WHERE email = ?',
      [hashedPassword, email],
      (error, results) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Password updated successfully');
        }
        connection.end();
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Usage
encryptPasswordAndUpdate('rvce@edu.in', '1234rvce');
