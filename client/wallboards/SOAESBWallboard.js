import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import Grafana from "../components/Grafana";

export default class SOAESBWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <Grafana />
        </LeftBox>
        <RightBox item>
          <BuildAF />
        </RightBox>
      </Grid>
    );
  }
}
