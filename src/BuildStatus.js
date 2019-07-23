import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants";
import BuildIcon from "./BuildIcon";
import { Card, CardContent } from "@material-ui/core";
import { overviewURL, jenkinsURLList } from "./lib/Link";
import { BOX_STYLE, BOX_HEADER } from "./styles";
import { hour, getRelativeTime } from "./utilities/TimeUtils";

export const BUILD_STATUS_HEIGHT = 160;

const styles = {
  card: {
    height: BUILD_STATUS_HEIGHT,
    width: "calc(100% - 24px)"
  },
  cardheader: {
    background: CX_OFF_WHITE,
    color: BATMAN_GRAY,
    fontFamily: CX_FONT
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    fontSize: "32px"
  }
};

const aliases = {
  SOAESB_Nightly_Release_Builder: "AF"
};

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), hour);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  //a function that continuously be called by each set interval in componentDidMount() to fetch/update each team status for display
  //overallData: temporary array to collect each team status before pushing to setState: data
  //index: to keep track of each team status in the array overallData.
  //update data for displayName, weatherScore, last build time.
  async refreshBuildStatus() {
    let overallData = [];
    let index = 0;

    //fetch/update overview data for each team (except AF) for displayName and weatherScore
    let promise = this.fetchData(overviewURL);
    await promise
      .then(values => {
        values.forEach(item => {
          if (jenkinsURLList[item.displayName.toLowerCase()]) {
            index = this.updateData(item, overallData, index);
          }
        });
      })
      .catch(e => console.log("error", e));

    //fetch/update overview data for AF team for displayName and weatherScore
    promise = this.fetchData(jenkinsURLList["af"]);
    await promise
      .then(item => {
        index = this.updateData(item, overallData, index);
      })
      .catch(e => console.log("error", e));

    //fetch/update last time build status for each team
    let promises = [];
    for (URL in jenkinsURLList) {
      promises.push(this.fetchData(jenkinsURLList[URL]));
    }

    await Promise.all(promises)
      .then(values => {
        for (let i = 0; i < values.length; i++) {
          overallData[i].time =
            "Built " + getRelativeTime(new Date(values[i].latestRun.startTime));
        }
      })
      .catch(e => console.log("error", e));

    //push all collected data to data state, and make it ready to display.
    this.setState({ data: overallData, isLoading: false });
  }

  //fetch data from the jenkin url
  fetchData(URL) {
    return fetch(URL)
      .then(response => response.json())
      .catch(e => console.log("error", e));
  }

  //general function to convert name to alias for easy display if alias exists
  //@return:
  //  return alias if exists otherwise original name
  //  i.e. if name is AF specific repo name, convert to "AF" instead for easy display
  //  otherwise, display its original name.
  aliasOf(displayName) {
    return aliases[displayName] ? aliases[displayName] : displayName;
  }

  //update overallData from item and return index for following array assignment
  //@param:
  //  item: that contains information for array overallData to be updated
  //  overallData: array to pass down to keep each build information such as displayName
  //  index: used to assign for each build information in the array
  //@return:
  //  index: to be passed down for next functions
  updateData(item, overallData, index) {
    overallData[index] = {
      displayName: this.aliasOf(item.displayName),
      weatherScore: item.weatherScore,
      time: ""
    };
    return ++index;
  }

  render() {
    return this.state.isLoading ? (
      <Card style={{ ...BOX_STYLE, ...styles.card }} raised={true}>
        <p style={BOX_HEADER}>Loading Build Health. . .</p>
      </Card>
    ) : (
      <Card style={{ ...BOX_STYLE, ...styles.card }} raised={true}>
        <p style={BOX_HEADER}>Build Health</p>
        <CardContent style={styles.cardContent}>
          {this.state.data.map(item => {
            return (
              <BuildIcon
                score={item.weatherScore}
                name={item.displayName}
                key={item.displayName}
                time={item.time}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
