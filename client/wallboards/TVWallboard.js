import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox, VARIANTS } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <BuildStatus variant={VARIANTS.TV} urlList={jenkinsURLList} />
          <Calendar variant={VARIANTS.TV} />
        </LeftBox>
        <RightBox item>
          <SlackComponent variant={VARIANTS.TV} />
          <Github repoPath={"codice/ddf"} variant={VARIANTS.TV} />
        </RightBox>
      </Grid>
    );
  }
}
