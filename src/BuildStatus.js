import React from "react";
import styled from "styled-components";
import {
  CX_OFF_WHITE,
  CX_FONT,
  CX_GRAY_BLUE,
  CX_DARK_BLUE,
  BATMAN_GRAY
} from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, GridList } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const BUILD_LIST = ["alliance", "aus", "ddf", "gsr", "dib"];

const URL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

const Builds = styled.div`
  width: 55vw;
  height: 200px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  font-size: 2em;
  font-family: ${CX_FONT};
  color: ${BATMAN_GRAY};

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

const styles = {
  card: {},
  cardheader: {
    background: "#f2f2f2"
  }
};

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true
    };
  }

  // updates the build status every 60 sec
  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refreshBuildStatus() {
    fetch(URL)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ data: jsonData, isLoading: false });
      })
      .catch(e => console.log("error", e));
  }

  render() {
    return this.state.isLoading ? (
      <Card>Loading. . .</Card>
    ) : (
      <Card raised="true">
        <CardHeader title="Build Status" style={styles.cardheader} />
        <GridList>
          {this.state.data.map(item => {
            if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
              return (
                <BuildIcon
                  score={item.weatherScore}
                  name={item.displayName}
                  key={item.displayName}
                />
              );
            }
          })}
        </GridList>
      </Card>
    );
  }
}

export default BuildStatus;
