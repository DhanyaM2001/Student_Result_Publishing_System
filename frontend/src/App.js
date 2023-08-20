import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentDisplay from './pages/StudentDisplay';
import StudentSidebar from './components/StudentSidebar';
import Department from './pages/Department';
import AddDepartment from './pages/AddDepartment';
import Subject from './pages/Subject';
import AddSubject from './pages/AddSubject';
import Home from './pages/Home';
// import { Subject, AddSubject, ViewSubject } from './pages/Subject';
import Logout from './pages/Logout';
import Result from './pages/Result';
import StudentResults from './pages/StudentResults';
import ResultDisplay from './pages/ResultDisplay';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import DefaultPage from './pages/DefaultPage';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  return (
    <div className="App">
   
      <Router>
        {isLoggedIn && <Sidebar />} {/* Render Sidebar if isLoggedIn is true */}
        <Routes>

        {/* <Route
            path="/"
            element={isLoggedIn ? <Sidebar /> : <DefaultPage />} // Use DefaultPage for the root path
          /> */}
          <Route path="/" element={<DefaultPage />} />

          <Route path="/AdminLogin" element={isLoggedIn ? <Sidebar /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/home" element={<><Sidebar/><Home /></>} />
          <Route path="/department" element={<><Sidebar/><Department /></>} />
          <Route path="/department/add_department" element={<><Sidebar/><AddDepartment /></>} />
          <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/subject" element={<><Sidebar/><Subject /></>} />
          <Route path="/subject/add_subject" element={<><Sidebar/><AddSubject /></>} />
          <Route path="/result" element={<><Sidebar/><Result /></>} />
          {/* <Route path="/StudentResults" exact element={StudentResults} /> */}
          <Route path="/StudentResults" element={<><StudentSidebar/><StudentResults /></>} />
          <Route path="/ResultDisplay" element={<ResultDisplay />} />
          <Route path="/StudentRegister" element={<StudentRegister />} />
          <Route path="/StudentLogin" element={<StudentLogin />} />
          <Route path="/StudentDisplay" element={<><Sidebar/><StudentDisplay /></>} />
          
          <Route path="/StudentDashboard" element={<><StudentSidebar/><StudentDashboard/></> } />
          <Route path="/StudentProfile" element={<><StudentSidebar/><StudentProfile/></> } />
          <Route path="/StudentLogout" element={<StudentLogin />} />

          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;
