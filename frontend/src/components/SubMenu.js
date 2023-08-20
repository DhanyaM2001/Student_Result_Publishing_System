import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #e1e9fc;
  padding: 10px 20px; /* Adjust the padding as desired */
  list-style: none;
  height: ${({ isLogo }) => (isLogo ? "auto" : "60px")};
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: ${({ isLogo }) => (isLogo ? "transparent" : "#0ca686")};
    border-left: ${({ isLogo }) => (isLogo ? "none" : "4px solid green")};
    cursor: ${({ isLogo }) => (isLogo ? "default" : "pointer")};
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  background: #004646;
  padding: 10px 3rem; /* Adjust the padding as desired */
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #0ca686;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} isLogo={item.isLogo} onClick={item.isLogo ? null : (item.subNav && showSubnav)}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
