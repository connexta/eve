import React from "react";
import { BATMAN_GRAY } from "../utils/Constants.js";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { hour, parseTimeString } from "../utils/TimeUtils.js";
import { AFJenkinLink, AFURL, AFpipeline } from "../utils/Link.js";
import { BOX_STYLE, BOX_HEADER, LEFT_BOX_STYLE } from "../styles/styles";
import makeTrashable from "trashable";

const styles = {
  listitemtext: {
    color: BATMAN_GRAY
  },
  listitemtextdots: {
    color: BATMAN_GRAY,
    textAlign: "center"
  },
  subheader: {
    margin: 0,
    fontSize: "24px"
  }
};

class BuildAF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      failedData: []
    };
  }

  // updates the build status around every midnight with timer checking current hour every 1 hour.
  componentDidMount() {
    this.updateBuildStatus();
    this.timerIntervalID = setInterval(() => this.timer(), hour); //1 hour interval
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    this.trashableFetchPromise.trash();
  }

  //if and only if the current time is 0 hour (midnight), trigger to update build status.
  timer() {
    let today = new Date();
    let currentHour = today.getHours();
    if (currentHour === 0) {
      this.updateBuildStatus();
    }
  }

  //fetch
  async updateBuildStatus() {
    this.trashableFetchPromise = makeTrashable(fetch(AFURL + "runs/"));

    await this.trashableFetchPromise
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
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
    return failedData;
  }

  //@return:
  //  icon of success or failure depends on the result
  //  followed by description of data content
  formatData(data) {
    //\u2705: WHITE HEAVY CHECK MARK to represent successful build
    //\u274C: CROSS MARK to represent failed build
    const icon = data.result === "SUCCESS" ? "	\u2705" : " \u274C";
    const description = data.description
      ? data.description
      : "build title not provided";

    return icon + " ( " + data.result + " ) " + description;
  }

  //@param:
  //  causes: name for the userID value pair in JSON format
  //@return:
  //  return builder if specified, else "timer"
  //  If causes is not defined at all, then return "unknown causes beyond our control"
  formatCauses(causes) {
    if (causes) {
      return causes[0].userId ? causes[0].userId : "timer";
    }
    return "unknown causes beyond our control";
  }

  //@return:
  //  unicode dots to represent trimmed data
  displayDots() {
    return (
      <ListItem>
        <ListItemText
          primary={"\u22EE"} //\u22EE: Vertical Ellipsis to represent trimmed data
          primaryTypographyProps={{ variant: "h5" }}
          style={styles.listitemtextdots}
        ></ListItemText>
      </ListItem>
    );
  }

  //@return:
  //  display list of build contents (builder [data.causes], build start time, build result, build description)
  displayListContents(data, index) {
    return (
      <ListItem key={index} button component="a" href={AFJenkinLink + data.id}>
        <ListItemText
          primary={this.formatData(data)}
          secondary={
            parseTimeString(data.startTime) +
            " Triggered by " +
            this.formatCauses(data.causes)
          }
          primaryTypographyProps={{ variant: "h5" }}
          secondaryTypographyProps={{ variant: "h6" }}
          style={styles.listitemtext}
        ></ListItemText>
      </ListItem>
    );
  }

  //return bullet format of failed Data and its content for display
  //if failed data has been trimmed for too many data, it will show ... for trimmed off data.
  //which will results in showing few most recent failed builds + ... + few most oldest failed builds
  //@param
  //  maxNum : total number of builds to show
  //  latestShowNum : number of most recent failed builds to show
  //@return
  //  first, returns builds number equal to latestShowNum
  //  second, if total number of failed data is larger than maxNum to show, returns ... (displaydots function) to represent trimmed data
  //  third, if there are more remaining data to show, return the remaining data.
  //  If there are no failed data to show at all, returns no builds detected string
  getListContents(maxNum, latestShowNum) {
    const { failedData } = this.state;
    if (failedData.length > 0) {
      return (
        <List>
          {failedData
            .slice(0, latestShowNum)
            .map((data, index) => this.displayListContents(data, index))}

          {failedData.length > maxNum ? this.displayDots() : undefined}

          {failedData.length > maxNum
            ? failedData
                .slice(failedData.length - (maxNum - latestShowNum))
                .map((data, index) => this.displayListContents(data, index))
            : failedData
                .slice(latestShowNum)
                .map((data, index) => this.displayListContents(data, index))}
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
      <Card style={{ ...LEFT_BOX_STYLE, ...BOX_STYLE }} raised={true}>
        Loading AF Builds. . .
      </Card>
    ) : (
      <Card style={{ ...LEFT_BOX_STYLE, ...BOX_STYLE }} raised={true}>
        <div style={BOX_HEADER} onClick={() => window.open(AFJenkinLink)}>
          {AFpipeline}
          <p style={styles.subheader}>
            Display failed build from most recent up to the last successful
            build
          </p>
        </div>
        {this.getListContents(4, 2)}
      </Card>
    );
  }
}

export default BuildAF;
