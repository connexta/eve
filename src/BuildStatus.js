import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";

const BUILD_LIST = ["alliance", "aus", "ddf", "gsr", "dib"];

const URL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

const styles = {
  card: {
    background: CX_OFF_WHITE,
    fontSize: "50px",
    color: BATMAN_GRAY,
    "font-family": CX_FONT
  },
  cardheader: {
    background: CX_OFF_WHITE,
    color: BATMAN_GRAY,
    "font-family": CX_FONT
  },
  cardContent: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "space-between",
    "flex-wrap": "wrap"
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
      <Card raised="true" style={styles.card}>
        Loading Build Health. . .
      </Card>
    ) : (
      <Card raised="true" style={styles.card}>
        <CardHeader
          title="Build Health"
          style={styles.cardheader}
          titleTypographyProps={{ variant: "h3" }}
        />
        <CardContent style={styles.cardContent}>
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
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
