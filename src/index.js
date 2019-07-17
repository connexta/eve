import ReactDOM from "react-dom";
import React from "react";
import { CX_DARK_BLUE, CX_GRAY_BLUE, CX_FONT } from "./Constants";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";
import logo from "../resources/logo-offwhite.png";
import ClockFull from "./clock.js";
import Grid from "@material-ui/core/Grid";

const BOTTOM_HEIGHT = window.innerHeight - 124;

const styles = {
  root: {
    height: "100%",
    fontFamily: CX_FONT,
    background: CX_GRAY_BLUE
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
  logo: {
    margin: "0 0 12px 0"
  }
};

const Logo = () => {
  return <img style={styles.logo} src={logo} alt="Logo" height="104px" />;
};

ReactDOM.render(
  <Router>
    <Grid container style={styles.root}>
      <Grid container style={styles.banner}>
        <Link to="/">
          <Logo />
        </Link>
        <ClockFull timezone="US/Arizona" place="PHX" />
        <ClockFull timezone="US/Mountain" place="DEN" />
        <ClockFull timezone="US/Eastern" place="BOS/DC" />
        <ClockFull timezone="Australia/Melbourne" place="MEL (+1)" />
      </Grid>
      <Grid item style={styles.bottom}>
        <Switch>
          {wallboards.map(wallboard => {
            return <Route {...wallboard} exact />;
          })}
          <Route component={NullWallboard} />
        </Switch>
      </Grid>
    </Grid>
  </Router>,
  document.getElementById("iamroot")
);
