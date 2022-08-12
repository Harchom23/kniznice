import { Container } from "react-bootstrap";
import Header from "./Header";
import styled from "styled-components";
import React from "react";

const StyledContent = styled(Container)`
  padding-top: 2rem;
`;

const AppWrapper = ({ brand, submenu, children }) => {
  return (
    <>
      <style>{"body {background-color: gray}"}</style>
      <Header brand={brand} submenu={submenu} />
      <StyledContent>{children}</StyledContent>
    </>
  );
};

export default AppWrapper;
