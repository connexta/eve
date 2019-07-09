import React from "react";
import styled from "styled-components";
import {
  CX_OFF_WHITE,
  CX_FONT,
  CX_DARK_BLUE,
  BATMAN_GRAY
} from "./Constants.js";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

//URL for the AF team main repo to keep track of
const AFURL =
  "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/";

//Specific AF team Git build pipeline to keep track of
const AFpipeline = "SOAESB_Nightly_Release_Builder";

//URL for the AF team main repo Jenkins
const AFJenkinLink =
  "http://jenkins.phx.connexta.com/service/jenkins/job/HAART-Jobs/job/SOAESB_Nightly_Release_Builder/";

const Builds = styled.div`
  width: 55vw;
  height: 200px;
  border: solid black 3px;
  border-radius: 20px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 2em;
  font-family: ${CX_FONT};
`;

const BuildAFDetail = styled.ul`
  display: flex;
`;

const styles = {
  card: {
    top: "20px",
    position: "relative",
    boxShadow: `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
    background: CX_OFF_WHITE,
    fontFamily: CX_FONT,
    color: BATMAN_GRAY
  },
  cardheader: {
    background: CX_DARK_BLUE,
    textDecoration: "none",
    color: BATMAN_GRAY
  },
  listitemtext: {
    color: BATMAN_GRAY
  },
  listitemtextdots: {
    color: BATMAN_GRAY,
    textAlign: "center"
  }
};

//Reformat extracted time for better display
function extractTime(time) {
  if (time) {
    let extractedTime = time.split("T");
    extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
    return extractedTime;
  }
}

class BuildAF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      failedData: []
    };
  }

  // updates the build status every 60 sec
  componentDidMount() {
    this.setState({
      data: [],
      isLoading: true,
      failedData: []
    });
    this.refreshBuildStatus();
    setInterval(() => this.refreshBuildStatus(), 60000);
  }

  refreshBuildStatus() {
    this.updateBuildStatus();
  }

  updateBuildStatus() {
    fetch(AFURL + AFpipeline + "/runs/")
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          data: jsonData,
          isLoading: false,
          failedData: this.getFailedData(jsonData)
        });
      })
      .catch(e => console.log("error", e));
  }

  //obtain all failed build in Jenkins up to last successful build
  getFailedData(jsonData) {
    let failedData = [];

    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].result == "SUCCESS") {
        failedData.push(jsonData[i]);
        break;
      }
      failedData.push(jsonData[i]);
    }

    return this.trimFailedData(failedData);
  }

  //trim the number of failed build data equals to numOfListItemstoKeep
  //display the most recent failed data equal to numOfLatestItemstoShow
  trimFailedData(failedData) {
    let numOfListItemstoKeep = 4;
    let numOfLatestItemstoShow = 2;
    if (failedData.length > numOfListItemstoKeep) {
      failedData.splice(
        numOfLatestItemstoShow,
        failedData.length - numOfListItemstoKeep,
        { description: "..." }
      );
    }
    return failedData;
  }

  //return bullet format of failed Data and its content for display
  //if failed data has been trimmed for too many data, it will show ... for trimmed off data.
  getListContents() {
    if (this.state.failedData.length > 0) {
      return (
        <List>
          {this.state.failedData.map((data, index) =>
            data.description === "..." ? (
              <ListItem key={index}>
                <ListItemText
                  primary={"\u22EE"}
                  primaryTypographyProps={{ variant: "h5" }}
                  style={styles.listitemtextdots}
                ></ListItemText>
              </ListItem>
            ) : (
              <ListItem
                key={index}
                button
                component="a"
                href={AFJenkinLink + data.id}
              >
                <ListItemText
                  primary={
                    (data.result === "SUCCESS" ? "	\u2705 (" : " \u274C (") +
                    data.result +
                    ") " +
                    (data.description
                      ? data.description
                      : "build title not provided")
                  }
                  secondary={
                    extractTime(data.startTime) +
                    " Triggered by " +
                    (data.causes
                      ? data.causes[0].userId
                        ? data.causes[0].userId
                        : "timer"
                      : "")
                  }
                  primaryTypographyProps={{ variant: "h5" }}
                  secondaryTypographyProps={{ variant: "h6" }}
                  style={styles.listitemtext}
                ></ListItemText>
              </ListItem>
            )
          )}
        </List>
      );
    } else {
      return (
        <List>
          <ListItem>
            <ListItemText
              primary={"No Builds Detected"}
              primaryTypographyProps={{ variant: "h5" }}
            ></ListItemText>
          </ListItem>
        </List>
      );
    }
  }

  render() {
    return this.state.isLoading ? (
      <Card style={styles.card}>Loading. . .</Card>
    ) : (
      <Card style={styles.card}>
        <CardHeader
          title={AFpipeline}
          subheader="Display failed build from most recent up to the last successful build"
          style={styles.cardheader}
          button
          component="a"
          href={AFJenkinLink}
          titleTypographyProps={{ variant: "h4" }}
          subheaderTypographyProps={{ variant: "h6" }}
        ></CardHeader>
        {this.getListContents()}
      </Card>
    );
  }
}

export default BuildAF;
