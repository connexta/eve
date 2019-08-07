import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import { LeftBox, RightBox, VARIANTS } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox>
          <BuildStatus variant={VARIANTS.AIRFORCE} urlList={jenkinsURLList} />
          <BuildAF variant={VARIANTS.AIRFORCE} />
        </LeftBox>
        <RightBox item>
          <SlackComponent variant={VARIANTS.AIRFORCE} />
        </RightBox>
      </Grid>
    );
  }
}
