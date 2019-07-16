import ReactDOM from "react-dom";
import React from "react";
import {
  CX_DARK_BLUE,
  CX_GRAY_BLUE,
  CX_FONT,
  CX_OFF_WHITE,
  BATMAN_GRAY
} from "./Constants";
import logo from "../resources/logo-offwhite.png";
import ClockFull from "./clock.js";
import BuildStatus from "./BuildStatus";
import SlackComponent from "./SlackComponent";
import Grid from "@material-ui/core/Grid";
import Github from "./githubCaller";

export const BOX_STYLE = {
  margin: "24px",
  fontSize: "20px",
  color: BATMAN_GRAY,
  backgroundColor: CX_OFF_WHITE,
  fontFamily: CX_FONT
};

export const BOX_HEADER = {
  fontSize: "32px",
  color: CX_GRAY_BLUE,
  margin: "12px 0 0 12px"
};

import styled from "styled-components";
import { CX_DARK_BLUE } from "./Constants";
import logo from "../resources/logo-white.png";
import ClockFull from "./clock.js";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";

const Banner = styled.nav`
  background: ${CX_DARK_BLUE};
  padding-left: 40px;
  padding-right: 40px;
  margin: 0%;
  height: 125px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;


const BOTTOM_HEIGHT = window.innerHeight - 124;

const styles = {
  root: {
    height: "100%",
    fontFamily: CX_FONT,
    background: CX_OFF_WHITE
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
    width: "100%",
    height: BOTTOM_HEIGHT
  },
  leftBox: {
    height: "100%",
    width: "66%"
  },
  rightBox: {
    height: "100%",
    width: "34%"
  },
  logo: {
    margin: "0 0 0 0"
  }
};

const Logo = () => {
  return <img style={styles.logo} src={logo} alt="Logo" height="120px" />;
};

function Main() {
  return (
    <Grid container style={styles.root}>
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
          <Github />
        </Grid>
      </Grid>
    </Grid>
  );
}
ReactDOM.render(
  <div>
    <Router>
      <MainGridVert>
        <Banner>
          <Link to="/">
            <Logo />
          </Link>
          <ClockFull timezone="US/Arizona" place="PHX" />
          <ClockFull timezone="US/Mountain" place="DEN" />
          <ClockFull timezone="US/Eastern" place="BOS/DC" />
          <ClockFull timezone="Australia/Melbourne" place="MEL (+1)" />
        </Banner>
        <Switch>
          {wallboards.map(wallboard => {
            return <Route {...wallboard} exact />;
          })}
          <Route component={NullWallboard} />
        </Switch>
      </MainGridVert>
    </Router>
  </div>,


ReactDOM.render(<Main />, document.getElementById("iamroot"));
