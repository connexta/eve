import React from "react";
import BuildStatus from "../BuildStatus";
import SlackComponent from "../SlackComponent";
import Github from "../githubCaller";
import { leftBox, rightBox } from "./WallboardStyles";
import Grid from "@material-ui/core/Grid";

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item style={leftBox}>
          <BuildStatus />
        </Grid>
        <Grid item style={rightBox}>
          <SlackComponent />
          <Github />
        </Grid>
      </Grid>
    );
  }
}
