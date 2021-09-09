import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { O_FROST, O_FONT } from "../utils/Constants";
import { Homebase, WallBoardButtons } from "../styles/WallboardStyles";
import { StyledButton } from "./Home";

const StyledTitle = styled.h1`
  text-align: center;
  color: ${O_FROST};
  font-family: ${O_FONT};
`;

export default class NullWallboard extends React.Component {
  render() {
    return (
      <Homebase>
        <StyledTitle>Wallboard Not Found!</StyledTitle>
        <WallBoardButtons>
          <Link to="/" style={{ textDecoration: "none" }}>
            <StyledButton>Home</StyledButton>
          </Link>
        </WallBoardButtons>
      </Homebase>
    );
  }
}
