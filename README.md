# Student_Result_Publishing_System

>The primary function of the Student Result Publishing System is to publish semester-wise academic results to students accurately and promptly. Students can securely log in to the
system and view their subject-wise grades, cumulative GPA, and other academic details.Admins, on the other hand, can manage the system and control the publication of results. They have the privilege to upload result sheets, manage student details, and handle any result-relatedtasks. The system ensures real-time availability of results, enabling students to access their
performance feedback as soon as it is published.


## Functionalities

- User-Friendly Access: Students effortlessly log in using their college-provided email and credentials, accessing a personalized dashboard that simplifies academic record retrieval.
  They can    conveniently select specific semesters for streamlined access to relevant academic information.
  
- Semester-Wise Result Viewing: Within the user-friendly dashboard, students choose desired semesters via a dropdown menu, prompting the system to promptly display comprehensive results,
  including  course details, grades, and credits. This structured presentation offers clear insights into their academic performance.

- Data Security and Convenience: Robust security measures ensure the safety of sensitive academic data, while students can download or print results for their records and easy sharing.
  This dual- purpose feature enhances data security and facilitates communication with academic advisors or relevant parties.
  
- The "Department and Subject Management" functionality in the "Student Result Publishing System" permits administrators to create, update, view, and delete department details
  (department names)   and subject details (subject names, codes, associated department names, and semester numbers). The output is presented in a tabular form, enabling
  administrators to efficiently oversee and maintain accurate academic data, ensuring the system's seamless operation.

- Admins play a pivotal role in managing result sheets within the "Student Result Publishing System." They input and validate grades, credits, and academic data, ensuring accuracy.
  Once verified, they securely publish the results for students, maintaining data integrity and transparency in the academic process.
  
## Language Used

MySQL,React.js,Node.js, and Express.js. 


## Screenshots

<img src="https://github.com/Chandana1709/Student_Result_Publishing_System/assets/95367438/808eeebe-5dfb-4523-a136-78581b94f8dd" alt="Image 1" width="700" height="300">
<br><br>
<img src="https://github.com/Chandana1709/Student_Result_Publishing_System/assets/95367438/fcdf7a46-59d8-45e1-9867-73ca3f9f3862" alt="Image 2" width="700" height="300">
<br><br>
<img src="https://github.com/Chandana1709/Student_Result_Publishing_System/assets/95367438/41f94099-9aad-46f3-baef-856942ee7d86" alt="Image" width="700" height="300">





## Installation

>STEP 1
- sudo apt install mysql-server
- sudo apt install nodejs
- CREATE DATABASE ResultSystem
  
>STEP 2
- import backup.sql file to local MYSQL.Navigate to the directory where your SQL backup file (backup.sql) is located. You can use the cd command to change directories if needed.
  your_username: Replace this with your MySQL username.your_database_name: Replace this with the name of the database where you want to import the data.
- mysql -u your_username -p your_database_name < backup.sql

>STEP 3
- Replace password of your MYSQL in server.js

> STEP 4
- Go to frontend type : npm install
- Go to backend type : npm install
   
## Run Locally

- Open Student_Result_Publishing_System
- go to Student_Result_Publishing_System>frontend type npm start
- open other terminal and go to Student_Result_Publishing_System > backend     type node server.js
