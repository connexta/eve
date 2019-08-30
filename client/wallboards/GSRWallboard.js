import React from "react";
import styled from "styled-components";

import EventComponent from "../components/EventComponent";
import Github from "../components/Github";
import MediaComponent from "../components/MediaComponent";
import ReleaseVersion from "../components/ReleaseVersion";
import SlackComponent from "../components/SlackComponent";
import BuildStatus from "../components/BuildStatus";

import { LeftBox, RightBox } from "../styles/WallboardStyles";
import { GSRUrlList } from "../utils/Link";
import { SLACK_GSR_DEV_CHANNEL } from "../utils/Config";
import Grid from "@material-ui/core/Grid";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

const StyleBuildStatus = styled.div`
  height: 160px;
  width: calc(50% - 30px);
  margin: 20px 10px 10px 20px;
`;

const StyleRelease = styled.div`
  height: 160px;
  width: calc(50% - 30px);
  margin: 20px 0px 10px 10px;
`;

const StyleMedia = styled.div`
  height: 100%;
  width: calc(50% - 30px);
  margin: 10px 10px 20px 20px;
`;

const StyleEvent = styled.div`
  height: 100%;
  width: calc(50% - 30px);
  margin: 10px 10px 20px 10px;
`;

const StyleSlack = styled.div`
  margin: 20px 20px 0px 0px;
  width: calc(100% - 20px);
  height: calc(100% - ${GITHUB_HEIGHT}px - ${DEV_SPACE}px - 40px);
`;

const StyleGithub = styled.div`
  margin: 20px 20px 20px 0px;
  width: calc(100% - 20px);
  height: ${GITHUB_HEIGHT}px;
`;

export default class GSRWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox>
          <Grid container direction="row">
            <StyleBuildStatus>
              <BuildStatus urlList={GSRUrlList} />
            </StyleBuildStatus>
            <StyleRelease>
              <ReleaseVersion />
            </StyleRelease>
          </Grid>
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <StyleMedia>
              <MediaComponent wallboard={"gsr"} />
            </StyleMedia>
            <StyleEvent>
              <EventComponent wallboard={"gsr"} />
            </StyleEvent>
          </Grid>
        </LeftBox>
        <RightBox item>
          <StyleSlack>
            <SlackComponent channelID={SLACK_GSR_DEV_CHANNEL} />
          </StyleSlack>
          <StyleGithub>
            <Github repoPath={"connexta/gsr-yorktown"} />
          </StyleGithub>
        </RightBox>
      </Grid>
    );
  }
}
