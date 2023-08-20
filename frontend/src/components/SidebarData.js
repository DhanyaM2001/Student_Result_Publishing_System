import React from "react";
import { AiFillHome } from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FaBook, FaUniversity, FaSignOutAlt, FaPlusCircle, FaFileUpload } from "react-icons/fa";
import logo from "../assets/logo.png"; // Import the logo image
import { FaUser } from "react-icons/fa";
export const SidebarData = [
  {
    title: "", // Logo displayed on top
    path: "/",
    icon: (
      <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
        <img src={logo} alt="Logo" style={{ height: "45px", width: "50px" }} />{" "}
        <span style={{ marginLeft: "10px" }}>Admin Dashboard</span>
      </div>
    ),
    isLogo: true,
  },
  
  {
    title: "Home",
    path: "/home",
    icon: <AiFillHome />,
  },
  {
    title: "Result",
    path: "/result",
    icon: <FaFileUpload />,
  },
  {
    title: "Student",
    path: "/StudentDisplay",
    icon: 
        <FaUser />
        
    
    
  },
  {
    title: "Department",
    path: "/department",
    icon: <FaUniversity />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/department/add_department",
        icon: <FaPlusCircle />,
      },
    ],
  },
  {
    title: "Subject",
    path: "/subject",
    icon: <FaBook />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "Add",
        path: "/subject/add_subject",
        icon: <FaPlusCircle />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Logout",
    path: "/AdminLogin",
    icon: <FaSignOutAlt />,
  },
];
