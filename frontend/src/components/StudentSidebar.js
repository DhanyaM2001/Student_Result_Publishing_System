import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { StudentSidebarData } from "./StudentSidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import logo from "../assets/logo.png";

const Nav = styled.div`
  background: #004646;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #004646;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const StudentSidebar = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Fetch the email of the currently logged-in user
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    }
  }, []);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#">
            <FaIcons.FaBars />
          </NavIcon>
          <img
            src={logo}
            alt="Logo"
            style={{ marginLeft: "1rem", height: "40px" }}
          />
          <h1
            style={{
              textAlign: "center",
              marginLeft: "1rem",
              color: "white",
              fontSize: 15
            }}
          >
          </h1>
          <p style={{ marginLeft: "80rem", color: "white" }}>{email}</p> {/* Display the email */}
        </Nav>
        <SidebarNav>
          <SidebarWrap>
            {StudentSidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default StudentSidebar;
