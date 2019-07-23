import ReactDOM from "react-dom";
import React from "react";
import {
  CX_DARK_BLUE,
  CX_GRAY_BLUE,
  CX_FONT,
  CX_OFF_WHITE
} from "./utils/Constants";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";
import logo from "../resources/logo-offwhite.png";
import Clock from "./components/Clock";
import Grid from "@material-ui/core/Grid";

export const BANNER_HEIGHT = 124;

const styles = {
  root: {
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    fontFamily: CX_FONT,
    background: CX_GRAY_BLUE
  },
  banner: {
    background: CX_DARK_BLUE,
    height: BANNER_HEIGHT,
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
    position: "absolute",
    top: BANNER_HEIGHT,
    bottom: 0
  },
  logo: {
    margin: "0 0 12px 0"
  },
  // For message in bottom left corner
  DevMessage: {
    color: CX_OFF_WHITE,
    fontSize: "20px",
    position: "absolute",
    bottom: 0,
    marginLeft: "24px"
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
        <Clock timezone="US/Arizona" place="PHX" />
        <Clock timezone="US/Mountain" place="DEN" />
        <Clock timezone="US/Eastern" place="BOS" />
        <Clock timezone="Australia/Melbourne" place="MEL" />
      </Grid>
      <Grid item style={styles.bottom}>
        <Switch>
          {wallboards.map(wallboard => {
            return <Route {...wallboard} exact />;
          })}
          <Route component={NullWallboard} />
        </Switch>
        <div style={styles.DevMessage}>
          <p>Work in Progress, contact @vina, @matt or join #wallboard-dev</p>
        </div>
      </Grid>
    </Grid>
  </Router>,
  document.getElementById("iamroot")
);
