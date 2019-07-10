import React from "react";
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
    color: CX_OFF_WHITE
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

  // updates the build status every 24 hour
  componentDidMount() {
    this.setState({
      data: [],
      isLoading: true,
      failedData: []
    });
    this.updateBuildStatus();
    this.refreshIntervalID = setInterval(() => this.updateBuildStatus(), 60000);
  }

  componentWillUnmount(){
    clearInterval(this.refreshIntervalID);
  }

  updateBuildStatus() {
    fetch(this.props.URL + "runs/")
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

  //obtain all failed build in Jenkins up to the last successful build,
  //including the last successful build.
  getFailedData(jsonData) {
    let failedData = [];
    for (let i = 0; i < jsonData.length; i++) {
      failedData.push(jsonData[i]);
      if (jsonData[i].result == "SUCCESS") {
        break;
      }
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
                  primary={"\u22EE"} //\u22EE: Vertical Ellipsis to represent trimmed data
                  primaryTypographyProps={{ variant: "h5" }}
                  style={styles.listitemtextdots}
                ></ListItemText>
              </ListItem>
            ) : (
              <ListItem
                key={index}
                button
                component="a"
                href={this.props.jenkinlink + data.id}
              >
                <ListItemText
                  primary={
                    //\u2705: WHITE HEAVY CHECK MARK to represent successful build
                    //\u274C: CROSS MARK to represent failed build
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
          title={this.props.pipeline}
          subheader="Display failed build from most recent up to the last successful build"
          style={styles.cardheader}
          component="a"
          href={this.props.jenkinlink}
          titleTypographyProps={{ variant: "h4" }}
          subheaderTypographyProps={{ variant: "h6", color: "inherit" }}
        ></CardHeader>
        {this.getListContents()}
      </Card>
    );
  }
}

export default BuildAF;
