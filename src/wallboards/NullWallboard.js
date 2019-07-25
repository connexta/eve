import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants";
import { HOMEBASE, WallBoardButtons } from "../styles/WallboardStyles";
import Button from "@material-ui/core/Button";

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
      <div style={HOMEBASE}>
        <h1 style={styles.title}>Wallboard Not Found!</h1>
        <div style={WallBoardButtons}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button style={styles.button}>Home</Button>
          </Link>
        </div>
      </div>
    );
  }
}
