import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CX_OFF_WHITE, CX_GRAY_BLUE, CX_FONT, BATMAN_GRAY } from "../Constants";
import Button from "@material-ui/core/Button";

const Background = styled.div`
  background: ${CX_GRAY_BLUE};
  padding: 0%;
  font-size: 30px;

  position: absolute;
  top: 131px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const WallboardButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const styles = {
  button: {
    background: CX_OFF_WHITE,
    height: "15vh",
    width: "20vw",
    margin: "20px",
    fontSize: "35px",
    fontFamily: CX_FONT,
    color: BATMAN_GRAY,
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
  },
  title: {
    textAlign: "center",
    color: CX_OFF_WHITE,
    fontFamily: CX_FONT
  }
};

export default class NullWallboard extends React.Component {
  render() {
    return (
      <Background>
        <h1 style={styles.title}>Wallboard Not Found!</h1>
        <WallboardButtons>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button style={styles.button}>Home</Button>
          </Link>
        </WallboardButtons>
      </Background>
    );
  }
}
