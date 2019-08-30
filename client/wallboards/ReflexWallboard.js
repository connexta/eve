import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildStatus from "../components/BuildStatus";
import styled from "styled-components";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import { jenkinsURLList } from "../utils/Link";
import MediaComponent from "../components/MediaComponent";
import EventComponent from "../components/EventComponent";
import { SLACK_REFLEX_CHANNEL } from "../utils/Config";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

const StyleBuildStatus = styled.div`
  height: 160px;
  width: calc(100% - 30px);
  margin: 20px;
`;

const StyleGrafana = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  margin: 0px 10px 20px 20px;
`;

const StyleMedia = styled.div`
  height: 100%;
  width: calc(50% - 25px);
  margin: 0px 10px 20px 20px;
`;

const StyleEvent = styled.div`
  height: 100%;
  width: calc(50% - 25px);
  margin: 0px 0px 20px 10px;
`;

const StyleSlack = styled.div`
  width: calc(100% - 30px);
  height: calc(100% - ${DEV_SPACE}px - ${GITHUB_HEIGHT}px - 40px);
  margin: 20px 20px 10px 10px;
`;

const StyleGithub = styled.div`
  width: calc(100% - 30px);
  height: ${GITHUB_HEIGHT}px;
  margin: 20px 20px 20px 10px;
`;

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <StyleBuildStatus>
            <BuildStatus urlList={jenkinsURLList} />
          </StyleBuildStatus>
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <StyleMedia>
              <MediaComponent wallboard={"reflex"} />
            </StyleMedia>
            <StyleEvent>
              <EventComponent wallboard={"reflex"} />
            </StyleEvent>
          </Grid>
        </LeftBox>
        <RightBox item>
          <StyleSlack>
            <SlackComponent channelID={SLACK_REFLEX_CHANNEL} />
          </StyleSlack>
          <StyleGithub>
            <Github repoPath={"codice/ddf"} />
          </StyleGithub>
        </RightBox>
      </Grid>
    );
  }
}
