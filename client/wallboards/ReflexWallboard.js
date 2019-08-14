import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox>
          <BuildStatus urlList={jenkinsURLList} />
        </LeftBox>
        <RightBox item>
          <SlackComponent />
        </RightBox>
      </Grid>
    );
  }
}
