import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import { leftBox, rightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <Grid item style={leftBox}>
          <BuildStatus />
          <BuildAF />
        </Grid>
        <Grid item style={rightBox}>
          <SlackComponent />
        </Grid>
      </Grid>
    );
  }
}
