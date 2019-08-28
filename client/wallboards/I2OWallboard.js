import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { IONURL } from "../utils/Link";
import EventComponent from "../components/EventComponent";
import Github from "../components/Github";
import SlackComponent from "../components/SlackComponent";
import TeamBuildStatus from "../components/TeamBuildStatus";

import { RightBox } from "../styles/WallboardStyles";
import { SLACK_REPLICATION_CHANNEL } from "../utils/Config";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

const StyleBuild = styled.div`
  height: calc(100% - ${DEV_SPACE}px - 20px);
  width: calc(33% - 30px);
  margin: 20px 10px 20px 20px;
`;

const StyleEvent = styled.div`
  height: calc(100% - ${DEV_SPACE}px - 20px);
  width: calc(33% - 30px);
  margin: 20px 10px 20px 10px;
`;

const StyleSlack = styled.div`
  width: calc(100% - 30px);
  height: calc(100% - ${GITHUB_HEIGHT}px - ${DEV_SPACE}px - 40px);
  margin: 20px 20px 10px 10px;
`;

const StyleGithub = styled.div`
  width: calc(100% - 30px);
  height: ${GITHUB_HEIGHT}px;
  margin: 20px 20px 20px 10px;
`;

export default class I2OWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }} direction={"row"} spacing={0}>
        <StyleBuild>
          <TeamBuildStatus vertical={true} url={IONURL} name={"I2O"} />
        </StyleBuild>
        <StyleEvent>
          <EventComponent />
        </StyleEvent>
        <RightBox item>
          <StyleSlack>
            <SlackComponent channelID={SLACK_REPLICATION_CHANNEL} />
          </StyleSlack>
          <StyleGithub>
            <Github repoPath={"connexta/replication"} />
          </StyleGithub>
        </RightBox>
      </Grid>
    );
  }
}
