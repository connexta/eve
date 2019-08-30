import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import Grafana from "../components/Grafana";
import { SOAESB_GRAFANA_URL } from "../utils/Link";
import styled from "styled-components";
import Github from "../components/Github";

const BUILD_STATUS_HEIGHT = 520;

const StyleBuildStatus = styled.div`
  height: ${BUILD_STATUS_HEIGHT}px;
  width: calc(100% - 30px);
  margin: 20px 20px 10px 10px;
`;

const StyleGrafana = styled.div`
  height: calc(100% - 80px);
  width: calc(100% - 30px);
  margin: 20px 10px 20px 20px;
`;

const StyleGithub = styled.div`
  height: calc(100% - ${BUILD_STATUS_HEIGHT}px - 100px);
  width: calc(100% - 30px);
  margin: 20px 20px 20px 10px;
`;

export default class SOAESBWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }} spacing={0}>
        <LeftBox item>
          <StyleGrafana>
            <Grafana name={"SOAESB"} url={SOAESB_GRAFANA_URL} />
          </StyleGrafana>
        </LeftBox>
        <RightBox item>
          <StyleBuildStatus>
            <BuildAF />
          </StyleBuildStatus>
          <StyleGithub>
            <Github repoPath={"codice/ddf"} />
          </StyleGithub>
        </RightBox>
      </Grid>
    );
  }
}
