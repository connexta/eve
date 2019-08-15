import React from "react";
import styled from "styled-components";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";
import MediaComponent from "../components/MediaComponent";
import EventComponent from "../components/EventComponent";

const styles = {
  cardContent: {
    padding: "4px",
    width: "15%"
  }
};

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }} spacing={0}>
        <LeftBox item>
          <BuildStatus
            urlList={jenkinsURLList}
            cardContentStyle={styles.cardContent}
          />
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent />
            <EventComponent />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent />
          <Github repoPath={"codice/ddf"} />
        </RightBox>
      </Grid>
    );
  }
}
