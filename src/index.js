import ReactDOM from "react-dom";
import React from "react";
import { CX_DARK_BLUE, CX_GRAY_BLUE } from "./Constants";
import logo from "../resources/logo-white.png";
import ClockFull from "./clock.js";
import BuildStatus from "./BuildStatus";
import SlackComponent from "./SlackComponent";
import Grid from "@material-ui/core/Grid";
import Github from "./githubCaller";
import { CX_FONT } from "./Constants";

const Logo = () => {
  return <img src={logo} alt="Logo" height="100vh" />;
};

const BOTTOM_HEIGHT = window.innerHeight - 124;

const styles = {
  root: {
    height: "100%",
    fontFamily: CX_FONT
  },
  banner: {
    background: CX_DARK_BLUE,
    height: "124px",
    width: "100%",
    margin: "0px",
    padding: "0 40px 0 40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bottom: {
    background: CX_GRAY_BLUE,
    width: "100%",
    height: BOTTOM_HEIGHT
  },
  leftBox: {
    padding: "40px 40px 40px 40px",
    height: "100%",
    width: "66%"
  },
  rightBox: {
    height: "100%",
    width: "34%"
  }
};

function Main() {
  return (
    <Grid container style={{ height: "100%" }}>
      <Grid container style={styles.banner}>
        <Logo />
        <ClockFull timezone="US/Arizona" place="PHX" />
        <ClockFull timezone="US/Mountain" place="DEN" />
        <ClockFull timezone="US/Eastern" place="BOS/DC" />
        <ClockFull timezone="Australia/Sydney" place="MEL (+1)" />
      </Grid>
      <Grid container style={styles.bottom}>
        <Grid item style={styles.leftBox}>
          {/* Left box content */}
          <BuildStatus />
        </Grid>
        <Grid item style={styles.rightBox}>
          {/* Right box content */}
          <SlackComponent />
          {/* <Github /> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

ReactDOM.render(<Main />, document.getElementById("iamroot"));
