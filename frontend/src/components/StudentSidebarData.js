import React from "react";
import { AiFillHome } from "react-icons/ai";
import {  FaSignOutAlt, FaFileUpload } from "react-icons/fa";
import logo from "../assets/logo.png"; // Import the logo image
export const StudentSidebarData = [
  {
    title: "", // Logo displayed on top
    path: "/",
    icon: (
      <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
        <img src={logo} alt="Logo" style={{ height: "45px", width: "50px" }} />{" "}
        <span style={{ marginLeft: "10px" }}>Student Dashboard</span>
      </div>
    ),
    isLogo: true,
  },
  
  {
    title: "profile",
    path: "/StudentProfile",
    icon: <AiFillHome />,
  },
  {
    title: "Result",
    path: "/StudentResults",
    icon: <FaFileUpload />,
  },
  
  {
    title: "Logout",
    path: "/StudentLogout",
    icon: <FaSignOutAlt />,
  },
];
