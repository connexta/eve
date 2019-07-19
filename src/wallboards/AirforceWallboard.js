import React from "react";
import BuildStatus from "../BuildStatus";
import SlackComponent from "../SlackComponent";
import { leftBox, rightBox } from "./WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../BuildAF";

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
