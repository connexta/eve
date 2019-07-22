import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import { leftBox, rightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <Grid item style={leftBox}>
          <BuildStatus />
        </Grid>
        <Grid item style={rightBox}>
          <SlackComponent />
          <Github repoPath={"codice/ddf"} />
        </Grid>
      </Grid>
    );
  }
}
