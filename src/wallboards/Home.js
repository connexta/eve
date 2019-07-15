import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../Constants";
import { SolidBackground, WallboardButtons } from "./WallboardStyles";
import Button from "@material-ui/core/Button";

// Add name of wallboard variant here
const VARIANTS = ["tv", "airforce", "gsr"];

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

export default class Home extends React.Component {
  render() {
    return (
      <SolidBackground>
        <h1 style={styles.title}>Choose Wallboard Variant</h1>
        <WallboardButtons>
          {/* generate links and paths through VARIANTS list */}
          {VARIANTS.map(wallboard => {
            let path = "/" + wallboard + "/";
            return (
              <Link
                to={path}
                style={{ textDecoration: "none" }}
                key={wallboard}
              >
                <Button style={styles.button}>{wallboard}</Button>
              </Link>
            );
          })}
        </WallboardButtons>
      </SolidBackground>
    );
  }
}
